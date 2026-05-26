import re
from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import (
    SiteContent, Project, TeamMember, Service,
    Testimonial, Job, ContactMessage, NewsletterSubscriber,
    AdminUser, ImageAsset, SMTPSetting
)


def validate_password_strength(password):
    """Validate password meets minimum security requirements."""
    if len(password) < 8:
        raise serializers.ValidationError("Password must be at least 8 characters long.")
    if not re.search(r'[A-Z]', password):
        raise serializers.ValidationError("Password must contain at least one uppercase letter.")
    if not re.search(r'[a-z]', password):
        raise serializers.ValidationError("Password must contain at least one lowercase letter.")
    if not re.search(r'\d', password):
        raise serializers.ValidationError("Password must contain at least one digit.")
    return password


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

    def validate_email(self, value):
        """Validate email format."""
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value


class ContactMessageCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']

    def validate_email(self, value):
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        return value


class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = '__all__'


class AdminUserSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = AdminUser
        fields = ['id', 'username', 'email', 'email_notifications_enabled', 'role', 'role_display', 'is_active', 'permissions', 'last_login', 'created_at', 'updated_at', 'created_by']
        read_only_fields = ['id', 'created_at', 'updated_at', 'last_login', 'role_display']


class AdminUserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = AdminUser
        fields = ['username', 'email', 'email_notifications_enabled', 'password', 'confirm_password', 'role', 'permissions', 'is_active']

    def validate_username(self, value):
        """Validate username format and uniqueness."""
        if len(value) < 3:
            raise serializers.ValidationError("Username must be at least 3 characters long.")
        if not re.match(r'^[a-zA-Z0-9_]+$', value):
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores.")
        if AdminUser.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def validate_email(self, value):
        """Validate email format and uniqueness."""
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        if AdminUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value

    def validate_password(self, value):
        """Validate password strength."""
        return validate_password_strength(value)

    def validate(self, data):
        """Validate passwords match."""
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data

    def create(self, validated_data):
        from django.contrib.auth.hashers import make_password
        password = validated_data.pop('password')
        validated_data.pop('confirm_password', None)
        validated_data['password_hash'] = make_password(password)

        if 'permissions' not in validated_data or not validated_data['permissions']:
            validated_data['permissions'] = {}

        if 'is_active' not in validated_data:
            validated_data['is_active'] = True

        return AdminUser.objects.create(**validated_data)


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Serializer for updating admin user details (without password)."""

    class Meta:
        model = AdminUser
        fields = ['email', 'email_notifications_enabled', 'role', 'is_active', 'permissions']

    def validate_email(self, value):
        """Validate email format and uniqueness."""
        try:
            validate_email(value)
        except DjangoValidationError:
            raise serializers.ValidationError("Enter a valid email address.")
        queryset = AdminUser.objects.filter(email=value)
        if self.instance:
            queryset = queryset.exclude(pk=self.instance.pk)
        if queryset.exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value


class PasswordResetSerializer(serializers.Serializer):
    """Serializer for password reset."""
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        """Validate password strength."""
        return validate_password_strength(value)

    def validate(self, data):
        if data.get('password') != data.get('confirm_password'):
            raise serializers.ValidationError({"confirm_password": "Passwords do not match."})
        return data


class ImageAssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImageAsset
        fields = '__all__'
        read_only_fields = ['id', 'uploaded_at', 'cloudinary_id']


class SMTPSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = SMTPSetting
        fields = '__all__'
