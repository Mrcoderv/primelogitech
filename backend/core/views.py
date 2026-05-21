from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import HomeContent, Project, TeamMember
from .serializers import HomeContentSerializer, ProjectSerializer, TeamMemberSerializer

@api_view(['GET'])
def home(request):
    return Response({"message": "API Working"})


@api_view(["GET"])
def project_list(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def home_content(request):
    content = HomeContent.objects.order_by("id").first()
    if content is None:
        content = HomeContent.objects.create()

    serializer = HomeContentSerializer(content, context={"request": request})
    return Response(serializer.data)


@api_view(["GET"])
def team_list(request):
    members = TeamMember.objects.filter(is_active=True).order_by("order", "name")
    serializer = TeamMemberSerializer(members, many=True, context={"request": request})
    return Response(serializer.data)