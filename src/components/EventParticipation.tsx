
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Calendar, Clock, MessageSquare, Users } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface EventParticipationProps {
  event: any;
  onBack: () => void;
}

const EventParticipation = ({ event, onBack }: EventParticipationProps) => {
  const [participantName, setParticipantName] = useState('');
  const [responses, setResponses] = useState<{ [key: string]: 'available' | 'maybe' | 'unavailable' }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [allResponses, setAllResponses] = useState<any[]>([]);

  useEffect(() => {
    fetchAllResponses();
  }, [event.id]);

  const fetchAllResponses = async () => {
    try {
      const { data, error } = await supabase
        .from('event_responses')
        .select('*')
        .eq('event_id', event.id)
        .order('submitted_at', { ascending: true });

      if (error) {
        console.error('Error fetching responses:', error);
        return;
      }

      setAllResponses(data || []);
    } catch (error) {
      console.error('Error fetching responses:', error);
    }
  };

  const handleResponseChange = (dateOption: string, response: 'available' | 'maybe' | 'unavailable') => {
    setResponses({ ...responses, [dateOption]: response });
  };

  const handleCommentChange = (dateOption: string, comment: string) => {
    setComments({ ...comments, [dateOption]: comment });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const responseData = {
        event_id: event.id,
        participant_name: participantName,
        responses,
        comments,
      };

      console.log('Submitting response:', responseData);
      
      const { error } = await supabase
        .from('event_responses')
        .upsert(responseData, {
          onConflict: 'event_id,participant_name'
        });

      if (error) {
        throw error;
      }
      
      toast.success('回答を送信しました！');
      fetchAllResponses(); // 回答一覧を更新
    } catch (error) {
      toast.error('回答の送信に失敗しました');
      console.error('Error submitting response:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('ja-JP', { 
        month: 'long', 
        day: 'numeric', 
        weekday: 'short' 
      }),
      time: date.toLocaleTimeString('ja-JP', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const getResponseButtonStyle = (dateOption: string, responseType: 'available' | 'maybe' | 'unavailable') => {
    const isSelected = responses[dateOption] === responseType;
    if (responseType === 'available') {
      return isSelected ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200';
    } else if (responseType === 'maybe') {
      return isSelected ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200';
    } else {
      return isSelected ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200';
    }
  };

  const getResponseSymbol = (response: string) => {
    switch (response) {
      case 'available': return '○';
      case 'maybe': return '△';
      case 'unavailable': return '×';
      default: return '-';
    }
  };

  const getResponseCellStyle = (response: string) => {
    switch (response) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'maybe': return 'bg-yellow-100 text-yellow-800';
      case 'unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  const getDateSummary = (dateOption: string) => {
    const summary = { available: 0, maybe: 0, unavailable: 0 };
    allResponses.forEach(response => {
      const dateResponse = response.responses[dateOption];
      if (dateResponse) {
        summary[dateResponse as keyof typeof summary]++;
      }
    });
    return summary;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
          {event.description && (
            <p className="text-gray-600 mt-2">{event.description}</p>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>参加者情報</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="name">お名前</Label>
                    <Input
                      id="name"
                      value={participantName}
                      onChange={(e) => setParticipantName(e.target.value)}
                      placeholder="山田太郎"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>日程の回答</CardTitle>
                  <CardDescription>
                    各候補日程について、参加可否をお答えください
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {event.date_options.map((dateOption: string, index: number) => {
                    const { date, time } = formatDateTime(dateOption);
                    const summary = getDateSummary(dateOption);
                    return (
                      <div key={index} className="border rounded-lg p-4 space-y-4">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-5 h-5 text-blue-500" />
                          <div className="flex-1">
                            <div className="font-semibold">{date}</div>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {time}
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            ○{summary.available} △{summary.maybe} ×{summary.unavailable}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={getResponseButtonStyle(dateOption, 'available')}
                            onClick={() => handleResponseChange(dateOption, 'available')}
                          >
                            ○ 参加
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={getResponseButtonStyle(dateOption, 'maybe')}
                            onClick={() => handleResponseChange(dateOption, 'maybe')}
                          >
                            △ 微妙
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className={getResponseButtonStyle(dateOption, 'unavailable')}
                            onClick={() => handleResponseChange(dateOption, 'unavailable')}
                          >
                            × 不参加
                          </Button>
                        </div>

                        <div>
                          <Label htmlFor={`comment-${index}`} className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            コメント（任意）
                          </Label>
                          <Textarea
                            id={`comment-${index}`}
                            value={comments[dateOption] || ''}
                            onChange={(e) => handleCommentChange(dateOption, e.target.value)}
                            placeholder="この日程についてコメントがあれば記入してください"
                            rows={2}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? '送信中...' : '回答を送信'}
              </Button>
            </form>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  参加者回答状況
                </CardTitle>
                <CardDescription>
                  現在の回答状況（{allResponses.length}名回答済み）
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allResponses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[100px]">参加者</TableHead>
                          {event.date_options.map((dateOption: string, index: number) => {
                            const { date, time } = formatDateTime(dateOption);
                            return (
                              <TableHead key={index} className="text-center min-w-[120px]">
                                <div className="text-xs">
                                  <div>{date}</div>
                                  <div>{time}</div>
                                </div>
                              </TableHead>
                            );
                          })}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allResponses.map((response, responseIndex) => (
                          <TableRow key={responseIndex}>
                            <TableCell className="font-medium align-top">
                              {response.participant_name}
                            </TableCell>
                            {event.date_options.map((dateOption: string, dateIndex: number) => {
                              const dateResponse = response.responses[dateOption];
                              const dateComment = response.comments?.[dateOption];
                              return (
                                <TableCell 
                                  key={dateIndex} 
                                  className={`text-center align-top ${getResponseCellStyle(dateResponse)}`}
                                >
                                  <div className="space-y-1">
                                    <div className="font-semibold">
                                      {getResponseSymbol(dateResponse)}
                                    </div>
                                    {dateComment && (
                                      <div className="text-xs text-gray-600 max-w-[100px] break-words">
                                        <MessageSquare className="w-3 h-3 inline mr-1" />
                                        {dateComment}
                                      </div>
                                    )}
                                  </div>
                                </TableCell>
                              );
                            })}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    まだ回答がありません
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventParticipation;
