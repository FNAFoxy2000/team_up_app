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
                        try {
                            const id = await getUserIdByUsername(userData.username);
                            setUserId(id); // Guardar el ID en el estado
                            // console.log("Nombre de usuario guardado:", userData.username);
                            // console.log("Email de usuario guardado:", userData.email);
                            // console.log("ID de usuario obtenido:", id);
                        } catch (error) {
                            console.error("Error al obtener el ID del usuario:", error);
                        }
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
    if (loading) {
        return <div className="loading">Cargando...</div>;
    }

    // Verificar que tenemos tanto el usuario como su ID
    if (!user || !userId) {
        return (
            <div className="error-message">
                <h2>Error: No se pudo cargar la información del usuario</h2>
                <p>Por favor, intenta recargar la página o contacta al administrador.</p>
            </div>
        );
    }

    return (
        <div className="chat-page">
            <ChatContainer
                userId={userId}
                username={user.username}
            />
        </div>
    );
};

export default ChatPage;