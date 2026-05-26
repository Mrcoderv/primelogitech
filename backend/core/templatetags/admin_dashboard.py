from django import template
from django.utils import timezone

from core.models import ContactMessage, NewsletterSubscriber

register = template.Library()


@register.simple_tag
def recent_contact_messages(limit=5):
    return ContactMessage.objects.order_by("-created_at")[: int(limit)]


@register.simple_tag
def newsletter_dashboard_stats():
    today = timezone.localdate()
    return {
        "total": NewsletterSubscriber.objects.count(),
        "active": NewsletterSubscriber.objects.filter(is_active=True).count(),
        "today": NewsletterSubscriber.objects.filter(subscribed_at__date=today).count(),
    }
