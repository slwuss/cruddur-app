import json
from datetime import datetime, timedelta, timezone
from opentelemetry import trace

from lib.db import pool, query_wrap_array



class HomeActivities:
  
  def run():
    sql = query_wrap_array("""
    SELECT
        activities.uuid,
        users.display_name,
        users.handle,
        activities.message,
        activities.replies_count,
        activities.reposts_count,
        activities.likes_count,
        activities.reply_to_activity_uuid,
        activities.expires_at,
        activities.created_at
      FROM public.activities
      LEFT JOIN public.users ON users.uuid = activities.user_uuid
      ORDER BY activities.created_at DESC
    """)
    with pool.connection() as conn:
       with conn.cursor() as cur:
        cur.execute(sql)         
        json = cur.fetchone()   
    return json[0]





    # @staticmethod
    # def run():
    #     sql = query_wrap_array("SELECT * FROM activities")
    #     with pool.connection() as conn:
    #         with conn.cursor() as cur:
    #             cur.execute(sql)
    #             result = cur.fetchone()  # tuple with 1 element: Python list
    #             print("DB RESULT:", result)

    #     if result and result[0]:
    #         return result[0]   # <-- return list/dict ได้เลย
    #     return []