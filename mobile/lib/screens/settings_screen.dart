import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Settings',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 26)),
              SizedBox(height: 32),
              ListTile(
                title: Text('Change password'),
                trailing: Icon(Icons.chevron_right),
                onTap: () {},
              ),
              Divider(),
              ListTile(
                title: Text('Log out'),
                trailing: Icon(Icons.chevron_right),
                onTap: () {},
              ),
            ],
          ),
        ),
      ),
    );
  }
}
