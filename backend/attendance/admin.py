from django.contrib import admin
from .models import (
    Departement, Filiere, Groupe, Utilisateur, Enseignant, Etudiant, Module, ElementModule,
    InscriptionElement, Seance, SessionQR, Presence, RapportPresence, NotificationEmail
)

admin.site.register(Departement)
admin.site.register(Filiere)
admin.site.register(Groupe)
admin.site.register(Utilisateur)
admin.site.register(Enseignant)
admin.site.register(Etudiant)
admin.site.register(Module)
admin.site.register(ElementModule)
admin.site.register(InscriptionElement)
admin.site.register(Seance)
admin.site.register(SessionQR)
admin.site.register(Presence)
admin.site.register(RapportPresence)
admin.site.register(NotificationEmail)
