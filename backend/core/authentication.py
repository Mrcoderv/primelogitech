"""
Custom authentication backend for AdminUser model.

The default SimpleJWT authentication tries to authenticate against Django's
built-in User model, but we use a custom AdminUser model. This module provides
custom authentication classes that work with our AdminUser model.
"""

from rest_framework import authentication, exceptions
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from django.utils.translation import gettext_lazy as _
from .models import AdminUser


class CustomAdminUserJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication that authenticates AdminUser instead of Django's User model.

    This authentication class:
    1. Validates the JWT token using SimpleJWT
    2. Extracts the user_id from the token claims
    3. Fetches the corresponding AdminUser from the database
    4. Attaches the AdminUser to request.user
    """

    def authenticate(self, request):
        """
        Authenticate the request and return a two-tuple of (user, token).

        Returns None if no token is provided or authentication fails.
        Raises exceptions.AuthenticationFailed for invalid tokens.
        """
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
        except (InvalidToken, TokenError) as e:
            raise exceptions.AuthenticationFailed(_('Invalid or expired token'))

        # Extract user_id from token claims
        try:
            user_id = validated_token.get('user_id')
        except KeyError:
            raise exceptions.AuthenticationFailed(_('Token contained no valid user identification'))

        if user_id is None:
            raise exceptions.AuthenticationFailed(_('Token contained no valid user identification'))

        # Get the AdminUser
        try:
            admin_user = AdminUser.objects.get(pk=user_id)
        except AdminUser.DoesNotExist:
            raise exceptions.AuthenticationFailed(_('User not found'))

        if not admin_user.is_active:
            raise exceptions.AuthenticationFailed(_('User account is disabled'))

        # Return (user, token) tuple - we return the admin_user as request.user
        return (admin_user, validated_token)

    def get_user(self, validated_token):
        """
        Required by JWTAuthentication parent class.
        Returns the AdminUser based on the token claims.
        """
        try:
            user_id = validated_token.get('user_id')
        except KeyError:
            return None

        if user_id is None:
            return None

        try:
            return AdminUser.objects.get(pk=user_id)
        except AdminUser.DoesNotExist:
            return None
