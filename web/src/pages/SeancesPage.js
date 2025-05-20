import React, { useEffect, useState } from 'react';
import api from '../api';
import GroupesPage from './GroupesPage';

function SeancesPage() {
  const [seances, setSeances] = useState([]);
  const [elements, setElements] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    date_seance: '',
    heure_debut: '',
    heure_fin: '',
    type_seance: '',
    salle: '',
    element: '',
    enseignant: ''
  });
  const [feedback, setFeedback] = useState('');
  const [filters, setFilters] = useState({ date: '', enseignant: '', groupe: '' });

  useEffect(() => {
    fetchSeances();
    api.get('elements/').then(res => setElements(res.data));
    api.get('enseignants/').then(res => setEnseignants(res.data));
    api.get('groupes/').then(res => setGroupes(res.data));
  }, []);

  const fetchSeances = () => {
    api.get('seances/').then(res => setSeances(res.data));
  };

  const openAdd = () => {
    setForm({ date_seance: '', heure_debut: '', heure_fin: '', type_seance: '', salle: '', element: '', enseignant: '' });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setForm({ ...s, element: s.element?.id || s.element, enseignant: s.enseignant?.id || s.enseignant });
    setSelected(s);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEdit && selected) {
      api.put(`seances/${selected.id}/`, form)
        .then(() => { setModalOpen(false); fetchSeances(); setFeedback('Séance modifiée !'); setTimeout(()=>setFeedback(''),2000); });
    } else {
      api.post('seances/', form)
        .then(() => { setModalOpen(false); fetchSeances(); setFeedback('Séance ajoutée !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleDelete = (s) => {
    if(window.confirm('Supprimer cette séance ?')) {
      api.delete(`seances/${s.id}/`).then(() => { fetchSeances(); setFeedback('Séance supprimée !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleFilterChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredSeances = seances.filter(s =>
    (!filters.date || s.date_seance === filters.date) &&
    (!filters.enseignant || String(s.enseignant?.id || s.enseignant) === String(filters.enseignant)) &&
    (!filters.groupe || elements.find(e => e.id === (s.element?.id || s.element))?.groupe === filters.groupe)
  );

  return (
    <div style={{padding:'2em'}}>
      <h2>Séances</h2>
      <button onClick={openAdd} style={{marginBottom:'1em'}}>+ Ajouter</button>
      {feedback && <div style={{color:'#1aaf5d',marginBottom:'1em'}}>{feedback}</div>}
      <div style={{display:'flex',gap:'1em',marginBottom:'1em'}}>
        <input type="date" name="date" value={filters.date} onChange={handleFilterChange} />
        <select name="enseignant" value={filters.enseignant} onChange={handleFilterChange}>
          <option value="">Enseignant</option>
          {enseignants.map(e => <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>)}
        </select>
        <select name="groupe" value={filters.groupe} onChange={handleFilterChange}>
          <option value="">Groupe</option>
          {groupes.map(g => <option key={g.id} value={g.id}>{g.nom_groupe}</option>)}
        </select>
      </div>
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f6fa'}}>
            <th>Date</th>
            <th>Heure début</th>
            <th>Heure fin</th>
            <th>Type</th>
            <th>Salle</th>
            <th>Élément</th>
            <th>Enseignant</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSeances.map(s => (
            <tr key={s.id}>
              <td>{s.date_seance}</td>
              <td>{s.heure_debut}</td>
              <td>{s.heure_fin}</td>
              <td>{s.type_seance}</td>
              <td>{s.salle}</td>
              <td>{elements.find(e => e.id === (s.element?.id || s.element))?.nom_element || s.element}</td>
              <td>{enseignants.find(e => e.id === (s.enseignant?.id || s.enseignant))?.nom + ' ' + enseignants.find(e => e.id === (s.enseignant?.id || s.enseignant))?.prenom}</td>
              <td>
                <button onClick={()=>openEdit(s)}>Éditer</button>
                <button onClick={()=>handleDelete(s)} style={{marginLeft:'0.5em',color:'#e53935'}}>Supprimer</button>
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
              <h2>{isEdit ? 'Éditer' : 'Ajouter'} une séance</h2>
              <label>Date
                <input name="date_seance" type="date" value={form.date_seance} onChange={handleChange} required />
              </label>
              <label>Heure début
                <input name="heure_debut" type="time" value={form.heure_debut} onChange={handleChange} required />
              </label>
              <label>Heure fin
                <input name="heure_fin" type="time" value={form.heure_fin} onChange={handleChange} required />
              </label>
              <label>Type
                <select name="type_seance" value={form.type_seance} onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  <option value="CM">Cours Magistral</option>
                  <option value="TD">Travaux Dirigés</option>
                  <option value="TP">Travaux Pratiques</option>
                </select>
              </label>
              <label>Salle
                <input name="salle" value={form.salle} onChange={handleChange} required />
              </label>
              <label>Élément
                <select name="element" value={form.element} onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  {elements.map(e => (
                    <option key={e.id} value={e.id}>{e.nom_element}</option>
                  ))}
                </select>
              </label>
              <label>Enseignant
                <select name="enseignant" value={form.enseignant} onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  {enseignants.map(e => (
                    <option key={e.id} value={e.id}>{e.nom} {e.prenom}</option>
                  ))}
                </select>
              </label>
              <button type="submit">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default SeancesPage; 