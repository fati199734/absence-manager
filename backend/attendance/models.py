from django.db import models

# Create your models here.

class Departement(models.Model):
    nom_departement = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.nom_departement

class Filiere(models.Model):
    nom_filiere = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    annee_academique = models.CharField(max_length=20)
    departement = models.ForeignKey(Departement, on_delete=models.CASCADE, related_name='filieres')

    def __str__(self):
        return self.nom_filiere

class Groupe(models.Model):
    nom_groupe = models.CharField(max_length=50)
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, related_name='groupes')

    def __str__(self):
        return self.nom_groupe

class Utilisateur(models.Model):
    TYPE_UTILISATEUR = [
        ('admin', 'Admin'),
        ('enseignant', 'Enseignant'),
    ]
    nom_utilisateur = models.CharField(max_length=50, unique=True)
    mot_de_passe_hash = models.CharField(max_length=255)
    email = models.EmailField(max_length=100, unique=True)
    type_utilisateur = models.CharField(max_length=10, choices=TYPE_UTILISATEUR)

    def __str__(self):
        return self.nom_utilisateur

class Enseignant(models.Model):
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    telephone = models.CharField(max_length=20)
    specialite = models.CharField(max_length=100)
    utilisateur = models.OneToOneField(Utilisateur, on_delete=models.CASCADE, related_name='enseignant')

    def __str__(self):
        return f"{self.nom} {self.prenom}"

class Etudiant(models.Model):
    code_apogee = models.CharField(max_length=20, unique=True)
    nom = models.CharField(max_length=50)
    prenom = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    telephone = models.CharField(max_length=20)
    annee = models.IntegerField()
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, related_name='etudiants')
    groupe = models.ForeignKey(Groupe, on_delete=models.CASCADE, related_name='etudiants', null=True, blank=True)

    def __str__(self):
        return f"{self.nom} {self.prenom}"

class Module(models.Model):
    code_module = models.CharField(max_length=20)
    nom_module = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    coefficient = models.DecimalField(max_digits=4, decimal_places=2)
    semestre = models.IntegerField()
    filiere = models.ForeignKey(Filiere, on_delete=models.CASCADE, related_name='modules', null=True, blank=True)

    def __str__(self):
        return self.nom_module

class ElementModule(models.Model):
    nom_element = models.CharField(max_length=100)
    coefficient = models.DecimalField(max_digits=4, decimal_places=2)
    volume_horaire = models.IntegerField()
    semestre = models.IntegerField()
    module = models.ForeignKey(Module, on_delete=models.CASCADE, related_name='elements')
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='elements')

    def __str__(self):
        return self.nom_element

class InscriptionElement(models.Model):
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='inscriptions')
    element = models.ForeignKey(ElementModule, on_delete=models.CASCADE, related_name='inscriptions')
    date_inscription = models.DateField()

    def __str__(self):
        return f"{self.etudiant} - {self.element}"

class Seance(models.Model):
    TYPE_SEANCE = [
        ('CM', 'Cours Magistral'),
        ('TD', 'Travaux Dirigés'),
        ('TP', 'Travaux Pratiques'),
    ]
    date_seance = models.DateField()
    heure_debut = models.TimeField()
    heure_fin = models.TimeField()
    type_seance = models.CharField(max_length=2, choices=TYPE_SEANCE)
    salle = models.CharField(max_length=50)
    element = models.ForeignKey(ElementModule, on_delete=models.CASCADE, related_name='seances')
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='seances')

    def __str__(self):
        return f"{self.date_seance} - {self.element}"

class SessionQR(models.Model):
    code_qr = models.CharField(max_length=255)
    url_session = models.CharField(max_length=255)
    timestamp_creation = models.DateTimeField(auto_now_add=True)
    timestamp_expiration = models.DateTimeField()
    actif = models.BooleanField(default=True)
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE, related_name='sessions_qr')
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='sessions_qr')

    def __str__(self):
        return f"QR {self.seance} - {self.code_qr}"

class Presence(models.Model):
    STATUT = [
        ('present', 'Présent'),
        ('absent', 'Absent'),
        ('non_verifie', 'Non Vérifié'),
    ]
    timestamp_marquage = models.DateTimeField(auto_now_add=True)
    statut = models.CharField(max_length=15, choices=STATUT)
    justifiee = models.BooleanField(default=False)
    motif_justification = models.TextField(blank=True, null=True)
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='presences')
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE, related_name='presences')
    session_qr = models.ForeignKey(SessionQR, on_delete=models.SET_NULL, null=True, blank=True, related_name='presences')

    def __str__(self):
        return f"{self.etudiant} - {self.seance} - {self.statut}"

class RapportPresence(models.Model):
    date_generation = models.DateTimeField(auto_now_add=True)
    chemin_fichier = models.CharField(max_length=255)
    envoye = models.BooleanField(default=False)
    enseignant = models.ForeignKey(Enseignant, on_delete=models.CASCADE, related_name='rapports')
    element = models.ForeignKey(ElementModule, on_delete=models.CASCADE, related_name='rapports')
    seance = models.ForeignKey(Seance, on_delete=models.CASCADE, related_name='rapports')

    def __str__(self):
        return f"Rapport {self.seance} - {self.enseignant}"

class NotificationEmail(models.Model):
    TYPE_NOTIFICATION = [
        ('absence', 'Absence'),
        ('rappel', 'Rappel'),
    ]
    STATUT_ENVOI = [
        ('envoye', 'Envoyé'),
        ('echec', 'Échec'),
        ('en_attente', 'En attente'),
    ]
    date_envoi = models.DateTimeField(auto_now_add=True)
    type_notification = models.CharField(max_length=10, choices=TYPE_NOTIFICATION)
    statut_envoi = models.CharField(max_length=10, choices=STATUT_ENVOI)
    etudiant = models.ForeignKey(Etudiant, on_delete=models.CASCADE, related_name='notifications')
    presence = models.ForeignKey(Presence, on_delete=models.CASCADE, related_name='notifications')

    def __str__(self):
        return f"{self.type_notification} - {self.etudiant} - {self.statut_envoi}"
