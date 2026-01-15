from rest_framework import serializers
from apps.common.models import Organization, TenantUser
from django.contrib.auth.models import User

class RegistrationSerializer(serializers.Serializer):
    # Organization
    org_name = serializers.CharField(max_length=255)
    org_slug = serializers.CharField(max_length=50)
    
    # User
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate_org_slug(self, value):
        if Organization.objects.filter(slug=value).exists():
            raise serializers.ValidationError("Organization ID already taken.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def create(self, validated_data):
        # 1. Create User
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

        # 2. Create Organization
        org = Organization.objects.create(
            name=validated_data['org_name'],
            slug=validated_data['org_slug']
        )

        # 3. Link them (Admin)
        TenantUser.objects.create(user=user, organization=org, is_admin=True)

        return {
            "user": user,
            "organization": org
        }

class UserInfoSerializer(serializers.ModelSerializer):
    tenant_slug = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'tenant_slug')

    def get_tenant_slug(self, obj):
        # Return the first tenant they belong to (MVP simplification)
        membership = obj.tenant_memberships.first()
        return membership.organization.slug if membership else None
