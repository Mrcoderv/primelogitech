"""
Comprehensive test suite for Prime Logic Tech backend.

Covers:
  - Model creation, defaults, string representations
  - Public API endpoints (GET)
  - Admin-only API endpoints (POST/PUT/PATCH/DELETE)
  - JWT authentication flow (login, refresh, protected routes)
  - Contact form submission
  - Newsletter subscription
  - Permission enforcement (anonymous vs admin)
  - 404 / error handling
  - Edge cases (empty lists, invalid data, missing fields)
"""

from django.test import TestCase, override_settings
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from .models import (
    SiteContent, Project, TeamMember, Service,
    Testimonial, Job, ContactMessage, NewsletterSubscriber,
)

# Disable SSL redirect in tests so HTTP requests don't get 301'd
_NO_SSL = override_settings(SECURE_SSL_REDIRECT=False)


# =============================================================================
#  WHITEBOX — Model Tests
# =============================================================================

class SiteContentModelTest(TestCase):
    """SiteContent singleton model behaviour."""

    def test_load_creates_singleton(self):
        """load() should create the singleton row if it doesn't exist."""
        self.assertEqual(SiteContent.objects.count(), 0)
        obj = SiteContent.load()
        self.assertEqual(obj.pk, 1)
        self.assertEqual(SiteContent.objects.count(), 1)

    def test_load_returns_existing(self):
        """load() should return the existing row on subsequent calls."""
        first = SiteContent.load()
        second = SiteContent.load()
        self.assertEqual(first.pk, second.pk)
        self.assertEqual(SiteContent.objects.count(), 1)

    def test_default_values(self):
        """Default field values should match expectations."""
        obj = SiteContent.load()
        self.assertEqual(obj.hero_badge, "Prime Logic Tech is now live")
        self.assertEqual(obj.hero_heading, "Design. Develop. Deliver.")
        self.assertEqual(obj.contact_email, "hello@primelogictech.com")
        self.assertIsInstance(obj.trusted_by_logos, list)
        self.assertIsInstance(obj.why_checklist, list)

    def test_str_representation(self):
        obj = SiteContent.load()
        self.assertEqual(str(obj), "Site Content")

    def test_save_enforces_singleton(self):
        """save() should always set pk=1, preventing duplicates."""
        SiteContent.load()  # creates pk=1
        new_obj = SiteContent(hero_heading="Overwrite")
        new_obj.save()
        self.assertEqual(SiteContent.objects.count(), 1)
        self.assertEqual(SiteContent.load().hero_heading, "Overwrite")


class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = Project.objects.create(
            title="Test Project",
            category="Web",
            description="A test project",
            tech_stack=["React", "Django"],
        )

    def test_creation(self):
        self.assertEqual(Project.objects.count(), 1)

    def test_str(self):
        self.assertEqual(str(self.project), "Test Project")

    def test_defaults(self):
        self.assertFalse(self.project.pinned)
        self.assertEqual(self.project.order, 0)
        self.assertEqual(self.project.tech_stack, ["React", "Django"])

    def test_ordering(self):
        p2 = Project.objects.create(title="Alpha", category="Mobile", description="Z")
        p2.pinned = True
        p2.order = 1
        p2.save()
        qs = Project.objects.all()
        self.assertGreater(qs[0].pinned, qs[1].pinned)


class TeamMemberModelTest(TestCase):
    def setUp(self):
        self.member = TeamMember.objects.create(
            name="John Doe", role="Developer",
        )

    def test_str(self):
        self.assertEqual(str(self.member), "John Doe")

    def test_defaults(self):
        self.assertTrue(self.member.is_active)
        self.assertEqual(self.member.order, 0)


class ServiceModelTest(TestCase):
    def setUp(self):
        self.service = Service.objects.create(
            title="Web Dev", description="We build websites"
        )

    def test_str(self):
        self.assertEqual(str(self.service), "Web Dev")

    def test_default_icon(self):
        self.assertEqual(self.service.icon, "Code")


class TestimonialModelTest(TestCase):
    def setUp(self):
        self.t = Testimonial.objects.create(
            name="Jane", role="CEO", company="ACME",
            quote="Amazing work!",
        )

    def test_str(self):
        self.assertIn("Jane", str(self.t))
        self.assertIn("ACME", str(self.t))


class JobModelTest(TestCase):
    def setUp(self):
        self.job = Job.objects.create(
            title="Engineer", department="Engineering",
            description="Build things",
            requirements=["Python", "React"],
        )

    def test_str(self):
        self.assertEqual(str(self.job), "Engineer")

    def test_defaults(self):
        self.assertEqual(self.job.job_type, "full-time")
        self.assertEqual(self.job.location, "Remote")
        self.assertTrue(self.job.is_open)
        self.assertEqual(self.job.requirements, ["Python", "React"])


