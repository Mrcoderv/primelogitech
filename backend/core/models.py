from django.db import models


class SiteContent(models.Model):
    # Hero
    hero_badge       = models.CharField(max_length=100, default="Prime Logic Tech is now live")
    hero_heading     = models.TextField(default="Design. Develop. Deliver.")
    hero_subtitle    = models.TextField(default="We build modern web and mobile solutions for forward-thinking businesses.")
    hero_cta_primary = models.CharField(max_length=80, default="Start a Project")
    hero_cta_secondary = models.CharField(max_length=80, default="View Our Work")

    # Trusted by logos — list of {"name": "ACME", "image_url": "https://..."}
    trusted_by_logos = models.JSONField(default=list)

    # Why Partner section
    why_title       = models.CharField(max_length=200, default="Why Partner With Us")
    why_description = models.TextField(default="")
    why_checklist   = models.JSONField(default=list)

    # Stats
    stat_projects   = models.CharField(max_length=50, default="150+")
    stat_clients    = models.CharField(max_length=50, default="98%")
    stat_team       = models.CharField(max_length=50, default="45+")
    stat_experience = models.CharField(max_length=50, default="10+")

    # About page
    about_mission = models.TextField(default="")
    about_vision  = models.TextField(default="")

    # CTA section
    cta_heading     = models.CharField(max_length=200, default="Ready to Build Something Great?")
    cta_subtitle    = models.TextField(default="")
    cta_button_text = models.CharField(max_length=80, default="Start a Project")

    # Contact info
    contact_email   = models.EmailField(default="hello@primelogictech.com")
    contact_phone   = models.CharField(max_length=30, default="+1 (555) 123-4567")
    contact_address = models.CharField(max_length=200, default="Kathmandu, Nepal")

    # Footer
    footer_tagline = models.CharField(max_length=300, default="")

    class Meta:
        verbose_name = "Site Content"

    def __str__(self):
        return "Site Content"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


class Project(models.Model):
    title       = models.CharField(max_length=200)
    category    = models.CharField(max_length=100)
    description = models.TextField()
    image       = models.ImageField(upload_to='projects/', blank=True, null=True)
    image_url   = models.URLField(blank=True)
    tech_stack  = models.JSONField(default=list)
    live_url    = models.URLField(blank=True)
    github_url  = models.URLField(blank=True)
    pinned      = models.BooleanField(default=False)
    order       = models.IntegerField(default=0)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-pinned', 'order', '-created_at']

    def __str__(self):
        return self.title


class TeamMember(models.Model):
    name         = models.CharField(max_length=100)
    role         = models.CharField(max_length=100)
    bio          = models.TextField(blank=True)
    image        = models.ImageField(upload_to='team/', blank=True, null=True)
    image_url    = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url   = models.URLField(blank=True)
    twitter_url  = models.URLField(blank=True)
    order        = models.IntegerField(default=0)
    is_active    = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Service(models.Model):
    title       = models.CharField(max_length=150)
    description = models.TextField()
    icon        = models.CharField(max_length=50, default="Code")
    order       = models.IntegerField(default=0)
    is_active   = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Testimonial(models.Model):
    name       = models.CharField(max_length=100)
    role       = models.CharField(max_length=100)
    company    = models.CharField(max_length=100, blank=True)
    quote      = models.TextField()
    avatar_url = models.URLField(blank=True)
    order      = models.IntegerField(default=0)
    is_active  = models.BooleanField(default=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} — {self.company}"


class Job(models.Model):
    TYPE_CHOICES = [
        ('full-time', 'Full Time'),
        ('part-time', 'Part Time'),
        ('contract', 'Contract'),
        ('internship', 'Internship'),
    ]
    title       = models.CharField(max_length=200)
    department  = models.CharField(max_length=100, blank=True)
    location    = models.CharField(max_length=100, default="Remote")
    job_type    = models.CharField(max_length=20, choices=TYPE_CHOICES, default='full-time')
    description = models.TextField()
    requirements = models.JSONField(default=list)
    is_open     = models.BooleanField(default=True)
    created_at  = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name       = models.CharField(max_length=100)
    email      = models.EmailField()
    subject    = models.CharField(max_length=200)
    message    = models.TextField()
    assigned_user = models.ForeignKey(
        "AdminUser",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="assigned_contact_messages",
    )
    is_read    = models.BooleanField(default=False)
    action_done = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.subject}"


