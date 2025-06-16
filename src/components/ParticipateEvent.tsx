
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from 'lucide-react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import EventParticipation from "@/components/EventParticipation";

interface ParticipateEventProps {
  onBack: () => void;
}

const ParticipateEvent = ({ onBack }: ParticipateEventProps) => {
  const [eventId, setEventId] = useState('');
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log('Joining event:', eventId);
      
      // 短いIDで検索を試みる
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('short_id', eventId)
        .single();

      if (error || !data) {
        throw new Error('Event not found');
      }

      setCurrentEvent(data);
      toast.success('イベントに参加しました！');
    } catch (error) {
      toast.error('イベントが見つかりません');
      console.error('Error joining event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentEvent) {
    return (
      <EventParticipation 
        event={currentEvent} 
        onBack={() => {
          setCurrentEvent(null);
          setEventId('');
        }} 
      />
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
          <h1 className="text-3xl font-bold text-gray-900">飲み会に参加</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>イベントID入力</CardTitle>
            <CardDescription>
              幹事から共有されたイベントIDを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoinEvent} className="space-y-4">
              <div>
                <Label htmlFor="eventId">イベントID</Label>
                <Input
                  id="eventId"
                  value={eventId}
                  onChange={(e) => setEventId(e.target.value)}
                  placeholder="例: nomi1"
                  required
                />
                <p className="text-sm text-gray-600 mt-1">
                  「nomi」から始まる短いIDを入力してください
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '参加中...' : 'イベントに参加'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ParticipateEvent;
