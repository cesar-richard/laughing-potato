import datetime
from calendar import monthrange
from itertools import groupby

from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from jours_feries_france import JoursFeries

from .models import CustomUser, Report
from .serializers import ReportSerializer


@staff_member_required
def facture_detail(request, user_id, year, month):
    user = CustomUser.objects.get(id=user_id)
    reports = Report.objects.filter(user=user, date__year=year, date__month=month).order_by('date')

    # Générer la liste de tous les jours du mois
    _, days_in_month = monthrange(int(year), int(month))
    month_days = [datetime.date(int(year), int(month), day) for day in range(1, days_in_month + 1)]

    # Grouper les rapports par date
    reports_by_date = {date: list(items) for date, items in groupby(reports, key=lambda x: x.date)}

    # Calculer le montant total
    total_temps_travaille = sum([report.temps_travaille for report in reports])
    montant = round(total_temps_travaille * user.taux_journalier, 2)

    # Calculez les agrégats des rapports pour chaque jour du mois
    aggregated_reports = []
    for date, items in reports_by_date.items():
        report_serialized = ReportSerializer(items, many=True)
        aggregated_report = {
            'date': date,
            'temps_travaille': sum([report.temps_travaille for report in items]),
            'report_lines': [],
            'jour_ferie': report_serialized.data[0].get("jour_ferie"),
            # prenez la valeur de "jour_ferie" pour le premier rapport de cette date
            'weekend': report_serialized.data[0].get("weekend"),
            # prenez la valeur de "weekend" pour le premier rapport de cette date
        }
        for report in items:
            for line in report.report_lines.all():
                aggregated_report['report_lines'].append(line)
        aggregated_reports.append(aggregated_report)

    # Créez une liste de dictionnaires pour chaque jour du mois avec les valeurs par défaut
    default_data = {
        'temps_travaille': 0,
        'report_lines': [],
    }

    def is_jour_ferie(date):
        jours_feries = JoursFeries.for_year(date.year)
        return date in jours_feries.values()

    def is_weekend(date):
        return date.weekday() >= 5

    daily_reports = [{'date': date, 'jour_ferie': is_jour_ferie(date), 'weekend': is_weekend(date), **default_data} for
                     date in month_days]

    # Mettez à jour la liste avec les données agrégées des rapports pour les jours correspondants
    for aggregated_report in aggregated_reports:
        for daily_report in daily_reports:
            if daily_report['date'] == aggregated_report['date']:
                daily_report.update(aggregated_report)
                break

    context = {
        'user': user,
        'year': year,
        'month': month,
        'total_temps_travaille': total_temps_travaille,
        'montant': montant,
        'month_days': month_days,
        'daily_reports': daily_reports,
    }

    return render(request, 'reports/facture_detail.html', context)
