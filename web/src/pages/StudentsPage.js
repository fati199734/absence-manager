import React, { useEffect, useState } from 'react';
import api from '../api';
import '../styles/StudentsPage.css';
import StudentModal from '../components/StudentModal';

function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [filtreDept, setFiltreDept] = useState('');
  const [filtreFiliere, setFiltreFiliere] = useState('');
  const [filtreGroupe, setFiltreGroupe] = useState('');

  // Listes dynamiques
  const [departements, setDepartements] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);

  // Modale détails/édition
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('details'); // 'details' ou 'edit'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Modale suppression
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  useEffect(() => {
    api.get('etudiants/')
      .then(res => setStudents(res.data))
      .catch(() => setStudents([]));
    api.get('departements/')
      .then(res => setDepartements(res.data));
    api.get('filieres/')
      .then(res => setFilieres(res.data));
    api.get('groupes/')
      .then(res => setGroupes(res.data));
  }, []);

  // Filtres dépendants
  const filieresFiltrees = filtreDept
    ? filieres.filter(f => String(f.departement) === String(filtreDept))
    : filieres;

  const groupesFiltres = filtreFiliere
    ? groupes.filter(g => String(g.filiere) === String(filtreFiliere))
    : groupes;

  const handleShowDetails = (student) => {
    setSelectedStudent(student);
    setModalMode('details');
    setModalOpen(true);
    setIsAdd(false);
  };

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setModalMode('edit');
    setModalOpen(true);
    setIsAdd(false);
  };

  const handleAdd = () => {
    setSelectedStudent({
      code_apogee: '', nom: '', prenom: '', departement: '', filiere: '', groupe: '', statut: 'actif', email: '', telephone: '', annee: ''
    });
    setModalMode('edit');
    setModalOpen(true);
    setIsAdd(true);
  };

  const handleSave = (studentData) => {
    console.log('Données envoyées à l\'API :', studentData);
    if (isAdd) {
      api.post('etudiants/', studentData)
        .then(res => {
          setStudents([...students, res.data]);
          setModalOpen(false);
          setFeedback('Étudiant ajouté avec succès !');
          setTimeout(() => setFeedback(''), 2000);
        })
        .catch((error) => {
          console.log('Erreur API :', error.response?.data || error.message);
          setFeedback("Erreur lors de l'ajout.");
          setTimeout(() => setFeedback(''), 2000);
        });
    } else {
      api.put(`etudiants/${studentData.id}/`, studentData)
        .then(res => {
          setStudents(students.map(s => s.id === studentData.id ? res.data : s));
          setModalOpen(false);
          setFeedback('Étudiant modifié avec succès !');
          setTimeout(() => setFeedback(''), 2000);
        })
        .catch((error) => {
          console.log('Erreur API :', error.response?.data || error.message);
          setFeedback("Erreur lors de la modification.");
          setTimeout(() => setFeedback(''), 2000);
        });
    }
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    api.delete(`etudiants/${studentToDelete.id}/`)
      .then(() => {
        setStudents(students.filter(s => s.id !== studentToDelete.id));
        setDeleteModalOpen(false);
      });
  };

  // Filtres et recherche (simple)
  const filtered = students.filter(s =>
    (!search || s.nom.toLowerCase().includes(search.toLowerCase()) || s.prenom.toLowerCase().includes(search.toLowerCase()) || s.code_apogee.includes(search)) &&
    (!filtreDept ||
      String(
        filieres.find(f => (f.id === (s.filiere?.id || s.filiere)))?.departement
      ) === String(filtreDept)
    ) &&
    (!filtreFiliere || String(s.filiere?.id || s.filiere) === String(filtreFiliere)) &&
    (!filtreGroupe || String(s.groupe?.id || s.groupe) === String(filtreGroupe))
  );

  return (
    <div className="students-page">
      <div className="students-header">
        <h2>Étudiants</h2>
        <button className="btn-ajouter" onClick={handleAdd}>+ Ajouter un étudiant</button>
      </div>
      <div className="students-filtres">
        <input
          type="text"
          placeholder="Rechercher par nom, prénom ou apogée..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select value={filtreDept} onChange={e => {setFiltreDept(e.target.value); setFiltreFiliere(''); setFiltreGroupe('');}}>
          <option value="">Département</option>
          {departements.map(d => (
            <option key={d.id} value={d.id}>{d.nom_departement}</option>
          ))}
        </select>
        <select value={filtreFiliere} onChange={e => {setFiltreFiliere(e.target.value); setFiltreGroupe('');}}>
          <option value="">Filière</option>
          {filieresFiltrees.map(f => (
            <option key={f.id} value={f.id}>{f.nom_filiere}</option>
          ))}
        </select>
        <select value={filtreGroupe} onChange={e => setFiltreGroupe(e.target.value)}>
          <option value="">Groupe</option>
          {groupesFiltres.map(g => (
            <option key={g.id} value={g.id}>{g.nom_groupe}</option>
          ))}
        </select>
      </div>
      <div className="students-table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Apogée</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id}>
                <td>{i + 1}</td>
                <td>{s.code_apogee}</td>
                <td>{s.nom}</td>
                <td>{s.prenom}</td>
                <td><span className={s.statut === 'actif' ? 'statut-actif' : 'statut-inactif'}>{s.statut === 'actif' ? 'Actif' : 'Inactif'}</span></td>
                <td>
                  <button className="btn-action" onClick={() => handleShowDetails(s)}>Détails</button>
                  <button className="btn-action" onClick={() => handleEdit(s)}>Éditer</button>
                  <button className="btn-action btn-supprimer" onClick={() => handleDelete(s)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination à ajouter si besoin */}
      {/* Modale détails/édition */}
      <StudentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        student={selectedStudent}
        mode={modalMode}
        onSave={handleSave}
        departements={departements}
        filieres={filieres}
        groupes={groupes}
      />
      {feedback && <div style={{margin:'1em 0', color:'#1aaf5d', fontWeight:600}}>{feedback}</div>}
      {/* Modale de confirmation suppression */}
      {deleteModalOpen && (
        <div className="student-modal-overlay">
          <div className="student-modal">
            <p>Voulez-vous vraiment supprimer cet étudiant ?</p>
            <div style={{display:'flex',gap:'1em',justifyContent:'flex-end'}}>
              <button onClick={() => setDeleteModalOpen(false)}>Annuler</button>
              <button className="btn-supprimer" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsPage; 