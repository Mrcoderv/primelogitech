from django import forms
from django.contrib import admin

from .models import SiteContent, Project, TeamMember, Service, Testimonial, Job, ContactMessage, NewsletterSubscriber


class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = "__all__"
        help_texts = {
            "title": "The name shown on the website.",
            "category": "Short label such as Web App, Mobile App, or Brand Identity.",
            "description": "Write a short project summary for the portfolio cards.",
            "image": "Upload a project screenshot or cover image.",
            "image_url": "Optional direct URL if not using uploaded image.",
            "tech_stack": "Enter technologies as a JSON array, e.g. [\"React\", \"Django\"]",
            "live_url": "Optional live project URL.",
            "github_url": "Optional GitHub repository URL.",
            "pinned": "Pinned projects appear first on the portfolio list.",
            "order": "Lower numbers appear first among non-pinned projects.",
        }


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    list_display = ("title", "category", "pinned", "order", "created_at")
    list_filter = ("pinned", "category", "created_at")
    search_fields = ("title", "category", "description")
    list_editable = ("pinned", "order")
    readonly_fields = ("created_at",)
    fieldsets = (
        ("Project details", {
            "fields": ("title", "category", "description"),
        }),
        ("Media & links", {
            "fields": ("image", "image_url", "live_url", "github_url"),
        }),
        ("Stack & display", {
            "fields": ("tech_stack", "pinned", "order"),
        }),
        ("Audit", {
            "fields": ("created_at",),
        }),
    )


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Hero Section", {
            "fields": ("hero_badge", "hero_heading", "hero_subtitle", "hero_cta_primary", "hero_cta_secondary"),
        }),
        ("Trusted By", {
            "fields": ("trusted_by_logos",),
        }),
        ("Why Partner", {
            "fields": ("why_title", "why_description", "why_checklist"),
        }),
        ("Stats", {
            "fields": ("stat_projects", "stat_clients", "stat_team", "stat_experience"),
        }),
        ("About", {
            "fields": ("about_mission", "about_vision"),
        }),
        ("CTA", {
            "fields": ("cta_heading", "cta_subtitle", "cta_button_text"),
        }),
        ("Contact", {
            "fields": ("contact_email", "contact_phone", "contact_address"),
        }),
        ("Footer", {
            "fields": ("footer_tagline",),
        }),
    )

    def has_add_permission(self, request):
        return False if SiteContent.objects.exists() else True

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "order", "is_active")
    list_editable = ("order", "is_active")
    list_filter = ("is_active", "role")
    search_fields = ("name", "role", "bio")
    ordering = ("order", "name")
    fieldsets = (
        ("Profile", {
            "fields": ("name", "role", "bio", "image", "image_url"),
        }),
        ("Social", {
            "fields": ("linkedin_url", "github_url", "twitter_url"),
        }),
        ("Display", {
            "fields": ("order", "is_active"),
        }),
    )


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("title", "icon", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("title", "description")


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ("name", "role", "company", "order", "is_active")
    list_editable = ("order", "is_active")
    search_fields = ("name", "company", "quote")


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ("title", "department", "location", "job_type", "is_open", "created_at")
    list_filter = ("is_open", "job_type", "department")
    search_fields = ("title", "department", "description")
    readonly_fields = ("created_at",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "subject", "is_read", "created_at")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "subject", "message", "created_at")


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "is_active", "subscribed_at")
    list_filter = ("is_active", "subscribed_at")
    search_fields = ("email",)
    readonly_fields = ("subscribed_at",)
