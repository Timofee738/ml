from celery import Celery
from celery.schedules import crontab


celery_instance = Celery(
    'tasks',
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/0",
    include=['app.tasks.tasks']
)

celery_instance.conf.update(
    task_ignore_result=True,
    timezone='Europe/Moscow',
    enable_utc=True
)
