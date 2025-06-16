
-- イベントIDのシーケンスを作成
CREATE SEQUENCE IF NOT EXISTS event_id_sequence START 1;

-- eventsテーブルにshort_idカラムを追加
ALTER TABLE events ADD COLUMN IF NOT EXISTS short_id TEXT UNIQUE;

-- 既存のイベントに短いIDを割り当てる関数
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TEXT AS $$
BEGIN
  RETURN 'nomi' || nextval('event_id_sequence')::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 新しいイベント作成時に自動的に短いIDを生成するトリガー
CREATE OR REPLACE FUNCTION set_short_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.short_id IS NULL THEN
    NEW.short_id = generate_short_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- トリガーを作成
DROP TRIGGER IF EXISTS trigger_set_short_id ON events;
CREATE TRIGGER trigger_set_short_id
  BEFORE INSERT ON events
  FOR EACH ROW
  EXECUTE FUNCTION set_short_id();

-- 既存のイベントに短いIDを追加
UPDATE events 
SET short_id = generate_short_id() 
WHERE short_id IS NULL;
