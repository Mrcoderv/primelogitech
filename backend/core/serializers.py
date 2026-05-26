from rest_framework import serializers
from .models import (
    SiteContent, Project, TeamMember, Service,
    Testimonial, Job, ContactMessage, NewsletterSubscriber,
    AdminUser, ImageAsset
)

class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = '__all__'

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = '__all__'

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'


class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminUser
        fields = ['id', 'username', 'email', 'role', 'is_active', 'permissions', 'last_login', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_login']


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    
    class Meta:
        model = AdminUser
        fields = ['username', 'email', 'password', 'role', 'permissions', 'is_active']
    
    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password
        password = validated_data.pop('password')
        validated_data['password_hash'] = make_password(password)
        
        # Set default permissions if not provided
        if 'permissions' not in validated_data or not validated_data['permissions']:
            validated_data['permissions'] = {}
        
        # Set default is_active if not provided
        if 'is_active' not in validated_data:
            validated_data['is_active'] = True
        
        return AdminUser.objects.create(**validated_data)


class ImageAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageAsset
        fields = '__all__'
        read_only_fields = ['id', 'uploaded_at', 'cloudinary_id']
