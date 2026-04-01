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

celery_instance.conf.beat_schedule = {
    "check-all-sites-every-minute": {
        "task": "app.tasks.tasks.check_all_sites", 
        "schedule": crontab(minute="*"), 
    },
}
