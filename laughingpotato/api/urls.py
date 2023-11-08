from django.urls import include, path
from rest_framework import routers

from . import views


api_router = routers.DefaultRouter()
api_router.register('reports', views.ReportViewSet)
api_router.register('report_lines', views.ReportLineViewSet)
api_router.register('report_line_labels', views.ReportLineLabelViewSet)
api_router.register('users', views.CustomUserList)
api_router.register('clients', views.ClientViewSet)
api_router.register('organizations', views.OrganizationViewSet)
api_router.register('organization_users', views.OrganizationUserViewSet)

urlpatterns = [
    path("", include(api_router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('facture/<int:user_id>/<int:year>/<int:month>/', views.FactureView.as_view(), name='facture'),
]
