import React, { useState, useEffect } from 'react';
import './StudentModal.css';

export default function StudentModal({ open, onClose, student, mode = 'details', onSave, departements = [], filieres = [], groupes = [] }) {
  const [form, setForm] = useState(student || {});

  // Filtres dépendants
  const filieresFiltrees = form.departement ? filieres.filter(f => String(f.departement) === String(form.departement)) : filieres;
  const groupesFiltres = form.filiere ? groupes.filter(g => String(g.filiere) === String(form.filiere)) : groupes;

  useEffect(() => {
    setForm(student || {});
  }, [student]);

  if (!open) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    // Si on change de département, on reset filiere/groupe
    if (name === 'departement') {
      setForm(f => ({ ...f, departement: value, filiere: '', groupe: '' }));
    } else if (name === 'filiere') {
      setForm(f => ({ ...f, filiere: value, groupe: '' }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Correction : forcer l'envoi des IDs
    const departementId = departements.find(d => d.id === form.departement || d.nom_departement === form.departement)?.id || form.departement;
    const filiereId = filieres.find(f => f.id === form.filiere || f.nom_filiere === form.filiere)?.id || form.filiere;
    const groupeId = groupes.find(g => g.id === form.groupe || g.nom_groupe === form.groupe)?.id || form.groupe;

    const dataToSend = {
      ...form,
      departement: departementId,
      filiere: filiereId,
      groupe: groupeId,
    };

    if (onSave) onSave(dataToSend);
  };

  return (
    <div className="student-modal-overlay">
      <div className="student-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        {mode === 'details' ? (
          <div>
            <h2>Détails de l'étudiant</h2>
            <p><b>Apogée :</b> {student.code_apogee}</p>
            <p><b>Nom :</b> {student.nom}</p>
            <p><b>Prénom :</b> {student.prenom}</p>
            <p><b>Département :</b> {departements.find(d => String(d.id) === String(student.departement))?.nom_departement || ''}</p>
            <p><b>Filière :</b> {filieres.find(f => String(f.id) === String(student.filiere))?.nom_filiere || ''}</p>
            <p><b>Groupe :</b> {groupes.find(g => String(g.id) === String(student.groupe))?.nom_groupe || ''}</p>
            <p><b>Statut :</b> {student.statut}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="student-form">
            <h2>Éditer l'étudiant</h2>
            <label>Apogée
              <input name="code_apogee" value={form.code_apogee || ''} onChange={handleChange} required />
            </label>
            <label>Nom
              <input name="nom" value={form.nom || ''} onChange={handleChange} required />
            </label>
            <label>Prénom
              <input name="prenom" value={form.prenom || ''} onChange={handleChange} required />
            </label>
            <label>Département
              <select name="departement" value={form.departement || ''} onChange={handleChange} required>
                <option value="">Choisir...</option>
                {departements.map(d => (
                  <option key={d.id} value={d.id}>{d.nom_departement}</option>
                ))}
              </select>
            </label>
            <label>Filière
              <select name="filiere" value={form.filiere || ''} onChange={handleChange} required>
                <option value="">Choisir...</option>
                {filieresFiltrees.map(f => (
                  <option key={f.id} value={f.id}>{f.nom_filiere}</option>
                ))}
              </select>
            </label>
            <label>Groupe
              <select name="groupe" value={form.groupe || ''} onChange={handleChange}>
                <option value="">Choisir...</option>
                {groupesFiltres.map(g => (
                  <option key={g.id} value={g.id}>{g.nom_groupe}</option>
                ))}
              </select>
            </label>
            <label>Statut
              <select name="statut" value={form.statut || ''} onChange={handleChange}>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </label>
            <label>Email
              <input name="email" value={form.email || ''} onChange={handleChange} />
            </label>
            <label>Téléphone
              <input name="telephone" value={form.telephone || ''} onChange={handleChange} />
            </label>
            <label>Année
              <input name="annee" value={form.annee || ''} onChange={handleChange} />
            </label>
            <button type="submit">Enregistrer</button>
          </form>
        )}
      </div>
    </div>
  );
} 