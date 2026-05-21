from django.db import models


class Project(models.Model):
	title = models.CharField(max_length=200)
	category = models.CharField(max_length=120, blank=True, default="")
	description = models.TextField()
	image = models.FileField(upload_to="projects/", blank=True, null=True)
	link = models.URLField(blank=True, default="")
	tech_stack = models.TextField(blank=True, default="")
	is_pinned = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		ordering = ["-is_pinned", "-created_at"]

	def __str__(self):
		return self.title


class HomeContent(models.Model):
	why_title = models.CharField(max_length=200, default="Why partner with Prime Logic Tech?")
	why_description = models.TextField(
		default="We don't just write code; we build strategic digital assets. Our approach combines technical excellence with business acumen to deliver measurable results."
	)
	why_points = models.TextField(
		default=(
			"Agile development methodology for rapid delivery\n"
			"Enterprise-grade security and scalability\n"
			"Award-winning UI/UX design team\n"
			"24/7 dedicated support and maintenance"
		)
	)
	why_panel_title = models.CharField(max_length=200, default="Creative delivery, engineered to scale")
	why_panel_description = models.TextField(
		default="The right side is a living visual panel that can be customized from the admin area. It is meant to reinforce the brand rather than display loading content."
	)
	client_success_title = models.CharField(max_length=200, default="Client Success")
	client_success_description = models.TextField(
		default="Don't just take our word for it. Hear what our partners have to say about working with Prime Logic Tech."
	)

	def __str__(self):
		return "Homepage content"


class TeamMember(models.Model):
	name = models.CharField(max_length=200)
	role = models.CharField(max_length=200)
	bio = models.TextField()
	image = models.FileField(upload_to="team/", blank=True, null=True)
	order = models.PositiveIntegerField(default=0)
	is_active = models.BooleanField(default=True)

	class Meta:
		ordering = ["order", "name"]

	def __str__(self):
		return self.name
