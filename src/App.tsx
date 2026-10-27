import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home-ezer-layoledet';
import Profile from './pages/Profile';
import Board from './pages/volunteer/Board';
import MyAssignments from './pages/volunteer/MyAssignments';
import AdminDashboard from './pages/admin/AdminDashboard';
import Products from './pages/admin/Products';
import Shabbatot from './pages/admin/Shabbatot';
import ShabbatDetail from './pages/admin/ShabbatDetail';
import AssignmentsTracking from './pages/admin/AssignmentsTracking';
import Reports from './pages/admin/Reports';
import Volunteers from './pages/admin/Volunteers';
import Families from './pages/admin/Families';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/board" element={<Board />} />
            <Route path="/my-assignments" element={<MyAssignments />} />
            <Route path="/profile" element={<Profile />} />
            <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<Products />} />
              <Route path="/admin/shabbatot" element={<Shabbatot />} />
              <Route path="/admin/shabbatot/:id" element={<ShabbatDetail />} />
              <Route path="/admin/assignments" element={<AssignmentsTracking />} />
              <Route path="/admin/reports" element={<Reports />} />
              <Route path="/admin/volunteers" element={<Volunteers />} />
              <Route path="/admin/families" element={<Families />} />

            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;