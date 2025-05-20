from rest_framework import serializers
from .models import (
    Departement, Filiere, Groupe, Utilisateur, Enseignant, Etudiant, Module, ElementModule,
    InscriptionElement, Seance, SessionQR, Presence, RapportPresence, NotificationEmail
)

class DepartementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Departement
        fields = '__all__'

class FiliereSerializer(serializers.ModelSerializer):
    class Meta:
        model = Filiere
        fields = '__all__'

class GroupeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groupe
        fields = '__all__'

class UtilisateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Utilisateur
        fields = '__all__'

class EnseignantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Enseignant
        fields = '__all__'

class EtudiantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Etudiant
        fields = '__all__'

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'

class ElementModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ElementModule
        fields = '__all__'

class InscriptionElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InscriptionElement
        fields = '__all__'

class SeanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seance
        fields = '__all__'

class SessionQRSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionQR
        fields = '__all__'

class PresenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presence
        fields = '__all__'

class RapportPresenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RapportPresence
        fields = '__all__'

class NotificationEmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationEmail
        fields = '__all__' 