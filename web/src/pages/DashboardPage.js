import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '../styles/DashboardPage.css';

function DashboardPage() {
  const [openTeacher, setOpenTeacher] = useState(false);
  const [openStudent, setOpenStudent] = useState(false);
  const location = useLocation();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-logo">
          <img src="/logo192.png" alt="Logo" />
        </div>
        <div className="sidebar-title">Admin</div>
        <nav className="sidebar-menu">
          <ul>
            <li>
              <NavLink to="/dashboard" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></svg>
                </span>
                Tableau de bord
              </NavLink>
            </li>
            <li>
              <div className={openStudent ? 'submenu-open' : ''} onClick={() => setOpenStudent(v => !v)} style={{display:'flex',alignItems:'center',cursor:'pointer'}}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </span>
                Étudiants
                <span style={{marginLeft:'auto',fontSize:'1.2em'}}>{openStudent ? '▾' : '▸'}</span>
              </div>
              {openStudent && (
                <ul className="sidebar-submenu sidebar-submenu-below">
                  <li>
                    <NavLink to="/students/details" className={({isActive}) => isActive ? 'active' : ''}>Gestion des étudiants</NavLink>
                  </li>
                  <li>
                    <NavLink to="/students/attendance-history" className={({isActive}) => isActive ? 'active' : ''}>Historique de présence</NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li>
              <NavLink to="/report" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M16 2v4M8 2v4"/></svg>
                </span>
                Rapports
              </NavLink>
            </li>
            <li>
              <NavLink to="/activity-logs" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </span>
                Journal d'activité
              </NavLink>
            </li>
            <li>
              <NavLink to="/departments" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </span>
                Départements
              </NavLink>
            </li>
            <li>
              <NavLink to="/filieres" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </span>
                Filières
              </NavLink>
            </li>
            <li>
              <NavLink to="/groupes" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </span>
                Groupes
              </NavLink>
            </li>
            <li>
              <NavLink to="/seances" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>
                </span>
                Séances
              </NavLink>
            </li>
            <li>
              <NavLink to="/absences" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#1a2b49" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </span>
                Absences
              </NavLink>
            </li>
            <li className="sidebar-settings">
              <NavLink to="/settings" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#fbc02d" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 5 15.4a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 5 8.6a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.39 1.26 1 1.51a1.65 1.65 0 0 0 1.82.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.66 0 1.26.39 1.51 1H21a2 2 0 1 1 0 4h-.09c-.25 0-.49.04-.72.12"/></svg>
                </span>
                <span style={{color:'#fbc02d'}}>Paramètres</span>
              </NavLink>
            </li>
            <li className="sidebar-logout">
              <NavLink to="/logout" className={({isActive}) => isActive ? 'active' : ''}>
                <span className="sidebar-icon">
                  <svg width="22" height="22" fill="none" stroke="#e53935" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </span>
                <span style={{color:'#e53935'}}>Déconnexion</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      {/* Main content */}
      <main className="dashboard-main">
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-title">Tableau de bord</div>
          <div className="header-actions">
            <span className="header-user">Déconnexion</span>
          </div>
        </header>
        {/* Statistiques */}
        <section className="dashboard-stats">
          <div className="stat-card present">
            <div className="stat-title">Présents | Aujourd'hui</div>
            <div className="stat-value">145</div>
            <div className="stat-sub">12% d'augmentation</div>
          </div>
          <div className="stat-card absent">
            <div className="stat-title">Absents | Aujourd'hui</div>
            <div className="stat-value">145</div>
            <div className="stat-sub">12% d'augmentation</div>
          </div>
          <div className="stat-card attendance">
            <div className="stat-title">Présence | Ce mois</div>
            <div className="stat-value">145</div>
            <div className="stat-sub">12% d'augmentation</div>
          </div>
        </section>
        {/* Graphiques et widgets */}
        <section className="dashboard-widgets">
          <div className="widget reports">
            <div className="widget-title">Rapports / Aujourd'hui</div>
            <div className="widget-graph">[Graphique ligne]</div>
          </div>
          <div className="widget radar">
            <div className="widget-title">Rapport de présence | Ce mois</div>
            <div className="widget-graph">[Radar chart]</div>
          </div>
          <div className="widget bar">
            <div className="widget-title">Taux de présence</div>
            <div className="widget-graph">[Bar chart]</div>
          </div>
          <div className="widget pie">
            <div className="widget-title">Départements</div>
            <div className="widget-graph">[Pie chart]</div>
          </div>
          <div className="widget goal">
            <div className="widget-title">Objectif journalier</div>
            <div className="widget-graph">[Goal widget]</div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage; 