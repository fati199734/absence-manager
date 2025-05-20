from rest_framework.routers import DefaultRouter
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (
    DepartementViewSet, FiliereViewSet, GroupeViewSet, UtilisateurViewSet, EnseignantViewSet, EtudiantViewSet,
    ModuleViewSet, ElementModuleViewSet, InscriptionElementViewSet, SeanceViewSet, SessionQRViewSet,
    PresenceViewSet, RapportPresenceViewSet, NotificationEmailViewSet, generer_rapport_excel, generer_rapport_pdf,
    enseignant_seances, etudiants_par_element, enregistrer_pointage
)

router = DefaultRouter()
router.register(r'departements', DepartementViewSet)
router.register(r'filieres', FiliereViewSet)
router.register(r'groupes', GroupeViewSet)
router.register(r'utilisateurs', UtilisateurViewSet)
router.register(r'enseignants', EnseignantViewSet)
router.register(r'etudiants', EtudiantViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'elements', ElementModuleViewSet)
router.register(r'inscriptions', InscriptionElementViewSet)
router.register(r'seances', SeanceViewSet)
router.register(r'sessionsqr', SessionQRViewSet)
router.register(r'presences', PresenceViewSet)
router.register(r'rapports', RapportPresenceViewSet)
router.register(r'notifications', NotificationEmailViewSet)

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('rapports/generer/', generer_rapport_excel, name='generer_rapport_excel'),
    path('rapports/generer_pdf/', generer_rapport_pdf, name='generer_rapport_pdf'),
    path('enseignant/seances/', enseignant_seances, name='enseignant-seances'),
    path('elements/<int:element_id>/etudiants/', etudiants_par_element, name='etudiants-par-element'),
    path('presences/enregistrer/', enregistrer_pointage, name='enregistrer-pointage'),
]
urlpatterns += router.urls 