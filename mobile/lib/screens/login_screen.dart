import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../services/auth_service.dart';

class LoginScreen extends StatefulWidget {
  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  String email = '';
  String password = '';
  bool obscure = true;
  bool loading = false;
  String? error;
  final storage = FlutterSecureStorage();

  void _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      loading = true;
      error = null;
    });
    try {
      final tokens = await AuthService.login(email, password);
      await storage.write(key: 'access', value: tokens['access']);
      await storage.write(key: 'refresh', value: tokens['refresh']);
      setState(() => loading = false);
      Navigator.pushReplacementNamed(context, '/home');
    } catch (e) {
      setState(() {
        loading = false;
        error = e.toString().replaceFirst('Exception: ', '');
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 32),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Image.asset('assets/images/logo.png', width: 90),
                  ],
                ),
                SizedBox(height: 32),
                Text('Log in',
                    style: GoogleFonts.montserrat(
                        fontSize: 28, fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                Text('Enter your emails and password',
                    style: GoogleFonts.montserrat(
                        color: Colors.grey[700], fontSize: 15)),
                SizedBox(height: 32),
                if (error != null) ...[
                  Text(error!, style: TextStyle(color: Colors.red)),
                  SizedBox(height: 12),
                ],
                Form(
                  key: _formKey,
                  child: Column(
                    children: [
                      TextFormField(
                        decoration: InputDecoration(
                          labelText: 'Email',
                          labelStyle: GoogleFonts.montserrat(
                              fontWeight: FontWeight.bold),
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 16),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12)),
                        ),
                        keyboardType: TextInputType.text,
                        onChanged: (v) => email = v,
                        validator: (v) => v != null && v.isNotEmpty
                            ? null
                            : 'Champ obligatoire',
                      ),
                      SizedBox(height: 18),
                      TextFormField(
                        decoration: InputDecoration(
                          labelText: 'Password',
                          labelStyle: GoogleFonts.montserrat(
                              fontWeight: FontWeight.bold),
                          contentPadding: EdgeInsets.symmetric(
                              horizontal: 16, vertical: 16),
                          border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(12)),
                          suffixIcon: IconButton(
                            icon: Icon(obscure
                                ? Icons.visibility_off
                                : Icons.visibility),
                            onPressed: () => setState(() => obscure = !obscure),
                          ),
                        ),
                        obscureText: obscure,
                        onChanged: (v) => password = v,
                        validator: (v) => v != null && v.length >= 6
                            ? null
                            : 'Mot de passe trop court',
                      ),
                      SizedBox(height: 8),
                      Align(
                        alignment: Alignment.centerRight,
                        child: TextButton(
                          onPressed: () {},
                          child: Text('Forgot Password?',
                              style: GoogleFonts.montserrat(
                                  color: Colors.grey[700])),
                        ),
                      ),
                      SizedBox(height: 18),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: loading ? null : _login,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Color(0xFF4CAF50),
                            padding: EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16)),
                            textStyle: GoogleFonts.montserrat(
                                fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          child: loading
                              ? CircularProgressIndicator(color: Colors.white)
                              : Text('Log In'),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
