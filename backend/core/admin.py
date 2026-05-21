from django import forms
from django.contrib import admin

from .models import HomeContent, Project, TeamMember


class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = "__all__"
        help_texts = {
            "title": "The name shown on the website.",
            "category": "Short label such as Web App, Mobile App, or Brand Identity.",
            "description": "Write a short project summary for the portfolio cards.",
            "image": "Upload a project screenshot or cover image.",
            "link": "Optional live project or case-study URL.",
            "tech_stack": "Enter technologies separated by commas, such as React, Django, PostgreSQL.",
            "is_pinned": "Pinned projects appear in the featured-work slider on the homepage.",
        }


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
	form = ProjectAdminForm
	list_display = ("title", "category", "is_pinned", "updated_at")
	list_filter = ("is_pinned", "category", "created_at")
	search_fields = ("title", "category", "description")
	list_editable = ("is_pinned",)
	readonly_fields = ("created_at", "updated_at")
	fieldsets = (
		("Project details", {
			"fields": ("title", "category", "description", "link"),
		}),
		("Media and stack", {
			"fields": ("image", "tech_stack"),
		}),
		("Homepage display", {
			"fields": ("is_pinned",),
		}),
		("Audit fields", {
			"fields": ("created_at", "updated_at"),
		}),
	)
	search_fields = ("title", "category", "description")


class HomeContentAdminForm(forms.ModelForm):
	class Meta:
		model = HomeContent
		fields = "__all__"
		widgets = {
			"why_description": forms.Textarea(attrs={"rows": 3}),
			"why_points": forms.Textarea(attrs={"rows": 5}),
			"why_panel_description": forms.Textarea(attrs={"rows": 3}),
			"client_success_description": forms.Textarea(attrs={"rows": 3}),
		}
		help_texts = {
			"why_points": "Enter one benefit per line. These are the bullets shown in the 'Why partner with' section.",
			"why_panel_description": "This text explains the creative panel on the right side.",
			"client_success_description": "This controls the section intro shown above testimonials.",
		}


@admin.register(HomeContent)
class HomeContentAdmin(admin.ModelAdmin):
	form = HomeContentAdminForm
	list_display = ("why_title", "client_success_title")
	fieldsets = (
		("Why partner with", {
			"fields": ("why_title", "why_description", "why_points"),
		}),
		("Right panel", {
			"fields": ("why_panel_title", "why_panel_description"),
		}),
		("Client Success", {
			"fields": ("client_success_title", "client_success_description"),
		}),
	)


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
	list_display = ("name", "role", "order", "is_active")
	list_editable = ("order", "is_active")
	list_filter = ("is_active", "role")
	search_fields = ("name", "role", "bio")
	ordering = ("order", "name")
	fieldsets = (
		("Profile", {
			"fields": ("name", "role", "bio", "image"),
		}),
		("Display", {
			"fields": ("order", "is_active"),
		}),
	)
