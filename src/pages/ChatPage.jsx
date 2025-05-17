import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../components/Chat/ChatContainer';
import AuthService from '../services/authService.mjs';
import { getUserIdByUsername } from '../services/userService';

const ChatPage = () => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            try {
                // Obtener información del usuario desde el token JWT
                const userData = AuthService.getUserFromToken();

                if (userData) {
                    setUser(userData);

                    // Obtener el ID del usuario basado en su nombre de usuario
                    if (userData.username) {
                        const userId = await getUserIdByUsername(userData.username);
                    }
                } else {
                    // Si no hay usuario autenticado, redirigir al login
                    navigate('/LoginError');
                }
            } catch (error) {
                console.error('Error al obtener datos del usuario:', error);
                navigate('/LoginError');
            } finally {
                setLoading(false);
            }
        }

        fetchUserData();
    }, [navigate]);
    // Mostrar un mensaje de carga mientras verificamos la autenticación
    if (user === null) {
        return <div className="loading">Cargando...</div>;
    }

    return (
        <div className="chat-page">
            {user && (
                <ChatContainer
                    userId={userId}
                    username={user.username}
                />
            )}
        </div>
    );
};

export default ChatPage;