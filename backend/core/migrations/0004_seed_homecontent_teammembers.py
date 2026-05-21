from django.db import migrations


def seed_home_content_and_team(apps, schema_editor):
	HomeContent = apps.get_model('core', 'HomeContent')
	TeamMember = apps.get_model('core', 'TeamMember')

	HomeContent.objects.get_or_create(
		why_title='Why partner with Prime Logic Tech?',
		defaults={
			'why_description': "We don't just write code; we build strategic digital assets. Our approach combines technical excellence with business acumen to deliver measurable results.",
			'why_points': 'Agile development methodology for rapid delivery\nEnterprise-grade security and scalability\nAward-winning UI/UX design team\n24/7 dedicated support and maintenance',
			'why_panel_title': 'Creative delivery, engineered to scale',
			'why_panel_description': 'The right side is a living visual panel that can be customized from the admin area. It is meant to reinforce the brand rather than display loading content.',
			'client_success_title': 'Client Success',
			'client_success_description': "Don't just take our word for it. Hear what our partners have to say about working with Prime Logic Tech.",
		}
	)

	team_members = [
		('Prasiddha Gyawali', 'CEO & Founder', 'Visionary leader driving the strategic direction of Prime Logic Tech to deliver exceptional digital experiences.', 0),
		('Pralhad Gyawali', 'Co-Founder', 'Passionate about building scalable systems and establishing the core technical foundation of our enterprise solutions.', 1),
		('Binit Raj Pandey', 'Co-Founder', 'Dedicated to crafting intuitive products and driving innovation across all aspects of design and development.', 2),
		('Raghav Panthi', 'Junior Co-Founder', 'A rising talent focusing on modern development practices and bringing fresh perspectives to our technology stack.', 3),
		('Ekata Pokherel', 'Junior Co-Founder', 'Focused on collaborative product thinking, delivery quality, and keeping the team execution sharp.', 4),
	]

	for name, role, bio, order in team_members:
		TeamMember.objects.get_or_create(
			name=name,
			defaults={
				'role': role,
				'bio': bio,
				'order': order,
				'is_active': True,
			},
		)


def unseed_home_content_and_team(apps, schema_editor):
	HomeContent = apps.get_model('core', 'HomeContent')
	TeamMember = apps.get_model('core', 'TeamMember')
	TeamMember.objects.filter(name__in=[
		'Prasiddha Gyawali',
		'Pralhad Gyawali',
		'Binit Raj Pandey',
		'Raghav Panthi',
		'Ekata Pokherel',
	]).delete()
	HomeContent.objects.filter(why_title='Why partner with Prime Logic Tech?').delete()


class Migration(migrations.Migration):

	dependencies = [
		('core', '0003_homecontent_teammember'),
	]

	operations = [
		migrations.RunPython(seed_home_content_and_team, unseed_home_content_and_team),
	]