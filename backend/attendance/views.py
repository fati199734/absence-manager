from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import (
    Departement, Filiere, Groupe, Utilisateur, Enseignant, Etudiant, Module, ElementModule,
    InscriptionElement, Seance, SessionQR, Presence, RapportPresence, NotificationEmail
)
from .serializers import (
    DepartementSerializer, FiliereSerializer, GroupeSerializer, UtilisateurSerializer, EnseignantSerializer,
    EtudiantSerializer, ModuleSerializer, ElementModuleSerializer, InscriptionElementSerializer, SeanceSerializer,
    SessionQRSerializer, PresenceSerializer, RapportPresenceSerializer, NotificationEmailSerializer
)
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count
from django.db.models import Q as modelsQ
from django.http import HttpResponse
import pandas as pd
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from io import BytesIO
import os
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status

# Permissions personnalisées
class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff

# Create your views here.

class DepartementViewSet(viewsets.ModelViewSet):
    queryset = Departement.objects.all()
    serializer_class = DepartementSerializer
    permission_classes = [IsAdminOrReadOnly]

class FiliereViewSet(viewsets.ModelViewSet):
    queryset = Filiere.objects.all()
    serializer_class = FiliereSerializer
    permission_classes = [IsAdminOrReadOnly]

class GroupeViewSet(viewsets.ModelViewSet):
    queryset = Groupe.objects.all()
    serializer_class = GroupeSerializer
    permission_classes = [IsAdminOrReadOnly]

class UtilisateurViewSet(viewsets.ModelViewSet):
    queryset = Utilisateur.objects.all()
    serializer_class = UtilisateurSerializer
    permission_classes = [IsAdminOrReadOnly]

class EnseignantViewSet(viewsets.ModelViewSet):
    queryset = Enseignant.objects.all()
    serializer_class = EnseignantSerializer
    permission_classes = [IsAdminOrReadOnly]

class EtudiantViewSet(viewsets.ModelViewSet):
    queryset = Etudiant.objects.all()
    serializer_class = EtudiantSerializer
    permission_classes = [IsAdminOrReadOnly]

class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAdminOrReadOnly]

class ElementModuleViewSet(viewsets.ModelViewSet):
    queryset = ElementModule.objects.all()
    serializer_class = ElementModuleSerializer
    permission_classes = [IsAdminOrReadOnly]

class InscriptionElementViewSet(viewsets.ModelViewSet):
    queryset = InscriptionElement.objects.all()
    serializer_class = InscriptionElementSerializer
    permission_classes = [IsAdminOrReadOnly]

class SeanceViewSet(viewsets.ModelViewSet):
    queryset = Seance.objects.all()
    serializer_class = SeanceSerializer
    permission_classes = [IsAdminOrReadOnly]

class SessionQRViewSet(viewsets.ModelViewSet):
    queryset = SessionQR.objects.all()
    serializer_class = SessionQRSerializer
    permission_classes = [IsAdminOrReadOnly]

