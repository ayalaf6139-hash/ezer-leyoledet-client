import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';

export default function HomeEzerLayoledet() {
    const { user, isLoading } = useAuth();

    if (isLoading) return <Loading />;
    if (!user) return <Navigate to="/login" replace />;

    return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/board'} replace />;
}