from django.db.models import Sum
from rest_framework import generics, status
from rest_framework.response import Response

from .models import Report, CustomUser, ReportLineLabel, ReportLine
from .serializers import ReportSerializer, CustomUserSerializer, ReportLineLabelSerializer, ReportLineSerializer


# Ajoutez ces imports
class ReportListCreate(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class ReportRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer


class CustomUserList(generics.ListAPIView):
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


class ReportLineListCreate(generics.ListCreateAPIView):
    queryset = ReportLine.objects.all()
    serializer_class = ReportLineSerializer


class ReportLineRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = ReportLine.objects.all()
    serializer_class = ReportLineSerializer


class ReportLineLabelList(generics.ListAPIView):
    queryset = ReportLineLabel.objects.all()
    serializer_class = ReportLineLabelSerializer
