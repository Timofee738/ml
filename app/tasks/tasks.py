from app.tasks.celery_app import celery_instance
from app.config import settings

import smtplib
from email.message import EmailMessage




#CONFIRMATION EMAIL TASK
@celery_instance.task
def send_confirmation_email(email: str, token: str):
    msg = EmailMessage()
    msg.set_content(f'Your confirmation code: {token}\n\nPlease enter this code to verify your email.')
    msg['Subject'] = 'Email Verification'
    msg['From'] = settings.SMTP_USER
    msg['To'] = email
    
    
    try:
        with smtplib.SMTP_SSL(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            server.login(settings.SMTP_USER, settings.SMTP_PASS)
            server.send_message(msg)
    except Exception as e:
        print(f"Ошибка отправки почты: {e}")