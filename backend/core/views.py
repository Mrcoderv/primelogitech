from rest_framework.decorators import api_view
from rest_framework.response import Response
from .data import SERVICES, PROJECTS, TESTIMONIALS, TEAM, JOBS


@api_view(['GET'])
def get_services(request):
    return Response(SERVICES)


@api_view(['GET'])
def get_projects(request):
    return Response(PROJECTS)


@api_view(['GET'])
def get_testimonials(request):
    return Response(TESTIMONIALS)


@api_view(['GET'])
def get_team(request):
    return Response(TEAM)


@api_view(['GET'])
def get_jobs(request):
    return Response(JOBS)


@api_view(['GET'])
def home(request):
    return Response({"message": "API Working"})


@api_view(['POST'])
def contact_form(request):
    return Response({"message": "Thank you! Your message has been received."})