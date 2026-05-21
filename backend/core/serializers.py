from rest_framework import serializers

from .models import HomeContent, Project, TeamMember


class ProjectSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    tech_stack = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "category",
            "description",
            "image_url",
            "link",
            "tech_stack",
            "is_pinned",
            "created_at",
        ]

    def get_image_url(self, project):
        request = self.context.get("request")
        if not project.image:
            return None

        url = project.image.url
        if request is None:
            return url

        return request.build_absolute_uri(url)

    def get_tech_stack(self, project):
        if not project.tech_stack:
            return []

        return [item.strip() for item in project.tech_stack.split(",") if item.strip()]


class HomeContentSerializer(serializers.ModelSerializer):
    why_points = serializers.SerializerMethodField()

    class Meta:
        model = HomeContent
        fields = [
            "why_title",
            "why_description",
            "why_points",
            "why_panel_title",
            "why_panel_description",
            "client_success_title",
            "client_success_description",
        ]

    def get_why_points(self, home_content):
        return [item.strip() for item in home_content.why_points.splitlines() if item.strip()]


class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = TeamMember
        fields = ["id", "name", "role", "bio", "image_url", "order"]

    def get_image_url(self, member):
        request = self.context.get("request")
        if not member.image:
            return None

        url = member.image.url
        if request is None:
            return url

        return request.build_absolute_uri(url)