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
    is_read    = models.BooleanField(default=False)
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
