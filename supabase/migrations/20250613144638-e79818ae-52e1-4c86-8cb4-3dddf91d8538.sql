
-- 飲み会イベントを保存するテーブル
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date_options JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 参加者の回答を保存するテーブル
CREATE TABLE public.event_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  participant_name TEXT NOT NULL,
  responses JSONB NOT NULL,
  comments JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, participant_name)
);

-- Row Level Security (RLS) を有効にする
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_responses ENABLE ROW LEVEL SECURITY;

-- 全員が読み取り可能なポリシー（パスワード認証はアプリ側で実装）
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Anyone can create events" ON public.events FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view responses" ON public.event_responses FOR SELECT USING (true);
CREATE POLICY "Anyone can create responses" ON public.event_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update responses" ON public.event_responses FOR UPDATE USING (true);
