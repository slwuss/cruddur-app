-- this file was manually created
INSERT INTO public.users (display_name, handle, email, cognito_user_id)
VALUES
  ('Seenlawat Ussavathirakul', 'Seenlawat19' , 'seenlawat1906@hotmail.com' , '59de2408-90b1-70e6-c203-3e95b17e49a2'),
  ('Andrew Bayko', 'bayko' ,'andrewbayko@example.com' ,'593ec478-d0a1-7035-a19c-46fb8869a301'),
  ('Londo Mollari','londo' ,'lmollari@centari.com' ,'MOCK');
INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'Seenlawat19' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )