from rest_framework import permissions


class IsOrganizationOwner(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'OWNER'


class IsOrganizationAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ('OWNER', 'ADMIN')


class IsOrganizationMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ('OWNER', 'ADMIN', 'MEMBER')


class IsOrganizationGuest(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role in ('OWNER', 'ADMIN', 'MEMBER', 'GUEST')
