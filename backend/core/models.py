from django.db import models
from django.utils import timezone


class ContactSettings(models.Model):
    """Store company contact information"""
    email = models.EmailField(default='primelogictech3@gmail.com')
    phone = models.CharField(max_length=20, default='+1 (555) 123-4567')
    location = models.CharField(max_length=255, default='Kathmandu, Nepal')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Contact Settings"

    def __str__(self):
        return "Company Contact Information"


class Service(models.Model):
    """Services offered by the company"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, help_text="Lucide icon name (e.g., Code, Smartphone)")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Project(models.Model):
    """Portfolio projects"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    image_url = models.URLField()
    technologies = models.CharField(max_length=255, help_text="Comma-separated technologies")
    link = models.URLField(blank=True)
    is_featured = models.BooleanField(default=False, help_text="Pin this project to appear in Featured Work section")
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Job(models.Model):
    """Job postings for careers page"""
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    job_type = models.CharField(
        max_length=50,
        choices=[('Full-time', 'Full-time'), ('Part-time', 'Part-time'), ('Contract', 'Contract')],
        default='Full-time'
    )
    salary_range = models.CharField(max_length=100, blank=True)
    requirements = models.TextField(help_text="List requirements, one per line")
    form_link = models.URLField(help_text="Link to application form (Google Form, TypeForm, etc.)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Employee(models.Model):
    """Team members/Employees"""
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    image_url = models.URLField()
    email = models.EmailField(blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.role}"


class Testimonial(models.Model):
    """Client testimonials"""
    name = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    message = models.TextField()
    rating = models.PositiveIntegerField(
        choices=[(1, '1 Star'), (2, '2 Stars'), (3, '3 Stars'), (4, '4 Stars'), (5, '5 Stars')],
        default=5
    )
    image_url = models.URLField(blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name} - {self.company}"


class ContactMessage(models.Model):
    """Messages from contact form"""
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=255)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.subject}"

