
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from 'lucide-react';
import { toast } from "sonner";

interface CreateEventProps {
  onBack: () => void;
}

const CreateEvent = ({ onBack }: CreateEventProps) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [dateOptions, setDateOptions] = useState<string[]>(['']);
  const [isCreating, setIsCreating] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // ここでSupabaseにデータを保存する処理を追加予定
      const eventData = {
        title: eventTitle,
        description: eventDescription,
        dateOptions: dateOptions.filter(option => option.trim() !== ''),
        created_at: new Date().toISOString(),
      };

      console.log('Creating event:', eventData);
      
      // 仮のイベントID生成（実際はSupabaseで自動生成される）
      const eventId = Math.random().toString(36).substr(2, 9);
      
      toast.success(`飲み会が作成されました！\nイベントID: ${eventId}\n参加者にこのIDを共有してください。`);
      
      // リセット
      setEventTitle('');
      setEventDescription('');
      setDateOptions(['']);
    } catch (error) {
      toast.error('飲み会の作成に失敗しました');
      console.error('Error creating event:', error);
    } finally {
      setIsCreating(false);
    }
  };

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
                        type="datetime-local"
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
