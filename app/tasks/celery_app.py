from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_instance = Celery(
    'tasks',
    broker=settings.get_redis_url(),
    backend=settings.get_redis_url(),
    include=['app.tasks.tasks']
)

celery_instance.conf.update(
    task_ignore_result=True,
    timezone='Europe/Moscow',
    enable_utc=True
)
