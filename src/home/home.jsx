import React from 'react';

import { Login } from './login.jsx';
import { GameMenu } from './gamemenu.jsx';
import { AuthState } from './authState.js';

export function Home({ username = null, authState, onAuthChange }) {
    return (
        <main className='container-fluid'>
            <div>
                {authState !== AuthState.Unknown && <h1>Welcome</h1>}
                {authState === AuthState.Authenticated && (
                    <GameMenu username={ username } onLogout={() => onAuthChange(username, AuthState.Unauthenticated)} />
                )}
                {authState === AuthState.Unauthenticated && (
                    <Login
                        username={username}
                        onLogin={(loginUserName) => {
                            onAuthChange(loginUserName, AuthState.Authenticated);
                        }}
                    />
                )}
            </div>
        </main>
    )
}