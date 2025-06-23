// src/pages/Auth.tsx
// Authentication Page
// Provides UI for user login and potentially signup.
// Interacts with the SecurityService.

import React, { useState, useEffect } from 'react';
import { SecurityService } from '../core/security/SecurityService';
import { User } from '../interfaces';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

// Access core modules from the global window object (for MVP simplicity)
// In a real app, use React Context or dependency injection
declare const window: any;
const securityService: SecurityService = window.systemContext?.securityService; // The Security Service
const systemContext: any = window.systemContext; // Access the full context to set currentUser


const Auth: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);
    const navigate = useNavigate(); // Hook for navigation

    // Redirect if already authenticated
    useEffect(() => {
        if (systemContext?.currentUser) {
            navigate('/'); // Redirect to dashboard if user is already logged in
        }
    }, [systemContext?.currentUser, navigate]); // Re-run effect if currentUser or navigate changes


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!securityService) {
            setMessage("SecurityService module not initialized.");
            return;
        }
        setIsLoggingIn(true);
        setMessage('');
        try {
            // Use actual Supabase Auth login
            const user = await securityService.login(email, password);
            if (user) {
                // SecurityService's auth listener updates systemContext.currentUser
                // The useEffect hook above will handle the navigation
                setMessage(`Login successful for ${user.email}! Redirecting...`);
            } else {
                // Supabase login method handles errors internally and returns null on failure
                 setMessage('Login failed. Invalid credentials.');
            }
        } catch (err: any) {
            console.error('Error during login:', err);
            setMessage(`Login failed: ${err.message}`);
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
         e.preventDefault();
        if (!securityService) {
            setMessage("SecurityService module not initialized.");
            return;
        }
        setIsSigningUp(true);
        setMessage('');
         try {
            // Use actual Supabase Auth signup
            const user = await securityService.signup(email, password);
            if (user) {
                 setMessage(`Signup successful for ${user.email}! Please check your email to confirm your account.`);
                 // Note: Supabase often requires email confirmation before login is possible
            } else {
                // Supabase signup method handles errors internally and returns null on failure
                setMessage('Signup failed.');
            }
        } catch (err: any) {
            console.error('Error during signup:', err);
            setMessage(`Signup failed: ${err.message}`);
        } finally {
            setIsSigningUp(false);
        }
    };


    // TODO: Add Google/GitHub login buttons (will call securityService.loginWithGoogle/loginWithGitHub)

    // If user is already logged in, show a message or redirect immediately
    if (systemContext?.currentUser) {
        return (
             <div className="container mx-auto p-4 flex justify-center">
                <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md text-center text-neutral-300">
                    <p>You are already logged in as {systemContext.currentUser.email}.</p>
                    <button
                        onClick={() => navigate('/')}
                        className="mt-4 px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                    >
                        Go to Dashboard
                    </button>
                </div>
             </div>
        );
    }


    return (
        <div className="container mx-auto p-4 flex justify-center">
            <div className="bg-neutral-800/50 p-8 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-3xl font-bold text-blue-400 mb-6 text-center">Login / Sign Up</h2>

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-neutral-300 text-sm font-semibold mb-2">Email:</label>
                        <input
                            id="email"
                            type="email"
                            className="w-full p-3 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoggingIn || isSigningUp}
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-neutral-300 text-sm font-semibold mb-2">Password:</label>
                        <input
                            id="password"
                            type="password"
                            className="w-full p-3 rounded-md bg-neutral-800 text-white border border-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isLoggingIn || isSigningUp}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoggingIn || isSigningUp}
                    >
                        {isLoggingIn ? 'Logging In...' : 'Login'}
                    </button>
                </form>

                <div className="mt-4 text-center">
                     <button
                        type="button"
                        onClick={handleSignup}
                        className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoggingIn || isSigningUp}
                    >
                        {isSigningUp ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </div>


                {/* Placeholder for other login methods */}
                <div className="mt-6 text-center">
                    <p className="text-neutral-400 mb-3">Or login with:</p>
                    <div className="flex justify-center gap-4">
                        <button className="px-4 py-2 border border-neutral-600 rounded-md text-neutral-300 hover:bg-neutral-700 transition" disabled>Google (TODO)</button>
                        <button className="px-4 py-2 border border-neutral-600 rounded-md text-neutral-300 hover:bg-neutral-700 transition" disabled>GitHub (TODO)</button>
                    </div>
                </div>

                {message && (
                    <div className={`mt-6 p-3 rounded-md text-center ${message.includes('successful') ? 'bg-green-800/30 text-green-300' : 'bg-red-800/30 text-red-300'}`}>
                        {message}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Auth;