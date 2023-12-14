import React from 'react';

import Button from 'react-bootstrap/Button';
import './login.css';
import { MessageDialog } from './messageDialog.jsx';

export function Login(props) {
    const [username, setUsername] = React.useState(props.username);
    const [password, setPassword] = React.useState('');
    const [displayError, setDisplayError] = React.useState(null);

    async function login() {
        loginOrRegister("/api/auth/login");
    }

    async function register() {
        loginOrRegister("/api/auth/register");
    }

    async function loginOrRegister(endpoint) {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                email: username,
                password: password,
            })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem("username", username);
            props.onLogin(username);
        } else {
            setDisplayError(data.message);
        }
    }


    return (
        <main className='container-fluid align-items-center'>
            <h1 className='text-center'>Welcome</h1>
            <div className="text-center" id="loginControls">
                <p className="login-inputs">Login to play</p>
                <div className="login-inputs">
                    <div>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="login-buttons">
                        <Button id="signIn" type="submit" className="btn btn-primary" onClick={login}>Sign in</Button>
                        <Button id="register" type="submit" className="btn btn-secondary" onClick={register}>Register</Button>
                    </div>
                </div>
            </div>

            <MessageDialog message={displayError} onHide={() => setDiaplayError(null)} />
        </main>
    );
}