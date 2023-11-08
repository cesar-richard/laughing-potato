from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework import viewsets

from .models import (
    Report, CustomUser, ReportLineLabel, ReportLine, Client,
    Organization, OrganizationUser
)
from .serializers import (
    ReportSerializer, CustomUserSerializer, ReportLineLabelSerializer,
    ReportLineSerializer, ClientSerializer, OrganizationSerializer,
    OrganizationUserSerializer
)


class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class CustomUserList(viewsets.ReadOnlyModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class FactureView(generics.GenericAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def get(self, request, user_id, year, month):
        try:
            user = CustomUser.objects.get(id=user_id)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Utilisateur introuvable."}, status=status.HTTP_404_NOT_FOUND)

        reports = self.queryset.filter(
            user=user,
            date__year=year,
            date__month=month
        )

        if not reports.exists():
            return Response({"detail": "Aucun rapport trouvé pour cet utilisateur et cette période."},
                            status=status.HTTP_404_NOT_FOUND)

        facture_data = {
            "user": CustomUserSerializer(user).data,
            "year": year,
            "month": month,
            "reports": ReportSerializer(reports, many=True).data,
        }

        total_temps_travaille = reports.aggregate(Sum('temps_travaille'))['temps_travaille__sum']
        montant = total_temps_travaille * user.taux_journalier
        facture_data["montant"] = round(montant, 2)

        return Response(facture_data)


class ReportLineViewSet(viewsets.ModelViewSet):
    queryset = ReportLine.objects.all()
    serializer_class = ReportLineSerializer


class ReportLineLabelViewSet(viewsets.ModelViewSet):
    queryset = ReportLineLabel.objects.all()
    serializer_class = ReportLineLabelSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer


class OrganizationUserViewSet(viewsets.ModelViewSet):
    queryset = OrganizationUser.objects.all()
    serializer_class = OrganizationUserSerializer
