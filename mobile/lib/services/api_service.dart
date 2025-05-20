import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:8000';
  final storage = FlutterSecureStorage();

  Future<String?> getToken() async {
    return await storage.read(key: 'access');
  }

  Future<List<dynamic>> getEnseignantClasses() async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/api/enseignant/classes/');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erreur lors de la récupération des classes');
    }
  }

  Future<List<dynamic>> getEtudiantsByClasse(int classeId) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/api/classes/$classeId/etudiants/');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erreur lors de la récupération des étudiants');
    }
  }

  Future<List<dynamic>> getEnseignantSeances() async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/api/enseignant/seances/');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Erreur lors de la récupération des séances');
    }
  }

  Future<List<dynamic>> getEtudiantsByElement(int elementId) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/api/elements/$elementId/etudiants/');
    final response = await http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception(
          'Erreur lors de la récupération des étudiants de l\'élément');
    }
  }

  Future<bool> envoyerPointage(int seanceId, Map<int, String?> pointage) async {
    final token = await getToken();
    final url = Uri.parse('$baseUrl/api/presences/enregistrer/');
    final presences = pointage.entries
        .where((e) => e.value == 'present' || e.value == 'absent')
        .map((e) => {'etudiant_id': e.key, 'statut': e.value})
        .toList();
    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        if (token != null) 'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'seance_id': seanceId,
        'presences': presences,
      }),
    );
    if (response.statusCode == 201) {
      return true;
    } else {
      throw Exception('Erreur lors de l\'envoi du pointage');
    }
  }

  Future<http.Response> telechargerPdfSeance(int seanceId) async {
    final token = await getToken();
    final url =
        Uri.parse('$baseUrl/api/rapports/generer_pdf/?seance_id=$seanceId');
    final response = await http.get(
      url,
      headers: {
        if (token != null) 'Authorization': 'Bearer $token',
      },
    );
    if (response.statusCode == 200) {
      return response;
    } else {
      throw Exception('Erreur lors du téléchargement du PDF');
    }
  }
}
