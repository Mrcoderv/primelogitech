from rest_framework import generics, status
from rest_framework.permissions import IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import check_password
from django.conf import settings
from .models import *
from .serializers import *
from .permissions import CanManageAdminUsers  # <-- Added import
from .email_utils import send_smtp_email

# ── AUTHENTICATION ────────────────────────────────────────────

class AdminLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        
        if not username or not password:
            return Response({'detail': 'Username and password are required'}, status=400)
        
        try:
            admin_user = AdminUser.objects.get(username=username)
        except AdminUser.DoesNotExist:
            return Response({'detail': 'No active account found with the given credentials'}, status=401)
        
        if not admin_user.is_active:
            return Response({'detail': 'Account is inactive'}, status=401)
        
        if not check_password(password, admin_user.password_hash):
            return Response({'detail': 'No active account found with the given credentials'}, status=401)
        
        # Update last login
        from django.utils import timezone
        admin_user.last_login = timezone.now()
        admin_user.save(update_fields=['last_login'])
        
        # Generate JWT tokens
        refresh = RefreshToken()
        refresh['user_id'] = admin_user.id
        refresh['username'] = admin_user.username
        refresh['email'] = admin_user.email
        refresh['role'] = admin_user.role
        
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'id': admin_user.id,
                'username': admin_user.username,
                'email': admin_user.email,
                'role': admin_user.role,
            }
        }, status=200)


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
        s = ContactMessageCreateSerializer(data=request.data)
        if s.is_valid():
            assigned_user = (
                AdminUser.objects
                .filter(is_active=True, email_notifications_enabled=True)
                .exclude(email="")
                .order_by("created_at")
                .first()
            )
            msg = s.save(assigned_user=assigned_user)
            try:
                if assigned_user:
                    send_smtp_email(
                    subject=f"[PLT Contact] {msg.subject}",
                    message=f"From: {msg.name} <{msg.email}>\n\n{msg.message}",
                    recipient_list=[assigned_user.email],
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

class HealthCheckView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({'ok': True}, status=200)

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

class AdminContactStatusView(APIView):
    permission_classes = [IsAdminUser]
    
    def patch(self, request, pk):
        try:
            contact = ContactMessage.objects.get(pk=pk)
        except ContactMessage.DoesNotExist:
            return Response({'error': 'Contact message not found'}, status=404)
        
        # Update is_read status
        if 'is_read' in request.data:
            contact.is_read = request.data.get('is_read', contact.is_read)
        
        # Update action_done status
        if 'action_done' in request.data:
            contact.action_done = request.data.get('action_done', contact.action_done)
        
        contact.save()
        
        serializer = ContactMessageSerializer(contact)
        return Response(serializer.data, status=200)

class AdminNewsletterListView(generics.ListAPIView):
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSubscriberSerializer
    permission_classes = [IsAdminUser]


class AdminSMTPSettingsView(APIView):
    permission_classes = [CanManageAdminUsers]

    def get(self, request):
        SMTPSetting.ensure_defaults()
        settings_map = {
            item.key: item.value
            for item in SMTPSetting.objects.all()
        }
        return Response(settings_map, status=status.HTTP_200_OK)

    def patch(self, request):
        SMTPSetting.ensure_defaults()
        editable_keys = {"SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"}

        for key in editable_keys:
            if key in request.data:
                SMTPSetting.objects.update_or_create(
                    key=key,
                    defaults={"value": str(request.data.get(key, "") or "")},
                )

        settings_map = {
            item.key: item.value
            for item in SMTPSetting.objects.all()
        }
        return Response(settings_map, status=status.HTTP_200_OK)


class AdminSMTPTestEmailView(APIView):
    permission_classes = [CanManageAdminUsers]

    def post(self, request):
        recipient = (
            request.data.get("recipient")
            or getattr(request.user, "email", "")
            or settings.ADMIN_EMAIL
        )
        recipient = (recipient or "").strip()
        if not recipient:
            return Response(
                {"success": False, "error": "Recipient email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            send_smtp_email(
                subject="PrimeLogicTech SMTP Test",
                message="SMTP test email sent successfully from the admin API.",
                recipient_list=[recipient],
            )
            return Response(
                {"success": True, "message": "Test email sent successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception:
            return Response(
                {"success": False, "error": "Test email failed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

# ── ADMIN USER MANAGEMENT ──────────────────────────────────────

from .serializers import AdminUserCreateSerializer, AdminUserUpdateSerializer, PasswordResetSerializer

class AdminUserListCreateView(generics.ListCreateAPIView):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [CanManageAdminUsers]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdminUserCreateSerializer
        return AdminUserSerializer

    def perform_create(self, serializer):
        created_user = serializer.save(created_by=self.request.user.username)
        if created_user.email_notifications_enabled and created_user.email:
            try:
                send_smtp_email(
                    subject="Welcome to PrimeLogicTech",
                    message=(
                        f"Hi {created_user.username},\n\n"
                        "Your account has been created successfully."
                    ),
                    recipient_list=[created_user.email],
                )
            except Exception:
                pass
        return created_user

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {
                'success': True,
                'message': f"User '{serializer.instance.username}' created successfully",
                'data': AdminUserSerializer(serializer.instance).data
            },
            status=status.HTTP_201_CREATED,
            headers=headers
        )

class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = AdminUser.objects.all()
    serializer_class = AdminUserSerializer
    permission_classes = [CanManageAdminUsers]

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AdminUserUpdateSerializer
        return AdminUserSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        username = instance.username
        if instance.id == request.user.id:
            return Response(
                {'error': 'Cannot delete your own account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        self.perform_destroy(instance)
        return Response(
            {'success': True, 'message': f"User '{username}' deleted successfully"},
            status=status.HTTP_200_OK
        )

class AdminUserResetPasswordView(APIView):
    permission_classes = [CanManageAdminUsers]

    def post(self, request, pk):
        try:
            user = AdminUser.objects.get(pk=pk)
        except AdminUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        from django.contrib.auth.hashers import make_password
        user.password_hash = make_password(serializer.validated_data['password'])
        user.save()

        return Response({
            'success': True,
            'message': f"Password reset successfully for user '{user.username}'"
        })

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
