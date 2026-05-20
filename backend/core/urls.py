from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('services/', views.get_services, name='services'),
    path('projects/', views.get_projects, name='projects'),
    path('projects/featured/', views.get_featured_projects, name='featured-projects'),
    path('testimonials/', views.get_testimonials, name='testimonials'),
    path('team/', views.get_team, name='team'),
    path('jobs/', views.get_jobs, name='jobs'),
    path('contact-settings/', views.get_contact_settings, name='contact-settings'),
    path('contact/', views.contact_form, name='contact'),
]
