import 'package:flutter/material.dart';

class ClassDashboardScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final args = ModalRoute.of(context)?.settings.arguments as Map?;
    final classeId = args != null ? args['classeId'] : null;
    final classeNom = args != null ? args['classeNom'] : '';
    final elementId = args != null ? args['elementId'] : null;
    final seanceId = args != null ? args['seanceId'] : null;
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
              SizedBox(height: 24),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                decoration: BoxDecoration(
                  color: Colors.grey[200],
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Text('Licence IAWM', style: TextStyle(fontSize: 16)),
              ),
              SizedBox(height: 24),
              Expanded(
                child: GridView.count(
                  crossAxisCount: 2,
                  mainAxisSpacing: 18,
                  crossAxisSpacing: 18,
                  children: [
                    _DashboardButton(
                        icon: Icons.people,
                        label: 'Liste',
                        onTap: () => Navigator.pushNamed(
                              context,
                              '/attendance',
                              arguments: {
                                'seanceId': seanceId,
                                'elementId': elementId,
                                'classeNom': classeNom,
                              },
                            )),
                    _DashboardButton(
                        icon: Icons.warning_amber_rounded,
                        label: 'Alerts',
                        onTap: () {}),
                    _DashboardButton(
                        icon: Icons.event_busy,
                        label: 'Absences today',
                        onTap: () {}),
                    _DashboardButton(
                        icon: Icons.calendar_month,
                        label: 'Timetable',
                        onTap: () {}),
                    _DashboardButton(
                        icon: Icons.insert_chart,
                        label: 'Reports',
                        onTap: () => Navigator.pushNamed(context, '/reports')),
                    _DashboardButton(
                        icon: Icons.settings,
                        label: 'Settings',
                        onTap: () => Navigator.pushNamed(context, '/settings')),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DashboardButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _DashboardButton(
      {required this.icon, required this.label, required this.onTap});
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.white,
        foregroundColor: Colors.black,
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
        padding: EdgeInsets.symmetric(vertical: 18),
      ),
      onPressed: onTap,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 38),
          SizedBox(height: 12),
          Text(label, style: TextStyle(fontSize: 16)),
        ],
      ),
    );
  }
}
