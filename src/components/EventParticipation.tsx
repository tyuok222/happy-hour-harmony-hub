
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Calendar, Clock, MessageSquare } from 'lucide-react';
import { toast } from "sonner";

interface EventParticipationProps {
  event: any;
  onBack: () => void;
}

const EventParticipation = ({ event, onBack }: EventParticipationProps) => {
  const [participantName, setParticipantName] = useState('');
  const [responses, setResponses] = useState<{ [key: string]: 'available' | 'maybe' | 'unavailable' }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        eventId: event.id,
        participantName,
        responses,
        comments,
        submittedAt: new Date().toISOString(),
      };

      console.log('Submitting response:', responseData);
      
      // ここでSupabaseに回答データを保存する処理を追加予定
      
      toast.success('回答を送信しました！');
      onBack();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
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
              {event.dateOptions.map((dateOption: string, index: number) => {
                const { date, time } = formatDateTime(dateOption);
                return (
                  <div key={index} className="border rounded-lg p-4 space-y-4">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold">{date}</div>
                        <div className="flex items-center gap-1 text-gray-600">
                          <Clock className="w-4 h-4" />
                          {time}
                        </div>
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
    </div>
  );
};

export default EventParticipation;
