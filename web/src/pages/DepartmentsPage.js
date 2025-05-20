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

function DepartmentsPage() {
  const [departements, setDepartements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom_departement: '', description: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchDeps();
  }, []);

  const fetchDeps = () => {
    api.get('departements/')
      .then(res => setDepartements(res.data));
  };

  const openAdd = () => {
    setForm({ nom_departement: '', description: '' });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (dep) => {
    setForm({ nom_departement: dep.nom_departement, description: dep.description });
    setSelected(dep);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEdit && selected) {
      api.put(`departements/${selected.id}/`, form)
        .then(() => { setModalOpen(false); fetchDeps(); setFeedback('Département modifié !'); setTimeout(()=>setFeedback(''),2000); });
    } else {
      api.post('departements/', form)
        .then(() => { setModalOpen(false); fetchDeps(); setFeedback('Département ajouté !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleDelete = (dep) => {
    if(window.confirm('Supprimer ce département ?')) {
      api.delete(`departements/${dep.id}/`).then(() => { fetchDeps(); setFeedback('Département supprimé !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  return (
    <div style={{padding:'2em'}}>
      <h2>Départements</h2>
      <button onClick={openAdd} style={{marginBottom:'1em'}}>+ Ajouter</button>
      {feedback && <div style={{color:'#1aaf5d',marginBottom:'1em'}}>{feedback}</div>}
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f6fa'}}>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Nom</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Description</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {departements.map(dep => (
            <tr key={dep.id}>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{dep.nom_departement}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{dep.description}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>
                <button onClick={()=>openEdit(dep)}>Éditer</button>
                <button onClick={()=>handleDelete(dep)} style={{marginLeft:'0.5em',color:'#e53935'}}>Supprimer</button>
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
              <h2>{isEdit ? 'Éditer' : 'Ajouter'} un département</h2>
              <label>Nom
                <input name="nom_departement" value={form.nom_departement} onChange={handleChange} required />
              </label>
              <label>Description
                <input name="description" value={form.description} onChange={handleChange} />
              </label>
              <button type="submit">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DepartmentsPage; 