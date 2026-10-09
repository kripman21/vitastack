from django.urls import path
from .views import DailyCheckInCreateView, EnergyHistoryListView, TeamStatusView

urlpatterns = [
    path('checkin/', DailyCheckInCreateView.as_view(), name='daily_checkin'),
    path('my-history/', EnergyHistoryListView.as_view(), name='energy_history'),
    path('team-status/', TeamStatusView.as_view(), name='team_status'),
]
