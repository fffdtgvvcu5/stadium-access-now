
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) NOT NULL DEFAULT 5.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'phone');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Matches
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  home_team TEXT NOT NULL,
  away_team TEXT NOT NULL,
  home_logo TEXT,
  away_logo TEXT,
  competition TEXT NOT NULL,
  venue TEXT NOT NULL,
  city TEXT NOT NULL,
  kickoff_at TIMESTAMPTZ NOT NULL,
  cover_color TEXT DEFAULT '#0a0a0a',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.matches TO anon, authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_select_all" ON public.matches FOR SELECT USING (true);

-- Ticket listings
CREATE TYPE public.listing_status AS ENUM ('available','reserved','sold','cancelled');
CREATE TABLE public.ticket_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  section TEXT NOT NULL,
  row_label TEXT,
  seat_label TEXT,
  quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  currency TEXT NOT NULL DEFAULT 'SAR',
  notes TEXT,
  status public.listing_status NOT NULL DEFAULT 'available',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ticket_listings TO authenticated;
GRANT SELECT ON public.ticket_listings TO anon;
GRANT ALL ON public.ticket_listings TO service_role;
ALTER TABLE public.ticket_listings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "listings_select_available" ON public.ticket_listings FOR SELECT USING (status = 'available' OR auth.uid() = seller_id);
CREATE POLICY "listings_insert_own" ON public.ticket_listings FOR INSERT TO authenticated WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "listings_update_own" ON public.ticket_listings FOR UPDATE TO authenticated USING (auth.uid() = seller_id);
CREATE POLICY "listings_delete_own" ON public.ticket_listings FOR DELETE TO authenticated USING (auth.uid() = seller_id);

-- Seed sample matches
INSERT INTO public.matches (home_team, away_team, competition, venue, city, kickoff_at, cover_color) VALUES
  ('الهلال', 'النصر', 'دوري روشن السعودي', 'ملعب الأول بارك', 'الرياض', now() + interval '3 days', '#0b3b8c'),
  ('الاتحاد', 'الأهلي', 'دوري روشن السعودي', 'ملعب الإنماء', 'جدة', now() + interval '5 days', '#0a5c2e'),
  ('الشباب', 'الفتح', 'دوري روشن السعودي', 'ملعب الشباب', 'الرياض', now() + interval '7 days', '#7a1010'),
  ('المنتخب السعودي', 'المنتخب الياباني', 'تصفيات كأس العالم', 'ملعب الملك فهد', 'الرياض', now() + interval '12 days', '#0d3b1f'),
  ('الهلال', 'الاتحاد', 'كأس الملك', 'ملعب الأول بارك', 'الرياض', now() + interval '20 days', '#1a1a1a');
