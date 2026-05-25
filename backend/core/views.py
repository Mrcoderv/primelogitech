from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from .models import *
from .serializers import *


# ── PUBLIC ────────────────────────────────────────────────────

class SiteContentView(APIView):
    permission_classes = [AllowAny]
    def get(self, request):
        return Response(SiteContentSerializer(SiteContent.load()).data)

class ProjectListView(generics.ListAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [AllowAny]

class TeamListView(generics.ListAPIView):
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    permission_classes = [AllowAny]

class ServiceListView(generics.ListAPIView):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

class TestimonialListView(generics.ListAPIView):
    queryset = Testimonial.objects.filter(is_active=True)
    serializer_class = TestimonialSerializer
    permission_classes = [AllowAny]

class JobListView(generics.ListAPIView):
    queryset = Job.objects.filter(is_open=True)
    serializer_class = JobSerializer
    permission_classes = [AllowAny]

class ContactCreateView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        s = ContactMessageSerializer(data=request.data)
        if s.is_valid():
            msg = s.save()
            try:
                send_mail(
                    subject=f"[PLT Contact] {msg.subject}",
                    message=f"From: {msg.name} <{msg.email}>\n\n{msg.message}",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.ADMIN_EMAIL],
                    fail_silently=True,
                )
            except Exception:
                pass
            return Response({'success': True}, status=201)
        return Response(s.errors, status=400)

class NewsletterSubscribeView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email', '').strip()
        if not email:
            return Response({'error': 'Email required'}, status=400)
        sub, created = NewsletterSubscriber.objects.get_or_create(email=email)
        if not created:
            sub.is_active = True
            sub.save()
        return Response({'success': True}, status=201)


# ── ADMIN ONLY ────────────────────────────────────────────────

class AdminSiteContentView(APIView):
    permission_classes = [IsAdminUser]
    def get(self, request):
        return Response(SiteContentSerializer(SiteContent.load()).data)
    def patch(self, request):
        s = SiteContentSerializer(SiteContent.load(), data=request.data, partial=True)
        if s.is_valid():
            s.save()
            return Response(s.data)
        return Response(s.errors, status=400)

class AdminProjectListCreateView(generics.ListCreateAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUser]

class AdminProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUser]

class AdminTeamListCreateView(generics.ListCreateAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminUser]

class AdminTeamDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    permission_classes = [IsAdminUser]

class AdminServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class AdminServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminUser]

class AdminTestimonialListCreateView(generics.ListCreateAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]

class AdminTestimonialDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    permission_classes = [IsAdminUser]

class AdminJobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

class AdminJobDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [IsAdminUser]

class AdminContactListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]

class AdminContactDetailView(generics.RetrieveUpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminUser]

class AdminNewsletterListView(generics.ListAPIView):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]


# ── ADMIN USER MANAGEMENT ──────────────────────────────────────

class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdminUserCreateSerializer
        return AdminUserSerializer


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [IsAdminUser]


class AdminUserResetPasswordView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request, pk):
        try:
            user = AdminUser.objects.get(pk=pk)
        except AdminUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        
        password = request.data.get('password', '').strip()
        if not password or len(password) < 8:
            return Response({'error': 'Password must be at least 8 characters'}, status=400)
        
        from django.contrib.auth.hashers import make_password
        user.password_hash = make_password(password)
        user.save()
        
        return Response({'success': True, 'message': 'Password reset successfully'})


# ── IMAGE ASSET MANAGEMENT ────────────────────────────────────

class ImageAssetListCreateView(generics.ListCreateAPIView):
    queryset = ImageAsset.objects.all()
    serializer_class = ImageAssetSerializer
    permission_classes = [IsAdminUser]
    
    def perform_create(self, serializer):
        serializer.save(uploaded_by=self.request.user.username if hasattr(self.request.user, 'username') else 'admin')


class ImageAssetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ImageAsset.objects.all()
    serializer_class = ImageAssetSerializer
    permission_classes = [IsAdminUser]
    
    def perform_destroy(self, instance):
        # Delete from Cloudinary if public_id exists
        if instance.cloudinary_id:
            try:
                import cloudinary.api
                cloudinary.api.delete_resources([instance.cloudinary_id])
            except Exception:
                pass
        instance.delete()


class ImageAssetByTypeView(generics.ListAPIView):
    serializer_class = ImageAssetSerializer
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        asset_type = self.kwargs.get('asset_type')
        return ImageAsset.objects.filter(asset_type=asset_type)
