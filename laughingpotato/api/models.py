from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    taux_journalier = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    clients = models.ManyToManyField('Client', blank=True)

    def __str__(self):
        return self.username


class Report(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    temps_travaille = models.DecimalField(max_digits=3, decimal_places=2)
    client = models.ForeignKey('Client', on_delete=models.PROTECT)

    def __str__(self):
        return f"{self.date}"


class ReportLineLabel(models.Model):
    name = models.CharField(max_length=255)
    client = models.ForeignKey('Client', on_delete=models.PROTECT)

    def __str__(self):
        return self.name


class ReportLine(models.Model):
    report = models.ForeignKey(Report, related_name="report_lines", on_delete=models.CASCADE)
    label = models.ForeignKey(ReportLineLabel, on_delete=models.PROTECT)
    content = models.TextField()

    def __str__(self):
        return f"[{self.label.name}] {self.report.date}"


class Client(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Organization(models.Model):
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    clients = models.ManyToManyField(Client, blank=True)
    users = models.ManyToManyField(CustomUser, through='OrganizationUser', blank=True)

    def __str__(self):
        return self.name


class OrganizationUser(models.Model):
    class Role(models.TextChoices):
        PROPRIETAIRE = 'Propriétaire', 'Propriétaire'
        ADMINISTRATEUR = 'Administrateur', 'Administrateur'
        MEMBRE = 'Membre', 'Membre'
        INVITE = 'Invité', 'Invité'

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=Role.choices)

    def __str__(self):
        return f"{self.user} - {self.organization} ({self.role})"

class InvoiceSummary(Report):
    class Meta:
        proxy = True
        verbose_name = 'Invoices Summary'
        verbose_name_plural = 'Invoice Summaries'
    