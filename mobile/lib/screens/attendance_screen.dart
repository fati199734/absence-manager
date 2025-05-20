import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'dart:html' as html;

class AttendanceScreen extends StatefulWidget {
  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  List<dynamic> etudiants = [];
  bool loading = true;
  String? error;
  String classeNom = '';
  Map<int, String?> pointage = {}; // etudiant_id: 'present' ou 'absent' ou null
  bool sending = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    final elementId = args != null ? args['elementId'] : null;
    classeNom = args != null ? (args['classeNom'] ?? '').toString() : '';
    if (elementId != null) fetchEtudiantsByElement(elementId);
  }

  void fetchEtudiantsByElement(int elementId) async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final data = await ApiService().getEtudiantsByElement(elementId);
      setState(() {
        etudiants = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
    }
  }

  void envoyerPointage() async {
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    final seanceId = args != null ? args['seanceId'] : null;
    if (seanceId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur : séance inconnue')),
      );
      return;
    }
    setState(() => sending = true);
    try {
      await ApiService().envoyerPointage(seanceId, pointage);
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Pointage envoyé avec succès !')),
      );
      setState(() => pointage.clear());
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors de l\'envoi du pointage')),
      );
    } finally {
      setState(() => sending = false);
    }
  }

  void imprimerPdf() async {
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    final seanceId = args != null ? args['seanceId'] : null;
    if (seanceId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur : séance inconnue')),
      );
      return;
    }
    try {
      final response = await ApiService().telechargerPdfSeance(seanceId);
      final blob = html.Blob([response.bodyBytes], 'application/pdf');
      final url = html.Url.createObjectUrlFromBlob(blob);
      html.window.open(url, '_blank');
      html.Url.revokeObjectUrl(url);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Erreur lors du téléchargement du PDF')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundImage: AssetImage('assets/images/avatar.png'),
                  ),
                  SizedBox(width: 12),
                  Text('Absence managment',
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 22)),
                ],
              ),
              SizedBox(height: 18),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Class : ${classeNom}',
                      style: TextStyle(fontWeight: FontWeight.bold)),
                  Text('Date: 12/12/21'),
                ],
              ),
              SizedBox(height: 18),
              Container(
                color: Colors.green[50],
                padding: EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                child: Row(
                  children: [
                    Expanded(
                        child: Text('Student Name',
                            style: TextStyle(fontWeight: FontWeight.bold))),
                    SizedBox(width: 12),
                    Text('Present'),
                    SizedBox(width: 18),
                    Text('Absent'),
                  ],
                ),
              ),
              if (loading)
                Expanded(child: Center(child: CircularProgressIndicator()))
              else if (error != null)
                Expanded(
                    child: Center(
                        child:
                            Text(error!, style: TextStyle(color: Colors.red))))
              else ...[
                Expanded(
                  child: ListView.builder(
                    itemCount: etudiants.length,
                    itemBuilder: (context, i) {
                      final etu = etudiants[i];
                      final id = etu['id'] ?? i;
                      return Container(
                        padding:
                            EdgeInsets.symmetric(vertical: 8, horizontal: 12),
                        decoration: BoxDecoration(
                          border: Border(
                              bottom: BorderSide(color: Colors.grey[300]!)),
                        ),
                        child: Row(
                          children: [
                            Expanded(child: Text(etu['nom'] ?? etu.toString())),
                            SizedBox(width: 12),
                            Checkbox(
                              value: pointage[id] == 'present',
                              onChanged: (v) {
                                setState(() {
                                  if (v == true) {
                                    pointage[id] = 'present';
                                  } else {
                                    pointage.remove(id);
                                  }
                                });
                              },
                            ),
                            SizedBox(width: 18),
                            Checkbox(
                              value: pointage[id] == 'absent',
                              onChanged: (v) {
                                setState(() {
                                  if (v == true) {
                                    pointage[id] = 'absent';
                                  } else {
                                    pointage.remove(id);
                                  }
                                });
                              },
                            ),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
              SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: sending ? null : envoyerPointage,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: sending
                      ? SizedBox(
                          width: 22,
                          height: 22,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2.5,
                          ),
                        )
                      : Text('Envoyer'),
                ),
              ),
              SizedBox(height: 12),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: imprimerPdf,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.green[700],
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    padding: EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: Text('Imprimer'),
                ),
              ),
              SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
