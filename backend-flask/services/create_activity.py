from datetime import datetime, timedelta, timezone
from lib.db import db
import logging


logger = logging.getLogger()
logger.setLevel(logging.INFO)

class CreateActivity:
  def run(message, user_handle, ttl):
    model = {'errors': [], 'data': None}

    now = datetime.now(timezone.utc)

    ttl_map = {
      '30-days': timedelta(days=30),
      '7-days': timedelta(days=7),
      '3-days': timedelta(days=3),
      '1-day': timedelta(days=1),
      '12-hours': timedelta(hours=12),
      '3-hours': timedelta(hours=3),
      '1-hour': timedelta(hours=1)
    }
    ttl_offset = ttl_map.get(ttl)
    if not ttl_offset:
      model['errors'].append('ttl_blank')

    if not user_handle:
      model['errors'].append('user_handle_blank')

    if not message:
      model['errors'].append('message_blank')
    elif len(message) > 280:
      model['errors'].append('message_exceed_max_chars')

    if model['errors']:
      model['data'] = {'handle': user_handle, 'message': message}
      return model

    try:
      expires_at = now + ttl_offset
      uuid = CreateActivity.create_activity(user_handle, message, expires_at)
      model['data'] = CreateActivity.query_object_activity(uuid)
    except Exception as e:
      logger.error(f"Database error: {e}")
      model['errors'].append('db_error')

    return model

  def create_activity(handle, message, expires_at):
    sql = db.template('activities', 'create')
    uuid = db.query_commit(sql, {
      'handle': handle,
      'message': message,
      'expires_at': expires_at
    })
    return uuid

  def query_object_activity(uuid):
    sql = db.template('activities', 'object')
    return db.query_object_json(sql, {'uuid': uuid})