class PresenceViewSet(viewsets.ModelViewSet):
    queryset = Presence.objects.all()
    serializer_class = PresenceSerializer
    permission_classes = [IsAdminOrReadOnly]

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        total_absences = Presence.objects.filter(statut='absent').count()
        total_presences = Presence.objects.filter(statut='present').count()
        total_etudiants = Etudiant.objects.count()
        absents_uniques = Presence.objects.filter(statut='absent').values('etudiant').distinct().count()
        return Response({
            'total_absences': total_absences,
            'total_presences': total_presences,
            'total_etudiants': total_etudiants,
            'absent_students': absents_uniques,
        })

    @action(detail=False, methods=['get'], url_path='stats_par_filiere')
    def stats_par_filiere(self, request):
        data = (
            Filiere.objects
            .annotate(absences=Count('etudiants__presences', filter=modelsQ(etudiants__presences__statut='absent')))
            .values('nom_filiere', 'absences')
        )
        return Response(list(data))

    @action(detail=False, methods=['get'], url_path='stats_avancees')
    def stats_avancees(self, request):
        from .models import Filiere, Groupe, Module, Etudiant
        from django.db.models import Count, Q
        filiere_id = request.GET.get('filiere')
        groupe_id = request.GET.get('groupe')
        date_debut = request.GET.get('date_debut')
        date_fin = request.GET.get('date_fin')

        presences = Presence.objects.all()
        if filiere_id:
            presences = presences.filter(etudiant__filiere_id=filiere_id)
        if groupe_id:
            presences = presences.filter(etudiant__groupe_id=groupe_id)
        if date_debut:
            presences = presences.filter(seance__date_seance__gte=date_debut)
        if date_fin:
            presences = presences.filter(seance__date_seance__lte=date_fin)

        # Taux d'absentéisme par filière
        stats_filiere = list(
            Filiere.objects.annotate(
                total=Count('etudiants__presences'),
                absents=Count('etudiants__presences', filter=Q(etudiants__presences__statut='absent'))
            ).values('nom_filiere', 'total', 'absents')
        )
        # Taux d'absentéisme par groupe
        stats_groupe = list(
            Groupe.objects.annotate(
                total=Count('etudiants__presences'),
                absents=Count('etudiants__presences', filter=Q(etudiants__presences__statut='absent'))
            ).values('nom_groupe', 'total', 'absents')
        )
        # Top 5 étudiants les plus absents
        top_absents = list(
            Etudiant.objects.annotate(
                nb_abs=Count('presences', filter=Q(presences__statut='absent'))
            ).order_by('-nb_abs')[:5].values('nom', 'prenom', 'code_apogee', 'nb_abs')
        )
        # Répartition des absences par module
        stats_module = list(
            Module.objects.annotate(
                absents=Count('elements__seances__presences', filter=Q(elements__seances__presences__statut='absent'))
            ).values('nom_module', 'absents')
        )
        return Response({
            'taux_absenteisme_par_filiere': stats_filiere,
            'taux_absenteisme_par_groupe': stats_groupe,
            'top_5_absents': top_absents,
            'absences_par_module': stats_module,
        })

class RapportPresenceViewSet(viewsets.ModelViewSet):
    queryset = RapportPresence.objects.all()
    serializer_class = RapportPresenceSerializer
    permission_classes = [IsAdminOrReadOnly]

class NotificationEmailViewSet(viewsets.ModelViewSet):
    queryset = NotificationEmail.objects.all()
    serializer_class = NotificationEmailSerializer
    permission_classes = [IsAdminOrReadOnly]

