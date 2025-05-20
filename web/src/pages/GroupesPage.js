import React, { useEffect, useState } from 'react';
import api from '../api';

function GroupesPage() {
  const [groupes, setGroupes] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom_groupe: '', filiere: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchGroupes();
    api.get('filieres/')
      .then(res => setFilieres(res.data));
  }, []);

  const fetchGroupes = () => {
    api.get('groupes/')
      .then(res => setGroupes(res.data));
  };

  const openAdd = () => {
    setForm({ nom_groupe: '', filiere: '' });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (g) => {
    setForm({ nom_groupe: g.nom_groupe, filiere: g.filiere });
    setSelected(g);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEdit && selected) {
      api.put(`groupes/${selected.id}/`, form)
        .then(() => { setModalOpen(false); fetchGroupes(); setFeedback('Groupe modifié !'); setTimeout(()=>setFeedback(''),2000); });
    } else {
      api.post('groupes/', form)
        .then(() => { setModalOpen(false); fetchGroupes(); setFeedback('Groupe ajouté !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleDelete = (g) => {
    if(window.confirm('Supprimer ce groupe ?')) {
      api.delete(`groupes/${g.id}/`).then(() => { fetchGroupes(); setFeedback('Groupe supprimé !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  return (
    <div style={{padding:'2em'}}>
      <h2>Groupes</h2>
      <button onClick={openAdd} style={{marginBottom:'1em'}}>+ Ajouter</button>
      {feedback && <div style={{color:'#1aaf5d',marginBottom:'1em'}}>{feedback}</div>}
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f6fa'}}>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Nom</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Filière</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {groupes.map(g => (
            <tr key={g.id}>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{g.nom_groupe}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{filieres.find(f => f.id === g.filiere)?.nom_filiere || g.filiere}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>
                <button onClick={()=>openEdit(g)}>Éditer</button>
                <button onClick={()=>handleDelete(g)} style={{marginLeft:'0.5em',color:'#e53935'}}>Supprimer</button>
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
              <h2>{isEdit ? 'Éditer' : 'Ajouter'} un groupe</h2>
              <label>Nom
                <input name="nom_groupe" value={form.nom_groupe} onChange={handleChange} required />
              </label>
              <label>Filière
                <select name="filiere" value={form.filiere} onChange={handleChange} required>
                  <option value="">Choisir...</option>
                  {filieres.map(f => (
                    <option key={f.id} value={f.id}>{f.nom_filiere}</option>
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

export default GroupesPage; 