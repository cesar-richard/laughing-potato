from jours_feries_france import JoursFeries
from rest_framework import serializers

from .models import (
    Report, CustomUser, ReportLine, ReportLineLabel, Client,
    Organization, OrganizationUser
)


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'taux_journalier']


class ReportLineLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReportLineLabel
        fields = ['id', 'name']


class ReportLineSerializer(serializers.ModelSerializer):
    label = ReportLineLabelSerializer()

    class Meta:
        model = ReportLine
        fields = ['id', 'label', 'content']


class ReportSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    jour_ferie = serializers.SerializerMethodField()
    weekend = serializers.SerializerMethodField()
    report_lines = ReportLineSerializer(many=True)

    class Meta:
        model = Report
        fields = ['id', 'user', 'date', 'report_lines', 'temps_travaille', 'jour_ferie', 'weekend']

    def get_jour_ferie(self, obj):
        jours_feries = JoursFeries.for_year(obj.date.year)
        return obj.date in jours_feries.values()

    def get_weekend(self, obj):
        return obj.date.weekday() >= 5


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = ['id', 'name', 'address']


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['id', 'name', 'address']


class OrganizationUserSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer()
    organization = OrganizationSerializer()

    class Meta:
        model = OrganizationUser
        fields = ['id', 'user', 'organization', 'role']
