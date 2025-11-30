-- Settings tablosu oluştur
CREATE TABLE IF NOT EXISTS settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- İlk sistem ayarları (varsayılan değerler)
INSERT INTO settings (key, value) 
VALUES (
  'system_settings',
  '{
    "n8n_analyze_url": "",
    "n8n_trends_url": "",
    "n8n_instagram_content_url": "",
    "n8n_planning_schedule_url": "",
    "n8n_planning_connect_url": "",
    "n8n_planning_upload_url": "",
    "n8n_analytics_url": "",
    "n8n_comments_url": "",
    "n8n_reports_url": "",
    "n8n_calendar_url": "",
    "n8n_accounts_url": "",
    "n8n_library_url": "",
    "openai_api_key": "",
    "ai_model": "gpt-4o-mini",
    "ai_temperature": 0.7,
    "instagram_access_token": "",
    "instagram_client_id": "",
    "instagram_client_secret": ""
  }'::jsonb
)
ON CONFLICT (key) DO NOTHING;

-- updated_at otomatik güncelleme için trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) politikaları
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcılar için okuma/yazma izni (role bazlı)
CREATE POLICY "Settings are viewable by authenticated users with admin role"
  ON settings FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@trendcrm.com', 'selim@trendcrm.com')
    )
  );

CREATE POLICY "Settings are editable by authenticated users with admin role"
  ON settings FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@trendcrm.com', 'selim@trendcrm.com')
    )
  );

CREATE POLICY "Settings are insertable by authenticated users with admin role"
  ON settings FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('admin@trendcrm.com', 'selim@trendcrm.com')
    )
  );



