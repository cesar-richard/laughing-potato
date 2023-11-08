from django.contrib import admin
from django.urls import path
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count, Sum

from . import admin_views
from .models import CustomUser, InvoiceSummary, Report, ReportLineLabel, ReportLine, Client, Organization, OrganizationUser

admin.site.site_title = 'Laughing Potato Administration'
admin.site.site_header = 'Laughing Potato Administration'
admin.site.index_title = 'Laughing Potato Administration'


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('id', 'username', 'taux_journalier')
    fieldsets = UserAdmin.fieldsets + (
        ("Facturation", {'fields': ('taux_journalier',)}),
    )


class ReportLineInline(admin.TabularInline):
    model = ReportLine
    extra = 1


class OrganizationUserInline(admin.TabularInline):
    model = OrganizationUser
    extra = 1


@admin.register(Report)
class ReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date', "client")
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
    list_display = ('id', 'name', 'client')


@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address')


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'address')
    inlines = [OrganizationUserInline]


@admin.register(InvoiceSummary)
class SaleSummaryAdmin(admin.ModelAdmin):
    change_list_template = 'admin/invoice_summary_change_list.html'
    date_hierarchy = 'date'

    def changelist_view(self, request, extra_context=None):
        response = super().changelist_view(
            request,
            extra_context=extra_context,
        )

        print(self.__dict__)

        try:
            qs = response.context_data['cl'].queryset
        except (AttributeError, KeyError):
            return response

        metrics = {
            'total': Count('id'),
            'total_jours_travailles': Sum('temps_travaille'),
        }

        response.context_data['summary'] = list(
            qs
            .values('client__name')
            .annotate(**metrics)
            .order_by('-date')
        )

        return response