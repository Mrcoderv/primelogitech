"""
Custom permission classes for AdminUser role-based access control.

Django REST Framework's default IsAdminUser checks request.user.is_staff which
is a Django User model attribute. Since we use a custom AdminUser model, we need
custom permission classes that work with our role system.
"""

from rest_framework import permissions


class IsAuthenticatedAdminUser(permissions.BasePermission):
    """
    Allows access only to authenticated AdminUser instances.

    This permission checks:
    1. The user is authenticated (request.user is set)
    2. The user is an instance of AdminUser (not Django's User)
    3. The user is active
    """

    def has_permission(self, request, view):
        """
        Return True if the request has valid admin authentication.
        """
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False

        # Check if user is an AdminUser instance
        # The is_authenticated attribute is always True for authenticated users
        # We check is_active separately
        return bool(request.user.is_active)


class IsAdminRole(permissions.BasePermission):
    """
    Allows access only to admin role users (full access).

    This is the highest permission level - can do anything including:
    - Manage other admin users
    - Access all admin features
    - Delete any content
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return getattr(request.user, 'role', None) == 'admin'


class IsAdminOrEditorRole(permissions.BasePermission):
    """
    Allows access to admin or editor role users.

    Editors can:
    - Manage content (projects, team, services, etc.)
    - View contacts and newsletter subscribers
    - Upload images

    Editors cannot:
    - Create/delete admin users
    - Change site settings
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        role = getattr(request.user, 'role', None)
        return role in ('admin', 'editor')


class CanManageAdminUsers(permissions.BasePermission):
    """
    Allows access only to admin role users for managing other admin users.

    This permission is used for:
    - Creating new admin users
    - Updating existing admin users
    - Deleting admin users
    - Resetting passwords
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return getattr(request.user, 'role', None) == 'admin'

    def has_object_permission(self, request, view, obj):
        # Only admin role can manage users
        # Prevent self-deletion (admin cannot delete themselves)
        if request.method == 'DELETE':
            return (
                getattr(request.user, 'role', None) == 'admin'
                and obj.id != request.user.id
            )
        return getattr(request.user, 'role', None) == 'admin'


class IsViewerOrAbove(permissions.BasePermission):
    """
    Allows access to any authenticated admin user (viewer, editor, or admin).

    Viewers can:
    - View all admin content (read-only)

    This is the base permission for admin panel access.
    """

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        return True

    def has_object_permission(self, request, view, obj):
        # For read operations, allow all authenticated users
        if request.method in permissions.SAFE_METHODS:
            return True

        # For write operations, require editor or admin
        role = getattr(request.user, 'role', None)
        return role in ('admin', 'editor')
