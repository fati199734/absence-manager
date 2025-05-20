import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TeachersPage from './pages/TeachersPage';
import StudentsPage from './pages/StudentsPage';
import ReportPage from './pages/ReportPage';
import ActivityLogsPage from './pages/ActivityLogsPage';
import SettingsPage from './pages/SettingsPage';
import LogoutPage from './pages/LogoutPage';
import TeacherDetailsPage from './pages/TeacherDetailsPage';
import TeacherAttendanceHistoryPage from './pages/TeacherAttendanceHistoryPage';
import StudentDetailsPage from './pages/StudentDetailsPage';
import StudentAttendanceHistoryPage from './pages/StudentAttendanceHistoryPage';
import DepartmentsPage from './pages/DepartmentsPage';
import FilieresPage from './pages/FilieresPage';
import GroupesPage from './pages/GroupesPage';
import AbsencesPage from './pages/AbsencesPage';
import SeancesPage from './pages/SeancesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/teachers" element={<TeachersPage />} />
        <Route path="/teachers/details" element={<TeacherDetailsPage />} />
        <Route path="/teachers/attendance-history" element={<TeacherAttendanceHistoryPage />} />
        <Route path="/students" element={<StudentsPage />} />
        <Route path="/students/details" element={<StudentDetailsPage />} />
        <Route path="/students/attendance-history" element={<StudentAttendanceHistoryPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/activity-logs" element={<ActivityLogsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/filieres" element={<FilieresPage />} />
        <Route path="/groupes" element={<GroupesPage />} />
        <Route path="/absences" element={<AbsencesPage />} />
        <Route path="/seances" element={<SeancesPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
