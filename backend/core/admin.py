from django import forms
from django.contrib import admin
from django.contrib import messages
from django.http import HttpResponseNotAllowed, HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls import path, reverse
from django.utils.http import url_has_allowed_host_and_scheme
from django.utils import timezone
from django.utils.translation import gettext_lazy as _

from .models import SiteContent, Project, TeamMember, Service, Testimonial, Job, ContactMessage, NewsletterSubscriber

admin.site.site_header = "PrimeLogitech Admin"
admin.site.site_title = "PrimeLogitech Admin"
admin.site.index_title = "Dashboard"
admin.site.index_template = "admin/custom_index.html"


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
    list_display = ("name", "email", "subject", "is_read", "action_done", "created_at")
    list_filter = ("is_read", "action_done", "created_at")
    search_fields = ("name", "email", "subject", "message")
    readonly_fields = ("name", "email", "subject", "message", "created_at")
    actions = ("mark_seen", "mark_unseen", "mark_action_done", "mark_action_not_done")

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "quick-update/<int:pk>/",
                self.admin_site.admin_view(self.quick_update_status),
                name="core_contactmessage_quick_update",
            ),
        ]
        return custom_urls + urls

    def quick_update_status(self, request, pk):
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        message_obj = get_object_or_404(ContactMessage, pk=pk)
        if not self.has_change_permission(request, message_obj):
            self.message_user(request, _("You do not have permission to update this message."), level=messages.ERROR)
            return HttpResponseNotAllowed(["POST"])

        field_name = request.POST.get("field")
        new_value = request.POST.get("value")
        next_url = request.POST.get("next") or reverse("admin:index")
        if not url_has_allowed_host_and_scheme(
            url=next_url,
            allowed_hosts={request.get_host()},
            require_https=request.is_secure(),
        ):
            next_url = reverse("admin:index")

        if field_name not in {"is_read", "action_done"} or new_value not in {"0", "1"}:
            self.message_user(request, _("Invalid status update request."), level=messages.ERROR)
            return HttpResponseNotAllowed(["POST"])

        setattr(message_obj, field_name, new_value == "1")
        message_obj.save(update_fields=[field_name])
        self.message_user(request, _("Message status updated."), level=messages.SUCCESS)
        return HttpResponseRedirect(next_url)

    @admin.action(description="Mark selected messages as seen")
    def mark_seen(self, request, queryset):
        updated_count = queryset.update(is_read=True)
        self.message_user(request, _("%(count)s message(s) marked as seen.") % {"count": updated_count}, level=messages.SUCCESS)

    @admin.action(description="Mark selected messages as unseen")
    def mark_unseen(self, request, queryset):
        updated_count = queryset.update(is_read=False)
        self.message_user(request, _("%(count)s message(s) marked as unseen.") % {"count": updated_count}, level=messages.SUCCESS)

    @admin.action(description="Mark selected messages as action done")
    def mark_action_done(self, request, queryset):
        updated_count = queryset.update(action_done=True)
        self.message_user(request, _("%(count)s message(s) marked as done.") % {"count": updated_count}, level=messages.SUCCESS)

    @admin.action(description="Mark selected messages as action not done")
    def mark_action_not_done(self, request, queryset):
        updated_count = queryset.update(action_done=False)
        self.message_user(request, _("%(count)s message(s) marked as not done.") % {"count": updated_count}, level=messages.SUCCESS)


@admin.register(NewsletterSubscriber)
class NewsletterSubscriberAdmin(admin.ModelAdmin):
    list_display = ("email", "is_active", "subscribed_at")
    list_filter = ("is_active", "subscribed_at")
    search_fields = ("email",)
    readonly_fields = ("subscribed_at",)
    change_list_template = "admin/core/newslettersubscriber/change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "active-emails/",
                self.admin_site.admin_view(self.active_emails_view),
                name="core_newslettersubscriber_active_emails",
            ),
        ]
        return custom_urls + urls

    def changelist_view(self, request, extra_context=None):
        active_emails = NewsletterSubscriber.objects.filter(is_active=True).values_list("email", flat=True)
        today_count = NewsletterSubscriber.objects.filter(subscribed_at__date=timezone.localdate()).count()
        extra_context = extra_context or {}
        extra_context.update(
            {
                "active_emails_csv": ",".join(active_emails),
                "total_subscribers": NewsletterSubscriber.objects.count(),
                "active_subscribers": NewsletterSubscriber.objects.filter(is_active=True).count(),
                "today_subscribers": today_count,
            }
        )
        return super().changelist_view(request, extra_context=extra_context)

    def active_emails_view(self, request):
        emails = NewsletterSubscriber.objects.filter(is_active=True).values_list("email", flat=True)
        return JsonResponse({"emails": ",".join(emails)})
