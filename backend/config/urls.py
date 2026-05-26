from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from core.views import *

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/token/', AdminLoginView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),

    # Public
    path('api/site-content/', SiteContentView.as_view()),
    path('api/projects/', ProjectListView.as_view()),
    path('api/team/', TeamListView.as_view()),
    path('api/services/', ServiceListView.as_view()),
    path('api/testimonials/', TestimonialListView.as_view()),
    path('api/jobs/', JobListView.as_view()),
    path('api/contact/', ContactCreateView.as_view()),
    path('api/newsletter/', NewsletterSubscribeView.as_view()),

    # Admin only
    path('api/admin/site-content/', AdminSiteContentView.as_view()),
    path('api/admin/projects/', AdminProjectListCreateView.as_view()),
    path('api/admin/projects/<int:pk>/', AdminProjectDetailView.as_view()),
    path('api/admin/team/', AdminTeamListCreateView.as_view()),
    path('api/admin/team/<int:pk>/', AdminTeamDetailView.as_view()),
    path('api/admin/services/', AdminServiceListCreateView.as_view()),
    path('api/admin/services/<int:pk>/', AdminServiceDetailView.as_view()),
    path('api/admin/testimonials/', AdminTestimonialListCreateView.as_view()),
    path('api/admin/testimonials/<int:pk>/', AdminTestimonialDetailView.as_view()),
    path('api/admin/jobs/', AdminJobListCreateView.as_view()),
    path('api/admin/jobs/<int:pk>/', AdminJobDetailView.as_view()),
    path('api/admin/contacts/', AdminContactListView.as_view()),
    path('api/admin/contacts/<int:pk>/', AdminContactDetailView.as_view()),
    path('api/admin/newsletter/', AdminNewsletterListView.as_view()),
    
    # Admin user management
    path('api/admin/users/', AdminUserListCreateView.as_view()),
    path('api/admin/users/<int:pk>/', AdminUserDetailView.as_view()),
    path('api/admin/users/<int:pk>/reset-password/', AdminUserResetPasswordView.as_view()),
    
    # Image asset management
    path('api/admin/images/', ImageAssetListCreateView.as_view()),
    path('api/admin/images/<int:pk>/', ImageAssetDetailView.as_view()),
    path('api/admin/images/type/<str:asset_type>/', ImageAssetByTypeView.as_view()),
]
