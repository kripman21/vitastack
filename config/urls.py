from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse, HttpResponse
import os

def api_root_view(request):
    return JsonResponse({
        "name": "VitaStack / BioTask API",
        "version": "1.0.0",
        "status": "online",
        "endpoints": {
            "auth": "/api/auth/",
            "tasks": "/api/tasks/",
            "vitality": "/api/vitality/",
        }
    })

def serve_react(request):
    index_path = settings.BASE_DIR / 'prototipo' / 'dist' / 'index.html'
    if index_path.exists():
        with open(index_path, 'r', encoding='utf-8') as f:
            return HttpResponse(f.read())
    return JsonResponse({"message": "VitaStack API is running. React frontend static dist/ not found."})

urlpatterns = [
    path('', serve_react, name='index'),
    path('admin/', admin.site.urls),
    path('api/', api_root_view, name='api-root'),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/vitality/', include('apps.vitality.urls')),
    path('api/tasks/', include('apps.tasks.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
