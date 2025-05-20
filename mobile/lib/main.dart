import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/splash_screen.dart';
import 'screens/login_screen.dart';
import 'screens/home_screen.dart';
import 'screens/teacher_home_screen.dart';
import 'screens/class_dashboard_screen.dart';
import 'screens/attendance_screen.dart';
import 'screens/reports_screen.dart';
import 'screens/teacher_profile_screen.dart';
import 'screens/student_detail_screen.dart';
import 'screens/justify_absence_screen.dart';
import 'screens/settings_screen.dart';

void main() {
  runApp(AbsenceManagerApp());
}

class AbsenceManagerApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Absence Manager',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Color(0xFF4CAF50),
        scaffoldBackgroundColor: Colors.white,
        textTheme: GoogleFonts.montserratTextTheme(),
        colorScheme: ColorScheme.fromSwatch().copyWith(
          primary: Color(0xFF4CAF50),
          secondary: Color(0xFF388E3C),
        ),
        inputDecorationTheme: InputDecorationTheme(
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: Color(0xFF4CAF50),
            shape:
                RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            textStyle: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
        ),
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => SplashScreen(),
        '/login': (context) => LoginScreen(),
        '/home': (context) => TeacherHomeScreen(),
        '/class-dashboard': (context) => ClassDashboardScreen(),
        '/attendance': (context) => AttendanceScreen(),
        '/reports': (context) => ReportsScreen(),
        '/profile': (context) => TeacherProfileScreen(),
        '/student-detail': (context) => StudentDetailScreen(),
        '/justify-absence': (context) => JustifyAbsenceScreen(),
        '/settings': (context) => SettingsScreen(),
      },
    );
  }
}
