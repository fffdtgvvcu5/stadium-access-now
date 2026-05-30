UPDATE public.matches SET home_logo = CASE home_team
  WHEN 'الهلال' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Al_Hilal_SFC_Logo.svg/200px-Al_Hilal_SFC_Logo.svg.png'
  WHEN 'النصر' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Al-Nassr_FC_Logo.svg/200px-Al-Nassr_FC_Logo.svg.png'
  WHEN 'الاتحاد' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Ittihad_FC.svg/200px-Ittihad_FC.svg.png'
  WHEN 'الأهلي' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Al_Ahli_Saudi_FC.svg/200px-Al_Ahli_Saudi_FC.svg.png'
  WHEN 'الشباب' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Al-Shabab_FC_%28Riyadh%29_logo.svg/200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png'
  WHEN 'الفتح' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Al-Fateh_SC_logo.png/200px-Al-Fateh_SC_logo.png'
  WHEN 'المنتخب السعودي' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Saudi_Arabia_national_football_team_logo.svg/200px-Saudi_Arabia_national_football_team_logo.svg.png'
  ELSE home_logo END,
away_logo = CASE away_team
  WHEN 'الهلال' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/Al_Hilal_SFC_Logo.svg/200px-Al_Hilal_SFC_Logo.svg.png'
  WHEN 'النصر' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/9/9b/Al-Nassr_FC_Logo.svg/200px-Al-Nassr_FC_Logo.svg.png'
  WHEN 'الاتحاد' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/c/c1/Ittihad_FC.svg/200px-Ittihad_FC.svg.png'
  WHEN 'الأهلي' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Al_Ahli_Saudi_FC.svg/200px-Al_Ahli_Saudi_FC.svg.png'
  WHEN 'الشباب' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Al-Shabab_FC_%28Riyadh%29_logo.svg/200px-Al-Shabab_FC_%28Riyadh%29_logo.svg.png'
  WHEN 'الفتح' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Al-Fateh_SC_logo.png/200px-Al-Fateh_SC_logo.png'
  WHEN 'المنتخب الياباني' THEN 'https://upload.wikimedia.org/wikipedia/en/thumb/4/40/Japan_Football_Association.svg/200px-Japan_Football_Association.svg.png'
  ELSE away_logo END;