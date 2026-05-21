from django.db import migrations, models


class Migration(migrations.Migration):

	dependencies = [
		("core", "0002_alter_project_tech_stack"),
	]

	operations = [
		migrations.CreateModel(
			name="HomeContent",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("why_title", models.CharField(default="Why partner with Prime Logitech?", max_length=200)),
				("why_description", models.TextField(default="We don't just write code; we build strategic digital assets. Our approach combines technical excellence with business acumen to deliver measurable results.")),
				("why_points", models.TextField(default="Agile development methodology for rapid delivery\nEnterprise-grade security and scalability\nAward-winning UI/UX design team\n24/7 dedicated support and maintenance")),
				("why_panel_title", models.CharField(default="Creative delivery, engineered to scale", max_length=200)),
				("why_panel_description", models.TextField(default="The right side is a living visual panel that can be customized from the admin area. It is meant to reinforce the brand rather than display loading content.")),
				("client_success_title", models.CharField(default="Client Success", max_length=200)),
				("client_success_description", models.TextField(default="Don't just take our word for it. Hear what our partners have to say about working with Prime Logitech.")),
			],
		),
		migrations.CreateModel(
			name="TeamMember",
			fields=[
				("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
				("name", models.CharField(max_length=200)),
				("role", models.CharField(max_length=200)),
				("bio", models.TextField()),
				("image", models.FileField(blank=True, null=True, upload_to="team/")),
				("order", models.PositiveIntegerField(default=0)),
				("is_active", models.BooleanField(default=True)),
			],
			options={
				"ordering": ["order", "name"],
			},
		),
	]