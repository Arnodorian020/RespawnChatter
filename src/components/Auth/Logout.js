// src/components/Auth/Logout.js
import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <button className="logout-button" onClick={() => logout({ returnTo: window.location.origin })}>
            CERRAR SESIÓN
        </button>
    );
};