class NewsletterSubscriber(models.Model):
    email         = models.EmailField(unique=True)
    is_active     = models.BooleanField(default=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return self.email


class AdminUser(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin - Full Access'),
        ('editor', 'Editor - Content Management'),
        ('viewer', 'Viewer - Read Only'),
    ]
    
    username       = models.CharField(max_length=150, unique=True)
    email          = models.EmailField(unique=True)
    email_notifications_enabled = models.BooleanField(default=True)
    password_hash  = models.CharField(max_length=255)
    role           = models.CharField(max_length=20, choices=ROLE_CHOICES, default='editor')
    is_active      = models.BooleanField(default=True)
    
    # Permissions (JSON for flexibility)
    permissions    = models.JSONField(default=dict, blank=True)
    
    last_login     = models.DateTimeField(null=True, blank=True)
    created_at     = models.DateTimeField(auto_now_add=True)
    updated_at     = models.DateTimeField(auto_now=True)
    created_by     = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

    def save(self, *args, **kwargs):
        from django.contrib.auth.hashers import identify_hasher, make_password

        # Keep password_hash safe for API auth and Django admin login sync.
        try:
            identify_hasher(self.password_hash)
        except ValueError:
            self.password_hash = make_password(self.password_hash)

        super().save(*args, **kwargs)
        self._sync_django_staff_user()

    def _sync_django_staff_user(self):
        from django.contrib.auth import get_user_model

        user_model = get_user_model()
        defaults = {
            "email": self.email,
            "is_active": self.is_active,
            "is_staff": True,
            "is_superuser": self.role == "admin",
        }
        django_user, created = user_model.objects.get_or_create(
            username=self.username,
            defaults=defaults,
        )

        changed_fields = []
        for field, value in defaults.items():
            if getattr(django_user, field) != value:
                setattr(django_user, field, value)
                changed_fields.append(field)

        if django_user.password != self.password_hash:
            django_user.password = self.password_hash
            changed_fields.append("password")

        if created:
            django_user.save()
        elif changed_fields:
            django_user.save(update_fields=changed_fields)


class SMTPSetting(models.Model):
    SMTP_KEYS = [
        ("SMTP_HOST", "SMTP Host"),
        ("SMTP_PORT", "SMTP Port"),
        ("SMTP_USER", "SMTP User"),
        ("SMTP_PASS", "SMTP Password"),
    ]

    key = models.CharField(max_length=30, choices=SMTP_KEYS, unique=True)
    value = models.TextField(blank=True, default="")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["key"]
        verbose_name = "SMTP Setting"
        verbose_name_plural = "SMTP Settings"

    def __str__(self):
        return self.key

    @classmethod
    def get_value(cls, key, default=""):
        try:
            item = cls.objects.get(key=key)
            return item.value
        except cls.DoesNotExist:
            return default

    @classmethod
    def ensure_defaults(cls):
        for key, _ in cls.SMTP_KEYS:
            cls.objects.get_or_create(key=key, defaults={"value": ""})


class ImageAsset(models.Model):
    TYPE_CHOICES = [
        ('project', 'Project'),
        ('team', 'Team Member'),
        ('service', 'Service'),
        ('other', 'Other'),
    ]
    
    filename       = models.CharField(max_length=255)
    url            = models.URLField()
    cloudinary_id  = models.CharField(max_length=255, blank=True)  # Store Cloudinary public_id for deletion
    size           = models.IntegerField(default=0)  # Size in bytes
    asset_type     = models.CharField(max_length=20, choices=TYPE_CHOICES, default='other')
    alt_text       = models.CharField(max_length=200, blank=True)
    
    uploaded_at    = models.DateTimeField(auto_now_add=True)
    uploaded_by    = models.CharField(max_length=150, blank=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return self.filename
