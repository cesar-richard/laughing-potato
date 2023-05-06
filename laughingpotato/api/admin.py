from django.contrib import admin
from django.urls import path

from . import admin_views
from .models import CustomUser, Report, ReportLineLabel, ReportLine

admin.site.site_title = 'Laughing Potato Administration'
admin.site.site_header = 'Laughing Potato Administration'
admin.site.index_title = 'Laughing Potato Administration'

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'taux_journalier')


class ReportLineInline(admin.TabularInline):
    model = ReportLine
    extra = 1


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date')
    fields = ('user', 'date', 'temps_travaille')
    inlines = [ReportLineInline]

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('facture/<int:user_id>/<int:year>/<int:month>/',
                 self.admin_site.admin_view(admin_views.facture_detail), name='facture_detail'),
        ]
        return custom_urls + urls


@admin.register(ReportLineLabel)
class ReportLineLabelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
