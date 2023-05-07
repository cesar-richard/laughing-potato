from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    taux_journalier = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return self.username


class Report(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    date = models.DateField()
    temps_travaille = models.DecimalField(max_digits=3, decimal_places=2)

    def __str__(self):
        return f"{self.date}"


class ReportLineLabel(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class ReportLine(models.Model):
    report = models.ForeignKey(Report, related_name="report_lines", on_delete=models.CASCADE)
    label = models.ForeignKey(ReportLineLabel, on_delete=models.PROTECT)
    content = models.TextField()

    def __str__(self):
        return f"[{self.label.name}] {self.report.date}"
