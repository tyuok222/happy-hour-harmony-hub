import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X, Copy, Check } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CreateEventProps {
  onBack: () => void;
}

const CreateEvent = ({ onBack }: CreateEventProps) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [dateOptions, setDateOptions] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const addDateOption = () => {
    setDateOptions([...dateOptions, '']);
  };

  const updateDateOption = (index: number, value: string) => {
    const newOptions = [...dateOptions];
    newOptions[index] = value;
    setDateOptions(newOptions);
  };

  const removeDateOption = (index: number) => {
    if (dateOptions.length > 1) {
      setDateOptions(dateOptions.filter((_, i) => i !== index));
    }
  };

  const copyToClipboard = async () => {
    if (createdEvent?.short_id) {
      await navigator.clipboard.writeText(createdEvent.short_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('イベントIDをコピーしました！');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        date_options: dateOptions.filter(option => option.trim() !== ''),
      };

      console.log('Creating event:', eventData);
      
      const { data, error } = await supabase
        .from('events')
        .insert(eventData)
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      setCreatedEvent(data);
      toast.success('飲み会が作成されました！');
    } catch (error) {
      toast.error('飲み会の作成に失敗しました');
      console.error('Error creating event:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateAnother = () => {
    setCreatedEvent(null);
    setEventTitle('');
    setEventDescription('');
    setDateOptions(['']);
  };

  if (createdEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button onClick={onBack} variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              ホームに戻る
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">飲み会が作成されました！</h1>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-green-600">作成完了</CardTitle>
              <CardDescription>
                飲み会「{createdEvent.title}」が正常に作成されました
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <Label className="text-lg font-semibold text-gray-700">イベントID</Label>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex-1 bg-white p-3 rounded border-2 border-blue-200">
                    <span className="text-2xl font-mono font-bold text-blue-600">
                      {createdEvent.short_id}
                    </span>
                  </div>
                  <Button 
                    onClick={copyToClipboard}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        コピー済み
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        コピー
                      </>
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  参加者にこのイベントIDを共有してください。
                  参加者は「飲み会に参加」からこのIDを入力して回答できます。
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleCreateAnother} variant="outline" className="flex-1">
              別の飲み会を作成
            </Button>
            <Button onClick={onBack} className="flex-1">
              ホームに戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button onClick={onBack} variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            戻る
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">新しい飲み会を企画</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>飲み会の詳細</CardTitle>
            <CardDescription>
              飲み会のタイトルと候補日程を設定してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">飲み会のタイトル</Label>
                <Input
                  id="title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="例: 年末忘年会"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">説明（任意）</Label>
                <Textarea
                  id="description"
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  placeholder="飲み会の詳細や注意事項があれば記入してください"
                  rows={3}
                />
              </div>

              <div>
                <Label>候補日程</Label>
                <div className="space-y-3 mt-2">
                  {dateOptions.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        type="date"
                        value={option}
                        onChange={(e) => updateDateOption(index, e.target.value)}
                        required
                        className="flex-1"
                      />
                      {dateOptions.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeDateOption(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addDateOption}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    候補日程を追加
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? '作成中...' : '飲み会を作成'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEvent;
