from django.urls import path
from . import views

urlpatterns = [
    path('services/', views.get_services, name='services'),
    path('projects/', views.get_projects, name='projects'),
    path('testimonials/', views.get_testimonials, name='testimonials'),
    path('team/', views.get_team, name='team'),
    path('jobs/', views.get_jobs, name='jobs'),
    path('contact/', views.contact_form, name='contact'),
]
