from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Service, Project, Testimonial, Employee, Job, ContactSettings, ContactMessage
from .serializers import (
    ServiceSerializer, ProjectSerializer, TestimonialSerializer,
    EmployeeSerializer, JobSerializer, ContactSettingsSerializer, ContactMessageSerializer
)


@api_view(['GET'])
def get_services(request):
    services = Service.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_projects(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_featured_projects(request):
    featured_projects = Project.objects.filter(is_featured=True).order_by('order')
    serializer = ProjectSerializer(featured_projects, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_testimonials(request):
    testimonials = Testimonial.objects.all()
    serializer = TestimonialSerializer(testimonials, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_team(request):
    employees = Employee.objects.all()
    serializer = EmployeeSerializer(employees, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_jobs(request):
    jobs = Job.objects.filter(is_active=True)
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_contact_settings(request):
    try:
        settings = ContactSettings.objects.first()
        if not settings:
            settings = ContactSettings.objects.create()
        serializer = ContactSettingsSerializer(settings)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def home(request):
    return Response({"message": "Prime Logic Tech API - Working"})


@api_view(['POST'])
def contact_form(request):
    if request.method == 'POST':
        serializer = ContactMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Thank you! Your message has been received. We'll get back to you soon."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
