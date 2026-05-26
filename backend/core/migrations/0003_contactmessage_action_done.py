# Generated migration for ContactMessage action_done field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_adminuser_imageasset'),
    ]

    operations = [
        migrations.AddField(
            model_name='contactmessage',
            name='action_done',
            field=models.BooleanField(default=False),
        ),
    ]
