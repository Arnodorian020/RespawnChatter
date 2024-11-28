import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
    const { logout } = useAuth0();

    const getReturnUrl = () => {
        // Forzar la URL de retorno al puerto 3001, independientemente del puerto actual
        return window.location.protocol + "//" + window.location.hostname + ":3001";
    };

    return (
        <button className="logout-button" onClick={() => logout({ returnTo: getReturnUrl() })}>
            CERRAR SESIÓN
        </button>
    );
};
