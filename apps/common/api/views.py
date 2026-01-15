from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import RegistrationSerializer, UserInfoSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView

class AuthViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'])
    def register(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = serializer.save()
        return Response({
            "message": "Organization created successfully",
            "username": result['user'].username,
            "tenant_id": result['organization'].slug
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def login(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        user = authenticate(username=username, password=password)
        if user:
            # Get user's organizations
            memberships = user.tenant_memberships.select_related('organization').all()
            orgs = [
                {
                    "id": m.organization.slug,
                    "name": m.organization.name,
                    "is_admin": m.is_admin
                }
                for m in memberships
            ]
            
            user_data = UserInfoSerializer(user).data
            # Return orgs along with user info
            return Response({
                **user_data,
                "organizations": orgs
            })
        
        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
