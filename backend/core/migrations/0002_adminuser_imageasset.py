# Generated migration for AdminUser and ImageAsset models

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='AdminUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=150, unique=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password_hash', models.CharField(max_length=255)),
                ('role', models.CharField(choices=[('admin', 'Admin - Full Access'), ('editor', 'Editor - Content Management'), ('viewer', 'Viewer - Read Only')], default='editor', max_length=20)),
                ('is_active', models.BooleanField(default=True)),
                ('permissions', models.JSONField(blank=True, default=dict)),
                ('last_login', models.DateTimeField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('created_by', models.CharField(blank=True, max_length=150)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='ImageAsset',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.CharField(max_length=255)),
                ('url', models.URLField()),
                ('cloudinary_id', models.CharField(blank=True, max_length=255)),
                ('size', models.IntegerField(default=0)),
                ('asset_type', models.CharField(choices=[('project', 'Project'), ('team', 'Team Member'), ('service', 'Service'), ('other', 'Other')], default='other', max_length=20)),
                ('alt_text', models.CharField(blank=True, max_length=200)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('uploaded_by', models.CharField(blank=True, max_length=150)),
            ],
            options={
                'ordering': ['-uploaded_at'],
            },
        ),
    ]
