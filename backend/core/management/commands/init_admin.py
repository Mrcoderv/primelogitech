from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from core.models import AdminUser
import os


class Command(BaseCommand):
    help = 'Initialize default admin user if not exists'

    def handle(self, *args, **options):
        username = os.environ.get('ADMIN_USERNAME', 'admin')
        email = os.environ.get('ADMIN_EMAIL', 'admin@example.com')
        password = os.environ.get('ADMIN_PASSWORD', 'admin@123')

        if AdminUser.objects.filter(username=username).exists():
            self.stdout.write(
                self.style.SUCCESS(f'Admin user "{username}" already exists. Skipping.')
            )
            return

        try:
            admin_user = AdminUser.objects.create(
                username=username,
                email=email,
                password_hash=make_password(password),
                role='admin',
                is_active=True,
                permissions={
                    'manage_content': True,
                    'manage_users': True,
                    'manage_images': True,
                    'view_analytics': True,
                }
            )
            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully created admin user "{username}" with email "{email}"'
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    f'⚠️  Change the password immediately: python manage.py changepassword {username}'
                )
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Failed to create admin user: {str(e)}')
            )
