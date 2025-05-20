import 'package:flutter/material.dart';

class TeacherProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CircleAvatar(
                radius: 48,
                backgroundImage: AssetImage('assets/images/avatar.png'),
              ),
              SizedBox(height: 18),
              Text('Prof.Adam Elamrani',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 22)),
              SizedBox(height: 6),
              Text('adanelamrianium5estsale@gmail.com',
                  style: TextStyle(color: Colors.grey[700])),
              SizedBox(height: 24),
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('Matière enseignée\nUX UI DESIGN',
                    style: TextStyle(fontSize: 16)),
              ),
              SizedBox(height: 14),
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.green[50],
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Text('Department\nInformatique',
                    style: TextStyle(fontSize: 16)),
              ),
              SizedBox(height: 24),
              ElevatedButton(
                onPressed: () {},
                style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.red,
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12))),
                child: Text('Modifier'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
