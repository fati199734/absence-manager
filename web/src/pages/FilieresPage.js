import React, { useEffect, useState } from 'react';
import api from '../api';

// Interceptor pour ajouter le token JWT à chaque requête
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }
    return config;
  },
  error => Promise.reject(error)
);

function FilieresPage() {
  const [filieres, setFilieres] = useState([]);
  const [departements, setDepartements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom_filiere: '', description: '', annee_academique: '', departement: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchFilieres();
    api.get('departements/')
      .then(res => setDepartements(res.data));
  }, []);

  const fetchFilieres = () => {
    api.get('filieres/')
      .then(res => setFilieres(res.data));
  };

  const openAdd = () => {
    setForm({ nom_filiere: '', description: '', annee_academique: '', departement: '' });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (f) => {
    setForm({ nom_filiere: f.nom_filiere, description: f.description, annee_academique: f.annee_academique, departement: f.departement });
    setSelected(f);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEdit && selected) {
      api.put(`filieres/${selected.id}/`, form)
        .then(() => { setModalOpen(false); fetchFilieres(); setFeedback('Filière modifiée !'); setTimeout(()=>setFeedback(''),2000); });
    } else {
      api.post('filieres/', form)
        .then(() => { setModalOpen(false); fetchFilieres(); setFeedback('Filière ajoutée !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleDelete = (f) => {
    if(window.confirm('Supprimer cette filière ?')) {
      api.delete(`filieres/${f.id}/`).then(() => { fetchFilieres(); setFeedback('Filière supprimée !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  return (
    <div style={{padding:'2em'}}>
      <h2>Filières</h2>
      <button onClick={openAdd} style={{marginBottom:'1em'}}>+ Ajouter</button>
      {feedback && <div style={{color:'#1aaf5d',marginBottom:'1em'}}>{feedback}</div>}
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f6fa'}}>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Nom</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Description</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Année</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Département</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filieres.map(f => (
            <tr key={f.id}>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{f.nom_filiere}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{f.description}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{f.annee_academique}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{departements.find(d => d.id === f.departement)?.nom_departement || f.departement}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>
                <button onClick={()=>openEdit(f)}>Éditer</button>
                <button onClick={()=>handleDelete(f)} style={{marginLeft:'0.5em',color:'#e53935'}}>Supprimer</button>
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
              <h2>{isEdit ? 'Éditer' : 'Ajouter'} une filière</h2>
              <label>Nom
                <input name="nom_filiere" value={form.nom_filiere} onChange={handleChange} required />
              </label>
              <label>Description
                <input name="description" value={form.description} onChange={handleChange} />
              </label>
              <label>Année académique
                <input name="annee_academique" value={form.annee_academique} onChange={handleChange} required />
              </label>
              <label>Département
                <select name="departement" value={form.departement} onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  {departements.map(d => (
                    <option key={d.id} value={d.id}>{d.nom_departement}</option>
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

export default FilieresPage; 