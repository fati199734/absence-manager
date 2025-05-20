import React, { useEffect, useState } from 'react';
import api from '../api';

function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ nom: '', prenom: '', email: '', telephone: '' });
  const [isEdit, setIsEdit] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    api.get('enseignants/')
      .then(res => setTeachers(res.data));
  };

  const openAdd = () => {
    setForm({ nom: '', prenom: '', email: '', telephone: '' });
    setIsEdit(false);
    setModalOpen(true);
  };

  const openEdit = (t) => {
    setForm({ nom: t.nom, prenom: t.prenom, email: t.email, telephone: t.telephone });
    setSelected(t);
    setIsEdit(true);
    setModalOpen(true);
  };

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (isEdit && selected) {
      api.put(`enseignants/${selected.id}/`, form)
        .then(() => { setModalOpen(false); fetchTeachers(); setFeedback('Enseignant modifié !'); setTimeout(()=>setFeedback(''),2000); });
    } else {
      api.post('enseignants/', form)
        .then(() => { setModalOpen(false); fetchTeachers(); setFeedback('Enseignant ajouté !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  const handleDelete = (t) => {
    if(window.confirm('Supprimer cet enseignant ?')) {
      api.delete(`enseignants/${t.id}/`).then(() => { fetchTeachers(); setFeedback('Enseignant supprimé !'); setTimeout(()=>setFeedback(''),2000); });
    }
  };

  return (
    <div style={{padding:'2em'}}>
      <h2>Enseignants</h2>
      <button onClick={openAdd} style={{marginBottom:'1em'}}>+ Ajouter</button>
      {feedback && <div style={{color:'#1aaf5d',marginBottom:'1em'}}>{feedback}</div>}
      <table style={{width:'100%',borderCollapse:'collapse'}}>
        <thead>
          <tr style={{background:'#f5f6fa'}}>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Nom</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Prénom</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Email</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Téléphone</th>
            <th style={{padding:'8px',border:'1px solid #eee'}}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map(t => (
            <tr key={t.id}>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{t.nom}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{t.prenom}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{t.email}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>{t.telephone}</td>
              <td style={{padding:'8px',border:'1px solid #eee'}}>
                <button onClick={()=>openEdit(t)}>Éditer</button>
                <button onClick={()=>handleDelete(t)} style={{marginLeft:'0.5em',color:'#e53935'}}>Supprimer</button>
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
              <h2>{isEdit ? 'Éditer' : 'Ajouter'} un enseignant</h2>
              <label>Nom
                <input name="nom" value={form.nom} onChange={handleChange} required />
              </label>
              <label>Prénom
                <input name="prenom" value={form.prenom} onChange={handleChange} required />
              </label>
              <label>Email
                <input name="email" value={form.email} onChange={handleChange} required />
              </label>
              <label>Téléphone
                <input name="telephone" value={form.telephone} onChange={handleChange} />
              </label>
              <button type="submit">Enregistrer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeachersPage; 