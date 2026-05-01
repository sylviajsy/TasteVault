insert into tasting_notes (
  user_id,
  wine_id,
  price,
  user_acidity,
  user_fizziness,
  user_intensity,
  user_sweetness,
  user_tannin,
  user_flavor,
  comment
)
values
(
  'c93caa23-6ccc-4ee9-8e2e-1dafc8e3caba',
  8910514,
  385,
  7.0,
  0.0,
  6.0,
  10.0,
  1.0,
  '[
  {
    "group": "black_fruit",
    "notes": ["blackberries", "blueberry"]
  },
  {
    "group": "earth",
    "notes": ["pencil lead"]
  }
  ]'::jsonb,
  'One of the best wines I''ve had. Silky smooth, velvety mouthfeel. Complex but perfectly balanced flavor notes: Crushed blackberries, pencil lead, blueberry compote, vanilla bean with lots of metallic and earthy notes. A little spice on the finish.'
),
(
  'c93caa23-6ccc-4ee9-8e2e-1dafc8e3caba',
  1167182,
  575,
  8.0,
  8.0,
  0.0,
  7.5,
  0.0,
  '[
  {
    "group": "tree_fruit",
    "notes": ["green apple", "apple","orange"]
  },
  {
    "group": "non_oak",
    "notes": ["brioche"]
  },
  {
    "group": "oak",
    "notes": ["oak"]
  }
  ]'::jsonb,
  'I thought Krug would be my first 5 star champagne but it came a bit short despite expectations. Didn''t know what to expect here but damn! Easily the best I had (and it''s nr. 86). Fantastic, aromatic and warm nose with yeast, red apple, oak, brioche and orange followed by a palate with perfect acidity, lemon, green apple and full fat butter well into the super long finish. The representative of Giraud seemed to appreciate my enthusiasm and generously offered me another glass... I didn''t say no 😁😋'
);