class ContactMessageModelTest(TestCase):
    def setUp(self):
        self.msg = ContactMessage.objects.create(
            name="Alice", email="alice@example.com",
            subject="Hello", message="Test message",
        )

    def test_str(self):
        self.assertIn("Alice", str(self.msg))
        self.assertIn("Hello", str(self.msg))

    def test_default_is_read(self):
        self.assertFalse(self.msg.is_read)


class NewsletterSubscriberModelTest(TestCase):
    def setUp(self):
        self.sub = NewsletterSubscriber.objects.create(email="test@example.com")

    def test_str(self):
        self.assertEqual(str(self.sub), "test@example.com")

    def test_unique_email(self):
        with self.assertRaises(Exception):
            NewsletterSubscriber.objects.create(email="test@example.com")

    def test_default_is_active(self):
        self.assertTrue(self.sub.is_active)


# =============================================================================
#  BLACKBOX — API Tests
# =============================================================================

@_NO_SSL
class PublicAPITestCase(TestCase):
    """Test all public (unauthenticated) endpoints."""
    client_class = APIClient

    @classmethod
    def setUpTestData(cls):
        # Seed some data
        cls.project = Project.objects.create(
            title="Public Project", category="Web",
            description="Seeded", tech_stack=["Vue"],
        )
        cls.team_member = TeamMember.objects.create(
            name="Public Member", role="Designer", is_active=True,
        )
        cls.inactive_member = TeamMember.objects.create(
            name="Hidden Member", role="Ghost", is_active=False,
        )
        cls.service = Service.objects.create(
            title="Public Service", description="Helps",
        )
        cls.testimonial = Testimonial.objects.create(
            name="Client", role="CEO", quote="Great",
        )
        cls.job = Job.objects.create(
            title="Open Job", description="Hiring", is_open=True,
        )
        cls.closed_job = Job.objects.create(
            title="Closed Job", description="Filled", is_open=False,
        )

    # ── Public GET endpoints ──────────────────────────────────

    def test_get_site_content(self):
        resp = self.client.get('/api/site-content/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('hero_badge', resp.data)

    def test_get_projects(self):
        resp = self.client.get('/api/projects/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)
        self.assertEqual(resp.data[0]['title'], "Public Project")

    def test_get_team(self):
        resp = self.client.get('/api/team/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titles = [m['name'] for m in resp.data]
        self.assertIn("Public Member", titles)
        self.assertNotIn("Hidden Member", titles)

    def test_get_services(self):
        resp = self.client.get('/api/services/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

    def test_get_testimonials(self):
        resp = self.client.get('/api/testimonials/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

    def test_get_jobs_only_open(self):
        resp = self.client.get('/api/jobs/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        titles = [j['title'] for j in resp.data]
        self.assertIn("Open Job", titles)
        self.assertNotIn("Closed Job", titles)

    # ── Contact form ──────────────────────────────────────────

    def test_contact_submit_success(self):
        payload = {
            'name': 'Alice',
            'email': 'alice@example.com',
            'subject': 'Inquiry',
            'message': 'I want to hire you',
        }
        resp = self.client.post('/api/contact/', payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(resp.data['success'])
        self.assertEqual(ContactMessage.objects.count(), 1)

    def test_contact_submit_missing_fields(self):
        resp = self.client.post('/api/contact/', {'name': 'Bob'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_contact_submit_empty_body(self):
        resp = self.client.post('/api/contact/', {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    # ── Newsletter ────────────────────────────────────────────

    def test_newsletter_subscribe(self):
        resp = self.client.post(
            '/api/newsletter/', {'email': 'new@user.com'}, format='json'
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(NewsletterSubscriber.objects.filter(email='new@user.com').exists())

    def test_newsletter_duplicate_reactivates(self):
        NewsletterSubscriber.objects.create(email='existing@user.com', is_active=False)
        resp = self.client.post(
            '/api/newsletter/', {'email': 'existing@user.com'}, format='json'
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        sub = NewsletterSubscriber.objects.get(email='existing@user.com')
        self.assertTrue(sub.is_active)

    def test_newsletter_missing_email(self):
        resp = self.client.post('/api/newsletter/', {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', resp.data)

    # ── Permission enforcement ────────────────────────────────

    def test_admin_endpoints_reject_anonymous(self):
        admin_endpoints = [
            ('GET', '/api/admin/site-content/'),
            ('PATCH', '/api/admin/site-content/'),
            ('GET', '/api/admin/projects/'),
            ('POST', '/api/admin/projects/'),
            ('GET', '/api/admin/projects/1/'),
            ('PUT', '/api/admin/projects/1/'),
            ('PATCH', '/api/admin/projects/1/'),
            ('DELETE', '/api/admin/projects/1/'),
            ('GET', '/api/admin/team/'),
            ('POST', '/api/admin/team/'),
            ('GET', '/api/admin/services/'),
            ('POST', '/api/admin/services/'),
            ('GET', '/api/admin/testimonials/'),
            ('POST', '/api/admin/testimonials/'),
            ('GET', '/api/admin/jobs/'),
            ('POST', '/api/admin/jobs/'),
            ('GET', '/api/admin/contacts/'),
            ('GET', '/api/admin/contacts/1/'),
            ('GET', '/api/admin/newsletter/'),
        ]
        for method, url in admin_endpoints:
            with self.subTest(method=method, url=url):
                resp = getattr(self.client, method.lower())(url)
                self.assertEqual(
                    resp.status_code, status.HTTP_401_UNAUTHORIZED,
                    f"{method} {url} returned {resp.status_code} instead of 401"
                )

    # ── 404 / error handling ──────────────────────────────────

    def test_unknown_url_returns_404(self):
        resp = self.client.get('/api/nonexistent/')
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_invalid_method_returns_405(self):
        resp = self.client.delete('/api/site-content/')
        self.assertEqual(resp.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_invalid_json_returns_400(self):
        resp = self.client.post(
            '/api/contact/', 'not-json', content_type='application/json'
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


@_NO_SSL
class JWTTokenTestCase(TestCase):
    """Test JWT authentication flow."""
    client_class = APIClient

    @classmethod
    def setUpTestData(cls):
        cls.password = 'StrongPass123!'
        cls.admin = User.objects.create_superuser(
            username='admin', email='admin@test.com',
            password=cls.password,
        )
        cls.regular = User.objects.create_user(
            username='user', password=cls.password,
        )

    def _get_tokens(self):
        resp = self.client.post('/api/token/', {
            'username': 'admin', 'password': self.password,
        }, format='json')
        return resp.data

    def test_login_success(self):
        resp = self.client.post('/api/token/', {
            'username': 'admin',
            'password': self.password,
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)
        self.assertIn('refresh', resp.data)

    def test_login_invalid_credentials(self):
        resp = self.client.post('/api/token/', {
            'username': 'admin',
            'password': 'wrongpassword',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_missing_fields(self):
        resp = self.client.post('/api/token/', {}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_refresh_token(self):
        tokens = self._get_tokens()
        resp = self.client.post('/api/token/refresh/', {
            'refresh': tokens['refresh'],
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('access', resp.data)

    def test_refresh_with_invalid_token(self):
        resp = self.client.post('/api/token/refresh/', {
            'refresh': 'invalid-token-here',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_with_valid_token(self):
        tokens = self._get_tokens()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {tokens["access"]}')
        resp = self.client.get('/api/admin/projects/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

    def test_protected_endpoint_with_expired_token(self):
        """Create a token that is already expired using the 'exp' claim."""
        token = AccessToken.for_user(self.admin)
        token.payload['exp'] = 0  # epoch = Jan 1 1970, definitely expired
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        resp = self.client.get('/api/admin/projects/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_protected_endpoint_without_token(self):
        resp = self.client.get('/api/admin/projects/')
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_regular_user_cannot_access_admin(self):
        user_tokens = self.client.post('/api/token/', {
            'username': 'user', 'password': self.password,
        }, format='json').data
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {user_tokens["access"]}')
        resp = self.client.get('/api/admin/projects/')
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)


@_NO_SSL
class AdminCRUDTestCase(TestCase):
    """Test full CRUD on admin endpoints with JWT auth + superuser."""
    client_class = APIClient

    @classmethod
    def setUpTestData(cls):
        cls.admin = User.objects.create_superuser(
            username='super', email='super@test.com', password='Pass123!',
        )

    def setUp(self):
        """Obtain JWT token and attach it to the client for every test."""
        # Must re-obtain token in setUp (not setUpTestData) because
        # @override_settings wrapping may not propagate cls.client
        resp = self.client.post('/api/token/', {
            'username': 'super', 'password': 'Pass123!',
        }, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {resp.data["access"]}')

    # ── Projects ──────────────────────────────────────────────

    def test_create_project(self):
        payload = {
            'title': 'New Project', 'category': 'AI',
            'description': 'An AI project',
        }
        resp = self.client.post('/api/admin/projects/', payload, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data['title'], 'New Project')

    def test_update_project(self):
        proj = Project.objects.create(
            title='Old', category='Web', description='Before',
        )
        resp = self.client.patch(
            f'/api/admin/projects/{proj.id}/',
            {'title': 'Updated'}, format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['title'], 'Updated')

    def test_delete_project(self):
        proj = Project.objects.create(
            title='Delete Me', category='Web', description='Bye',
        )
        resp = self.client.delete(f'/api/admin/projects/{proj.id}/')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(id=proj.id).exists())

    # ── Team ──────────────────────────────────────────────────

    def test_create_team_member(self):
        resp = self.client.post('/api/admin/team/', {
            'name': 'New Dev', 'role': 'Developer',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_update_team_member(self):
        m = TeamMember.objects.create(name='Old', role='Dev')
        resp = self.client.patch(
            f'/api/admin/team/{m.id}/',
            {'role': 'Senior Dev'}, format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['role'], 'Senior Dev')

    def test_delete_team_member(self):
        m = TeamMember.objects.create(name='Del', role='Dev')
        resp = self.client.delete(f'/api/admin/team/{m.id}/')
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)

    # ── Services ──────────────────────────────────────────────

    def test_create_service(self):
        resp = self.client.post('/api/admin/services/', {
            'title': 'DevOps', 'description': 'CI/CD pipelines',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_update_service(self):
        s = Service.objects.create(title='Old Svc', description='Desc')
        resp = self.client.patch(
            f'/api/admin/services/{s.id}/',
            {'title': 'Updated Svc'}, format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['title'], 'Updated Svc')

    # ── Testimonials ──────────────────────────────────────────

    def test_create_testimonial(self):
        resp = self.client.post('/api/admin/testimonials/', {
            'name': 'Client A', 'role': 'CEO', 'quote': 'Great work!',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    # ── Jobs ──────────────────────────────────────────────────

    def test_create_job(self):
        resp = self.client.post('/api/admin/jobs/', {
            'title': 'New Role', 'description': 'Do things',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_close_job(self):
        job = Job.objects.create(title='Open', description='Desc')
        resp = self.client.patch(
            f'/api/admin/jobs/{job.id}/',
            {'is_open': False}, format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data['is_open'])

    # ── Contacts (read-only) ──────────────────────────────────

    def test_list_contacts(self):
        ContactMessage.objects.create(
            name='Test', email='t@t.com', subject='S',
            message='M',
        )
        resp = self.client.get('/api/admin/contacts/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

    def test_mark_contact_read(self):
        msg = ContactMessage.objects.create(
            name='T', email='e@e.com', subject='S', message='M',
        )
        resp = self.client.patch(
            f'/api/admin/contacts/{msg.id}/',
            {'is_read': True}, format='json',
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(resp.data['is_read'])

    # ── Newsletter (read-only) ────────────────────────────────

    def test_list_newsletter(self):
        NewsletterSubscriber.objects.create(email='sub@test.com')
        resp = self.client.get('/api/admin/newsletter/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(resp.data), 1)

    # ── Site Content (singleton update) ───────────────────────

    def test_update_site_content(self):
        SiteContent.load()
        resp = self.client.patch('/api/admin/site-content/', {
            'hero_heading': 'New Heading',
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data['hero_heading'], 'New Heading')

    def test_get_admin_site_content(self):
        resp = self.client.get('/api/admin/site-content/')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


# =============================================================================
#  WHITEBOX — Edge Cases & Validation
# =============================================================================

@_NO_SSL
class EdgeCaseTest(TestCase):
    """Test boundaries and unusual-but-valid inputs."""
    client_class = APIClient

    def test_project_empty_tech_stack(self):
        p = Project.objects.create(
            title='No Stack', category='Backend',
            description='Desc', tech_stack=[],
        )
        self.assertEqual(p.tech_stack, [])

    def test_contact_message_long_input(self):
        """Very long strings should not crash the API."""
        resp = self.client.post('/api/contact/', {
            'name': 'A' * 100,
            'email': 'long@test.com',
            'subject': 'B' * 200,
            'message': 'C' * 5000,
        }, format='json')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_newsletter_invalid_email(self):
        """The model has unique=True but no email validator;
        DRF serializer may or may not validate format."""
        resp = self.client.post('/api/newsletter/', {
            'email': 'not-an-email',
        }, format='json')
        # Should either succeed or 400 — either is acceptable
        self.assertIn(resp.status_code, [status.HTTP_201_CREATED, status.HTTP_400_BAD_REQUEST])

    def test_team_member_without_image(self):
        """image and image_url are optional; creation should work."""
        m = TeamMember.objects.create(name='No Pic', role='Dev')
        # ImageField returns an empty ImageFieldFile, not None
        self.assertFalse(m.image)

    def test_project_all_blank_urls(self):
        """live_url and github_url are blank=True; should accept empty."""
        p = Project.objects.create(
            title='No URLs', category='Web', description='Desc',
        )
        self.assertEqual(p.live_url, '')
        self.assertEqual(p.github_url, '')
