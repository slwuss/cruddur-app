-- this file was manually created
INSERT INTO public.users (display_name, handle, email, cognito_user_id)
VALUES
  ('Seenlawat Ussavathirakul', 'Seenlawat19' , 'seenlawat1906@hotmail.com' , 'MOCK'),
  ('Andrew Bayko', 'bayko' ,'andrewbayko@example.com' ,'MOCK');
  ('Londo Mollari','londo' ,'lmollari@centari.com' ,'MOCK');
INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'Seenlawat19' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )