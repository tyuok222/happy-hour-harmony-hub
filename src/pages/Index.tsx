
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import CreateEvent from "@/components/CreateEvent";
import ParticipateEvent from "@/components/ParticipateEvent";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'select' | 'create' | 'participate'>('select');

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'ookii') {
      setIsAuthenticated(true);
      toast.success('認証に成功しました！');
    } else {
      toast.error('パスワードが間違っています');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">飲み会日程調整</CardTitle>
            <CardDescription>
              サービスを利用するにはパスワードを入力してください
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">パスワード</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="パスワードを入力"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                ログイン
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (mode === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">飲み会日程調整</h1>
            <p className="text-xl text-gray-600">みんなで楽しい飲み会を企画しよう！</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setMode('create')}>
              <CardHeader>
                <CardTitle className="text-xl text-center">新しい飲み会を企画</CardTitle>
                <CardDescription className="text-center">
                  幹事として新しい飲み会の日程候補を作成します
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full">企画を作成</Button>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setMode('participate')}>
              <CardHeader>
                <CardTitle className="text-xl text-center">飲み会に参加</CardTitle>
                <CardDescription className="text-center">
                  企画IDを入力して飲み会の日程調整に参加します
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="w-full" variant="outline">参加する</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return <CreateEvent onBack={() => setMode('select')} />;
  }

  if (mode === 'participate') {
    return <ParticipateEvent onBack={() => setMode('select')} />;
  }

  return null;
};

export default Index;
