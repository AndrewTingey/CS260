import React from 'react';
import { login, register } from './login.js';
import './login.css';

export function Login() {
    return (
        <main className='container-fluid'>
            <h1>Welcome</h1>
            <div className="text-center" id="loginControls">
                <p className="login-inputs">Login to play</p>
                <div className="login-inputs">
                    <div>
                        <input id="username" type="text" placeholder="Email" />
                    </div>
                    <div>
                        <input id="password" type="password" placeholder="Password" />
                    </div>
                    <div className="login-buttons">
                        <button id="signIn" type="submit" className="btn btn-primary" onClick={login}>Sign in</button>
                        <button id="register" type="submit" className="btn btn-secondary" onClick={register}>Register</button>
                    </div>
                </div>
            </div>
        </main>
    );
}