import json
from datetime import datetime, timedelta, timezone
from opentelemetry import trace

from lib.db import pool, query_wrap_array



class HomeActivities:
  
  def run():
    sql = query_wrap_array("""
    SELECT * FROM activities
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