from unittest.mock import patch

from django.test import TestCase
from django.test import override_settings
from rest_framework.test import APIClient

from core.models import AdminUser, SMTPSetting


@override_settings(SECURE_SSL_REDIRECT=False)
class SMTPSettingsAndWelcomeEmailTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin_user = AdminUser.objects.create(
            username="root_admin",
            email="root@example.com",
            password_hash="hashed-password",
            role="admin",
            is_active=True,
        )
        self.admin_user.is_authenticated = True
        self.client.force_authenticate(user=self.admin_user)

    def test_get_and_patch_smtp_settings(self):
        response = self.client.get("/api/admin/smtp-settings/")
        self.assertEqual(response.status_code, 200)
        self.assertSetEqual(
            set(response.data.keys()),
            {"SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"},
        )

        patch_response = self.client.patch(
            "/api/admin/smtp-settings/",
            {
                "SMTP_HOST": "smtp.db.example.com",
                "SMTP_PORT": "1025",
                "SMTP_USER": "smtp-user@example.com",
                "SMTP_PASS": "smtp-secret",
            },
            format="json",
        )
        self.assertEqual(patch_response.status_code, 200)
        self.assertEqual(SMTPSetting.get_value("SMTP_HOST"), "smtp.db.example.com")
        self.assertEqual(SMTPSetting.get_value("SMTP_PORT"), "1025")

    @patch("core.views.send_smtp_email")
    def test_test_email_endpoint(self, mock_send_smtp_email):
        response = self.client.post(
            "/api/admin/smtp-settings/test-email/",
            {"recipient": "qa@example.com"},
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["success"])
        mock_send_smtp_email.assert_called_once()
        self.assertEqual(
            mock_send_smtp_email.call_args.kwargs["recipient_list"],
            ["qa@example.com"],
        )

    @patch("core.views.send_smtp_email")
    def test_create_user_sends_welcome_email_when_enabled(self, mock_send_smtp_email):
        payload = {
            "username": "newmember",
            "email": "newmember@example.com",
            "email_notifications_enabled": True,
            "password": "StrongPass1",
            "confirm_password": "StrongPass1",
            "role": "editor",
            "is_active": True,
        }
        response = self.client.post("/api/admin/users/", payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            AdminUser.objects.filter(
                username="newmember", email_notifications_enabled=True
            ).exists()
        )
        mock_send_smtp_email.assert_called_once()
        self.assertEqual(
            mock_send_smtp_email.call_args.kwargs["recipient_list"],
            ["newmember@example.com"],
        )

    @patch("core.views.send_smtp_email")
    def test_create_user_skips_welcome_email_when_disabled(self, mock_send_smtp_email):
        payload = {
            "username": "newmember2",
            "email": "newmember2@example.com",
            "email_notifications_enabled": False,
            "password": "StrongPass1",
            "confirm_password": "StrongPass1",
            "role": "editor",
            "is_active": True,
        }
        response = self.client.post("/api/admin/users/", payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            AdminUser.objects.filter(
                username="newmember2", email_notifications_enabled=False
            ).exists()
        )
        mock_send_smtp_email.assert_not_called()
