import React, { useEffect, useState } from 'react';
import api from '../api';

function AbsencesPage() {
  const [absences, setAbsences] = useState([]);
  const [students, setStudents] = useState([]);
  const [seances, setSeances] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [filters, setFilters] = useState({ etudiant: '', seance: '', filiere: '', groupe: '', statut: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ justification: '', statut: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchAbsences();
    api.get('etudiants/').then(res => setStudents(res.data));
    api.get('seances/').then(res => setSeances(res.data));
    api.get('filieres/').then(res => setFilieres(res.data));
    api.get('groupes/').then(res => setGroupes(res.data));
  }, []);

  const fetchAbsences = () => {
    api.get('presences/')
      .then(res => setAbsences(res.data));
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredAbsences = absences.filter(a =>
    (!filters.etudiant || a.etudiant === filters.etudiant) &&
    (!filters.seance || a.seance === filters.seance) &&
    (!filters.filiere || a.filiere === filters.filiere) &&
    (!filters.groupe || a.groupe === filters.groupe) &&
    (!filters.statut || a.statut === filters.statut)
  );

  const openEdit = (a) => {
    setForm({ justification: a.justification || '', statut: a.statut });
    setSelected(a);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEdit && selected) {
      api.put(`presences/${selected.id}/`, { ...selected, ...form })
        .then(() => { setModalOpen(false); fetchAbsences(); setFeedback('Absence modifiée !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleDelete = (a) => {
    if(window.confirm('Supprimer cette absence ?')) {
      api.delete(`presences/${a.id}/`).then(() => { fetchAbsences(); setFeedback('Absence supprimée !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  return (
    <div style={{padding:'2em'}}>
      <h2>Absences</h2>
      {feedback && <div style={{color:'#1aaf5d',marginBottom:'1em'}}>{feedback}</div>}
      <div style={{display:'flex',gap:'1em',marginBottom:'1em'}}>
        <select name="etudiant" value={filters.etudiant} onChange={handleFilterChange}>
          <option value="">Étudiant</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.nom} {s.prenom}</option>)}
        </select>
        <select name="seance" value={filters.seance} onChange={handleFilterChange}>
          <option value="">Séance</option>
          {seances.map(s => <option key={s.id} value={s.id}>{s.date_seance}</option>)}
        </select>
        <select name="filiere" value={filters.filiere} onChange={handleFilterChange}>
          <option value="">Filière</option>
          {filieres.map(f => <option key={f.id} value={f.id}>{f.nom_filiere}</option>)}
        </select>
        <select name="groupe" value={filters.groupe} onChange={handleFilterChange}>
          <option value="">Groupe</option>
          {groupes.map(g => <option key={g.id} value={g.id}>{g.nom_groupe}</option>)}
        </select>
        <select name="statut" value={filters.statut} onChange={handleFilterChange}>
          <option value="">Statut</option>
          <option value="absent">Absent</option>
          <option value="present">Présent</option>
        </select>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f6fa'}}>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Étudiant</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Séance</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Filière</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Groupe</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Statut</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Justification</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAbsences.map(a => (
            <tr key={a.id}>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{students.find(s => s.id === a.etudiant)?.nom} {students.find(s => s.id === a.etudiant)?.prenom}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{seances.find(s => s.id === a.seance)?.date_seance}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{filieres.find(f => f.id === a.filiere)?.nom_filiere}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{groupes.find(g => g.id === a.groupe)?.nom_groupe}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{a.statut}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{a.justification}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>
                <button onClick={()=>openEdit(a)}>Éditer</button>
                <button onClick={()=>handleDelete(a)} style={{marginLeft:'0.5em',color:'#e53935'}}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <div className="student-modal-overlay">
          <div className="student-modal">
            <button className="modal-close" onClick={()=>setModalOpen(false)}>×</button>
            <form onSubmit={handleSubmit} className="student-form">
              <h2>Justifier / Modifier l'absence</h2>
              <label>Statut
                <select name="statut" value={form.statut} onChange={handleChange} required>
                  <option value="absent">Absent</option>
                  <option value="present">Présent</option>
                </select>
              </label>
              <label>Justification
                <input name="justification" value={form.justification} onChange={handleChange} />
              </label>
              <button type="submit">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AbsencesPage; 