from django.urls import path

from . import views

urlpatterns = [
    path('reports/', views.ReportListCreate.as_view(), name='report_list_create'),
    path('reports/<int:pk>/', views.ReportRetrieveUpdateDestroy.as_view(), name='report_retrieve_update_destroy'),
    path('report_lines/', views.ReportLineListCreate.as_view(), name='report_line_list_create'),
    path('report_lines/<int:pk>/', views.ReportLineRetrieveUpdateDestroy.as_view(),
         name='report_line_retrieve_update_destroy'),
    path('report_line_labels/', views.ReportLineLabelList.as_view(), name='report_line_label_list'),
    path('users/', views.CustomUserList.as_view(), name='custom_user_list'),
    path('facture/<int:user_id>/<int:year>/<int:month>/', views.FactureView.as_view(), name='facture'),
]
