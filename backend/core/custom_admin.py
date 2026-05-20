from django.contrib import admin
from django.urls import path
from django.views.generic import TemplateView
from .models import Service, Project, Job, Employee, Testimonial, ContactMessage, ContactSettings
from .views import admin_dashboard


class PrimeLogicAdminSite(admin.AdminSite):
    """Custom Admin Site for Prime Logic Tech"""
    site_header = "Prime Logic Tech Admin"
    site_title = "Admin Panel"
    index_title = "Welcome to Prime Logic Tech Management"
    
    def index(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['title'] = 'Prime Logic Tech Admin Dashboard'
        return super().index(request, extra_context)


# Create custom admin site instance
prime_admin_site = PrimeLogicAdminSite(name='prime_admin')

# Register models with custom site
prime_admin_site.register(ContactSettings)
prime_admin_site.register(Service)
prime_admin_site.register(Project)
prime_admin_site.register(Job)
prime_admin_site.register(Employee)
prime_admin_site.register(Testimonial)
prime_admin_site.register(ContactMessage)
