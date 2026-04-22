from celery import Celery
from celery.schedules import crontab

from app.config import settings

celery_instance = Celery(
    'tasks',
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=['app.tasks.tasks']
)

celery_instance.conf.update(
    task_ignore_result=True,
    timezone='Europe/Moscow',
    enable_utc=True
)
