import 'package:flutter/material.dart';
import '../services/api_service.dart';

class TeacherHomeScreen extends StatefulWidget {
  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen> {
  List<dynamic> seances = [];
  bool loading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    fetchSeances();
  }

  void fetchSeances() async {
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final data = await ApiService().getEnseignantSeances();
      setState(() {
        seances = data;
        loading = false;
      });
    } catch (e) {
      setState(() {
        error = e.toString();
        loading = false;
      });
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
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Welcome@username',
                          style: TextStyle(
                              fontWeight: FontWeight.bold, fontSize: 22)),
                      SizedBox(height: 4),
                      Text('Avril 23, 2025', style: TextStyle(fontSize: 16)),
                    ],
                  ),
                ],
              ),
              SizedBox(height: 28),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Mes séances', style: TextStyle(fontSize: 16)),
                    Icon(Icons.keyboard_arrow_down_rounded),
                  ],
                ),
              ),
              SizedBox(height: 18),
              if (loading)
                Center(child: CircularProgressIndicator())
              else if (error != null)
                Text(error!, style: TextStyle(color: Colors.red))
              else ...[
                for (var s in seances) ...[
                  Card(
                    elevation: 2,
                    child: ListTile(
                      title: Text('${s['date_seance']} - ${s['element']}'),
                      subtitle: Text(
                          'Salle: ${s['salle']} | ${s['heure_debut']} - ${s['heure_fin']}'),
                      onTap: () => Navigator.pushNamed(
                        context,
                        '/class-dashboard',
                        arguments: {
                          'seanceId': s['id'],
                          'seanceDate': s['date_seance'],
                          'elementId': s['element'],
                        },
                      ),
                    ),
                  ),
                  SizedBox(height: 10),
                ]
              ],
            ],
          ),
        ),
      ),
    );
  }
}
