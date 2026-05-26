from django.contrib.auth import get_user_model
from django.test import TestCase
from django.test import override_settings
from django.urls import reverse

from core.models import ContactMessage, NewsletterSubscriber


@override_settings(SECURE_SSL_REDIRECT=False)
class AdminEnhancementsTestCase(TestCase):
    def setUp(self):
        self.admin_user = get_user_model().objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="adminpass123",
        )
        self.client.force_login(self.admin_user)

    def test_admin_index_shows_recent_contact_messages(self):
        for i in range(6):
            ContactMessage.objects.create(
                name=f"User {i}",
                email=f"user{i}@example.com",
                subject=f"Subject {i}",
                message=f"Message {i}",
                is_read=bool(i % 2),
                action_done=bool((i + 1) % 2),
            )

        response = self.client.get(reverse("admin:index"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Latest Contact Messages")
        self.assertContains(response, "Subject 5")
        self.assertContains(response, "Subject 1")
        self.assertNotContains(response, "Subject 0")
        self.assertContains(response, "Seen")
        self.assertContains(response, "Not done")

    def test_quick_update_contact_message_status(self):
        message = ContactMessage.objects.create(
            name="User",
            email="user@example.com",
            subject="Need help",
            message="Please contact me.",
            is_read=False,
            action_done=False,
        )

        url = reverse("admin:core_contactmessage_quick_update", args=[message.pk])
        response = self.client.post(
            url,
            {
                "field": "is_read",
                "value": "1",
                "next": reverse("admin:index"),
            },
        )

        self.assertEqual(response.status_code, 302)
        message.refresh_from_db()
        self.assertTrue(message.is_read)

    def test_newsletter_changelist_copy_button_and_active_emails_endpoint(self):
        NewsletterSubscriber.objects.create(email="active1@example.com", is_active=True)
        NewsletterSubscriber.objects.create(email="active2@example.com", is_active=True)
        NewsletterSubscriber.objects.create(email="inactive@example.com", is_active=False)

        changelist_response = self.client.get(reverse("admin:core_newslettersubscriber_changelist"))
        self.assertEqual(changelist_response.status_code, 200)
        self.assertContains(changelist_response, "Copy active emails")
        self.assertContains(changelist_response, "Total:")
        self.assertContains(changelist_response, "Active:")

        endpoint_response = self.client.get(reverse("admin:core_newslettersubscriber_active_emails"))
        self.assertEqual(endpoint_response.status_code, 200)
        emails = endpoint_response.json()["emails"]
        self.assertIn("active1@example.com", emails)
        self.assertIn("active2@example.com", emails)
        self.assertNotIn("inactive@example.com", emails)