@api_view(['GET'])
@permission_classes([IsAdminUser])
def generer_rapport_excel(request):
    from .models import Presence, Etudiant, Seance
    data = []
    for presence in Presence.objects.select_related('etudiant', 'seance'):
        data.append({
            'Etudiant': f"{presence.etudiant.nom} {presence.etudiant.prenom}",
            'Code Apogee': presence.etudiant.code_apogee,
            'Email': presence.etudiant.email,
            'Séance': presence.seance.id,
            'Date': presence.seance.date_seance,
            'Statut': presence.statut,
            'Justifiée': presence.justifiee,
            'Motif': presence.motif_justification or '',
        })
    df = pd.DataFrame(data)
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename=rapport_absences.xlsx'
    with pd.ExcelWriter(response, engine='openpyxl') as writer:
        df.to_excel(writer, index=False)
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generer_rapport_pdf(request):
    from .models import Presence, Filiere, Groupe, Seance
    filiere_id = request.GET.get('filiere')
    groupe_id = request.GET.get('groupe')
    date_debut = request.GET.get('date_debut')
    date_fin = request.GET.get('date_fin')
    seance_id = request.GET.get('seance_id')

    presences = Presence.objects.select_related('etudiant', 'seance', 'etudiant__filiere', 'etudiant__groupe')
    titre = "Rapport des Absences"
    filiere_nom = groupe_nom = seance_info = periode = None

    if seance_id:
        presences = presences.filter(seance_id=seance_id)
        seance = Seance.objects.filter(id=seance_id).first()
        seance_info = f"Séance : {seance}" if seance else None
    if filiere_id:
        presences = presences.filter(etudiant__filiere_id=filiere_id)
        filiere = Filiere.objects.filter(id=filiere_id).first()
        filiere_nom = filiere.nom_filiere if filiere else None
    if groupe_id:
        presences = presences.filter(etudiant__groupe_id=groupe_id)
        groupe = Groupe.objects.filter(id=groupe_id).first()
        groupe_nom = groupe.nom_groupe if groupe else None
    if date_debut:
        presences = presences.filter(seance__date_seance__gte=date_debut)
    if date_fin:
        presences = presences.filter(seance__date_seance__lte=date_fin)
    if date_debut or date_fin:
        periode = f"Période : {date_debut or '...'} au {date_fin or '...'}"

    data = []
    for presence in presences:
        data.append([
            f"{presence.etudiant.nom} {presence.etudiant.prenom}",
            presence.etudiant.code_apogee,
            presence.etudiant.email,
            str(presence.seance.id),
            str(presence.seance.date_seance),
            presence.statut,
            str(presence.justifiee),
            presence.motif_justification or '',
        ])

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    # Logo
    logo_path = os.path.join(os.path.dirname(__file__), 'static', 'logo_est_sala.png')
    if os.path.exists(logo_path):
        p.drawImage(ImageReader(logo_path), 40, height-100, width=80, height=80, mask='auto')
    p.setFont("Helvetica-Bold", 16)
    p.drawString(140, height-60, titre)
    y = height-120
    p.setFont("Helvetica", 12)
    if seance_info:
        p.drawString(140, y, seance_info)
        y -= 20
    if filiere_nom:
        p.drawString(140, y, f"Filière : {filiere_nom}")
        y -= 20
    if groupe_nom:
        p.drawString(140, y, f"Groupe : {groupe_nom}")
        y -= 20
    if periode:
        p.drawString(140, y, periode)
        y -= 20
    y -= 10
    # Table header
    headers = ["Étudiant", "Code Apogée", "Email", "Séance", "Date", "Statut", "Justifiée", "Motif"]
    p.setFont("Helvetica-Bold", 10)
    x = 40
    for i, h in enumerate(headers):
        p.drawString(x, y, h)
        x += 70 if i != 2 else 120
    y -= 15
    p.setFont("Helvetica", 9)
    # Table rows
    for row in data:
        x = 40
        for i, cell in enumerate(row):
            p.drawString(x, y, str(cell))
            x += 70 if i != 2 else 120
        y -= 13
        if y < 60:
            p.showPage()
            y = height-60
    p.setFont("Helvetica-Bold", 11)
    p.drawString(40, y-10, f"Total absences listées : {len(data)}")
    p.save()
    pdf = buffer.getvalue()
    buffer.close()
    response = HttpResponse(pdf, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename=rapport_absences.pdf'
    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def enseignant_seances(request):
    user = request.user
    try:
        enseignant = Enseignant.objects.get(utilisateur__nom_utilisateur=user.username)
    except Enseignant.DoesNotExist:
        return Response([], status=200)
    seances = Seance.objects.filter(enseignant=enseignant)
    data = SeanceSerializer(seances, many=True).data
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def etudiants_par_element(request, element_id):
    from .models import Etudiant
    etudiants = Etudiant.objects.filter(inscriptions__element_id=element_id).distinct()
    from .serializers import EtudiantSerializer
    data = EtudiantSerializer(etudiants, many=True).data
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def enregistrer_pointage(request):
    """
    Attend un payload :
    {
      "seance_id": 12,
      "presences": [
        {"etudiant_id": 1, "statut": "present"},
        {"etudiant_id": 2, "statut": "absent"},
        ...
      ]
    }
    """
    from .models import Seance, Etudiant, Presence
    seance_id = request.data.get('seance_id')
    presences = request.data.get('presences', [])
    if not seance_id or not presences:
        return Response({'detail': 'seance_id et presences requis'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        seance = Seance.objects.get(id=seance_id)
    except Seance.DoesNotExist:
        return Response({'detail': 'Séance introuvable'}, status=status.HTTP_404_NOT_FOUND)
    created = []
    for p in presences:
        etu_id = p.get('etudiant_id')
        statut = p.get('statut')
        if not etu_id or statut not in ['present', 'absent']:
            continue
        etu = Etudiant.objects.filter(id=etu_id).first()
        if not etu:
            continue
        # On évite les doublons
        obj, created_obj = Presence.objects.get_or_create(
            seance=seance, etudiant=etu,
            defaults={'statut': statut}
        )
        if not created_obj:
            obj.statut = statut
            obj.save()
        created.append({'etudiant_id': etu_id, 'statut': statut})
    return Response({'saved': created}, status=status.HTTP_201_CREATED)
