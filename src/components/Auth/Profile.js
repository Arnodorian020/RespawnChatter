// src/components/Auth/Profile.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

export const Profile = () => {
    const { user, isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <div>No estás autenticado.</div>;
    }

    return (
        <div className="profile-header">
            <img src={user.picture} alt={user.name} className="profile-avatar" />
            <h2>{user.name}</h2>
            <p>Email: {user.email}</p>
        </div>
    );
};
