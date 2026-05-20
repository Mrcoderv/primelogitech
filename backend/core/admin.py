from django.contrib import admin
from django.utils.html import format_html
from .models import ContactSettings, Service, Project, Job, Employee, Testimonial, ContactMessage


admin.site.site_header = "Prime Logic Tech Administration"
admin.site.site_title = "Prime Logic Tech Admin"
admin.site.index_title = "Welcome to Prime Logic Tech Admin Panel"


@admin.register(ContactSettings)
class ContactSettingsAdmin(admin.ModelAdmin):
    fields = ('email', 'phone', 'location')
    readonly_fields = ('updated_at',)

    def has_add_permission(self, request):
        # Allow only one ContactSettings instance
        return not ContactSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order', 'updated_at')
    search_fields = ('title', 'description')
    list_editable = ('order',)
    ordering = ('order',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'icon', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'featured_badge', 'technologies', 'order', 'updated_at')
    search_fields = ('title', 'description', 'technologies')
    list_filter = ('is_featured', 'created_at')
    list_editable = ('order',)
    ordering = ('order',)
    fieldsets = (
        ('Project Information', {
            'fields': ('title', 'description', 'image_url', 'technologies', 'link', 'order')
        }),
        ('Featured Work', {
            'fields': ('is_featured',),
            'description': '⭐ Check this box to feature this project in the "Featured Work" section'
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def featured_badge(self, obj):
        if obj.is_featured:
            return format_html('<span style="color: gold;">⭐ Featured</span>')
        return format_html('<span style="color: gray;">○ Regular</span>')
    featured_badge.short_description = 'Type'


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'job_type', 'status_badge', 'is_active', 'updated_at')
    search_fields = ('title', 'description', 'location')
    list_filter = ('job_type', 'is_active', 'created_at')
    list_editable = ('is_active',)
    ordering = ('-created_at',)
    
    fieldsets = (
        ('Job Information', {
            'fields': ('title', 'description', 'location', 'job_type', 'salary_range')
        }),
        ('Requirements & Application', {
            'fields': ('requirements', 'form_link'),
            'description': '📋 Add job requirements (one per line) and link to your application form (Google Form, TypeForm, or custom form URL)'
        }),
        ('Status', {
            'fields': ('is_active',),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def status_badge(self, obj):
        if obj.is_active:
            return format_html('<span style="color: green;">✓ Active</span>')
        return format_html('<span style="color: red;">✗ Inactive</span>')
    status_badge.short_description = 'Status'


@admin.register(Employee)
class EmployeeAdmin(admin.ModelAdmin):
    list_display = ('name', 'role', 'email', 'order', 'updated_at')
    search_fields = ('name', 'role', 'email', 'bio')
    list_editable = ('order',)
    ordering = ('order',)
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'role', 'bio', 'image_url', 'order')
        }),
        ('Contact & Social', {
            'fields': ('email', 'linkedin', 'twitter'),
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'rating_stars', 'rating', 'order', 'updated_at')
    search_fields = ('name', 'company', 'message')
    list_filter = ('rating', 'created_at')
    list_editable = ('order', 'rating')
    ordering = ('order',)
    fieldsets = (
        ('Testimonial Details', {
            'fields': ('name', 'company', 'message', 'rating', 'image_url', 'order')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'updated_at')
    
    def rating_stars(self, obj):
        stars = '⭐' * obj.rating
        return format_html(f'{stars} ({obj.rating}/5)')
    rating_stars.short_description = 'Rating'


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'read_status', 'is_read', 'created_at')
    search_fields = ('name', 'email', 'subject', 'message')
    list_filter = ('is_read', 'created_at')
    list_editable = ('is_read',)
    ordering = ('-created_at',)
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Message Details', {
            'fields': ('name', 'email', 'subject', 'message')
        }),
        ('Status', {
            'fields': ('is_read',),
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ('created_at', 'name', 'email', 'subject', 'message')

    def has_add_permission(self, request):
        # Messages are only added via contact form
        return False

    def has_delete_permission(self, request, obj=None):
        # Allow deletion only for admins
        return request.user.is_staff
    
    def read_status(self, obj):
        if obj.is_read:
            return format_html('<span style="color: blue;">✓ Read</span>')
        return format_html('<span style="color: orange;">⚠ Unread</span>')
    read_status.short_description = 'Status'


