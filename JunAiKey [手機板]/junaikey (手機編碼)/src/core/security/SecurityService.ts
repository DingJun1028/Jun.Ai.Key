// src/core/security/SecurityService.ts
// 安全服務 (Placeholder)
// Handles authentication, authorization (RBAC/ABAC), and data security.

import { createClient, SupabaseClient, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { User, SystemContext } from '../../interfaces';

// Define the type for the auth state change listener callback
type AuthStateChangeCallback = (user: User | null) => void;

export class SecurityService {
    private supabase: SupabaseClient;
    private context: SystemContext;
    private authStateChangeListeners: AuthStateChangeCallback[] = [];

    constructor(context: SystemContext) {
        this.context = context;
        // Ensure Supabase URL and Key are available
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            console.error("Supabase URL and ANON Key must be set in environment variables.");
            // In a real app, you might throw an error or handle this more gracefully
             throw new Error("Supabase credentials not loaded. Check .env file and environment variables.");
        }

        this.supabase = createClient(supabaseUrl as string, supabaseAnonKey as string);
        console.log('SecurityService initialized with Supabase Auth.');

        // Set up Supabase Auth listener
        this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
            console.log('[SecurityService] Auth state changed:', event, session);
            const user = session?.user ? this.mapSupabaseUserToUserInterface(session.user) : null;

            // Update the context's currentUser
            this.context.currentUser = user;

            // Notify all registered listeners
            this.authStateChangeListeners.forEach(listener => {
                try {
                    listener(user);
                } catch (error) {
                    console.error('[SecurityService] Error in auth state change listener:', error);
                    this.context.loggingService?.logError('Error in auth state change listener', { error: error });
                }
            });

            this.context.loggingService?.logInfo(`Auth state changed: ${event}`, { userId: user?.id });
        });

        // Immediately check the current session state on initialization
        this.checkCurrentSession();
    }

    /**
     * Maps a Supabase User object to the internal User interface.
     * @param supabaseUser The user object from Supabase Auth.
     * @returns The mapped User object.
     */
    private mapSupabaseUserToUserInterface(supabaseUser: any): User {
        return {
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: supabaseUser.user_metadata?.name || supabaseUser.email, // Use name from metadata or email
            avatarUrl: supabaseUser.user_metadata?.avatar_url,
            role: supabaseUser.role || 'authenticated', // Default role
        };
    }

    /**
     * Checks the current Supabase session and updates the context.
     */
    private async checkCurrentSession(): Promise<void> {
        try {
            const { data: { session }, error } = await this.supabase.auth.getSession();
            if (error) {
                console.error('[SecurityService] Error getting session:', error.message);
                this.context.loggingService?.logError('Error getting Supabase session', { error: error.message });
                this.context.currentUser = null;
            } else {
                this.context.currentUser = session?.user ? this.mapSupabaseUserToUserInterface(session.user) : null;
                console.log('[SecurityService] Initial session check complete. User:', this.context.currentUser?.id);
                this.context.loggingService?.logInfo('Initial session check complete', { userId: this.context.currentUser?.id });
            }
        } catch (error: any) {
             console.error('[SecurityService] Unexpected error during session check:', error.message);
             this.context.loggingService?.logError('Unexpected error during session check', { error: error.message });
             this.context.currentUser = null;
        }
    }


    /**
     * Handles user login with email and password using Supabase Auth.
     * @param email User email.
     * @param password User password.
     * @returns Promise<User | null> The authenticated user or null on failure.
     */
    async login(email: string, password: string): Promise<User | null> {
        console.log(`[SecurityService] Attempting login for ${email}...`);
        this.context.loggingService?.logInfo(`Login attempt for ${email}`);

        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });

            if (error) {
                console.error('[SecurityService] Login failed:', error.message);
                this.context.loggingService?.logError(`Login failed for ${email}`, { error: error.message });
                // Supabase auth listener will handle updating currentUser to null if login fails
                throw error; // Re-throw the error for the caller to handle (e.g., display error message)
            }

            // Supabase auth listener will handle updating currentUser on successful login
            console.log('[SecurityService] Login request successful (waiting for auth state change).');
            // Return the user data from the response, but the source of truth is the listener updating context.currentUser
            return data.user ? this.mapSupabaseUserToUserInterface(data.user) : null;

        } catch (error: any) {
            console.error('[SecurityService] Error during login:', error.message);
            this.context.loggingService?.logError(`Error during login for ${email}`, { error: error.message });
            throw error; // Re-throw the error
        }
    }

    /**
     * Handles user login with Google using Supabase Auth (Placeholder).
     * @returns Promise<void> (OAuth typically involves redirects, so no direct user return)
     */
    async loginWithGoogle(): Promise<void> {
        console.log('[SecurityService] Initiating login with Google...');
        this.context.loggingService?.logInfo('Initiating login with Google');

        try {
            // TODO: Implement actual Supabase Auth signInWithOAuth({ provider: 'google' })
            // This will likely cause a redirect.
            // const { data, error } = await this.supabase.auth.signInWithOAuth({
            //     provider: 'google',
            //     // options: { redirectTo: 'YOUR_REDIRECT_URL' } // Optional: specify redirect URL
            // });
            // if (error) {
            //     console.error('[SecurityService] Google login initiation failed:', error.message);
            //     this.context.loggingService?.logError('Google login initiation failed', { error: error.message });
            //     throw error;
            // }
            // console.log('[SecurityService] Google login initiation successful (redirecting...).');

            // Simulate initiation for MVP
             console.log('[SecurityService] Simulated Google login initiation.');
             this.context.loggingService?.logInfo('Simulated Google login initiation');
             alert("Simulating Google Login. In a real app, this would redirect you to Google.");


        } catch (error: any) {
            console.error('[SecurityService] Error initiating Google login:', error.message);
            this.context.loggingService?.logError('Error initiating Google login', { error: error.message });
            throw error;
        }
    }

     /**
     * Handles user login with GitHub using Supabase Auth (Placeholder).
     * @returns Promise<void> (OAuth typically involves redirects, so no direct user return)
     */
    async loginWithGitHub(): Promise<void> {
        console.log('[SecurityService] Initiating login with GitHub...');
        this.context.loggingService?.logInfo('Initiating login with GitHub');

        try {
            // TODO: Implement actual Supabase Auth signInWithOAuth({ provider: 'github' })
            // This will likely cause a redirect.
            // const { data, error } = await this.supabase.auth.signInWithOAuth({
            //     provider: 'github',
            //     // options: { redirectTo: 'YOUR_REDIRECT_URL' } // Optional: specify redirect URL
            // });
            // if (error) {
            //     console.error('[SecurityService] GitHub login initiation failed:', error.message);
            //     this.context.loggingService?.logError('GitHub login initiation failed', { error: error.message });
            //     throw error;
            // }\
            // console.log('[SecurityService] GitHub login initiation successful (redirecting...).');

            // Simulate initiation for MVP
            console.log('[SecurityService] Simulated GitHub login initiation.');
            this.context.loggingService?.logInfo('Simulated GitHub login initiation');
            alert("Simulating GitHub Login. In a real app, this would redirect you to GitHub.");

        } catch (error: any) {
            console.error('[SecurityService] Error initiating GitHub login:', error.message);
            this.context.loggingService?.logError('Error initiating GitHub login', { error: error.message });
            throw error;
        }
    }

    /**
     * Handles user signup with email and password using Supabase Auth.
     * @param email User email.
     * @param password User password.
     * @returns Promise<User | null> The newly created user or null on failure.
     */
    async signup(email: string, password: string): Promise<User | null> {
        console.log(`[SecurityService] Attempting signup for ${email}...`);
        this.context.loggingService?.logInfo(`Signup attempt for ${email}`);

        try {
            const { data, error } = await this.supabase.auth.signUp({ email, password });

            if (error) {
                console.error('[SecurityService] Signup failed:', error.message);
                this.context.loggingService?.logError(`Signup failed for ${email}`, { error: error.message });
                 throw error; // Re-throw the error for the caller to handle
            }

            // Note: Supabase often requires email confirmation after signup
            console.log('[SecurityService] Signup request successful. Email confirmation may be required.');
            this.context.loggingService?.logInfo(`Signup request successful for ${email}`);

            // The user object in the response might be null if email confirmation is required
            // The auth state listener will handle updating currentUser if the user is automatically logged in
            return data.user ? this.mapSupabaseUserToUserInterface(data.user) : null;

        } catch (error: any) {
            console.error('[SecurityService] Error during signup:', error.message);
            this.context.loggingService?.logError(`Error during signup for ${email}`, { error: error.message });
            throw error;
        }
    }

    /**
     * Handles user logout using Supabase Auth.
     * @returns Promise<void>
     */
    async logout(): Promise<void> {
        console.log('[SecurityService] Attempting logout...');
        this.context.loggingService?.logInfo('Logout attempt', { userId: this.context.currentUser?.id });

        try {
            const { error } = await this.supabase.auth.signOut();

            if (error) {
                console.error('[SecurityService] Logout failed:', error.message);
                this.context.loggingService?.logError('Logout failed', { userId: this.context.currentUser?.id, error: error.message });
                throw error;
            }

            // Supabase auth listener will handle updating currentUser to null
            console.log('[SecurityService] Logout successful.');
            this.context.loggingService?.logInfo('Logout successful');

        } catch (error: any) {
            console.error('[SecurityService] Error during logout:', error.message);
            this.context.loggingService?.logError('Error during logout', { userId: this.context.currentUser?.id, error: error.message });
            throw error;
        }
    }

    /**
     * Gets the current authenticated user from the context.
     * This should be kept in sync with the actual auth state by the auth listener.
     * @returns User | null The current user or null if not authenticated.
     */
    getCurrentUser(): User | null {
        // console.log('[SecurityService] Getting current user from context:', this.context.currentUser?.id);
        return this.context.currentUser;
    }

    /**
     * Subscribes a callback function to authentication state changes.
     * @param callback The function to call when the auth state changes.
     * @returns A function to unsubscribe the callback.
     */
    onAuthStateChange(callback: AuthStateChangeCallback): () => void {
        this.authStateChangeListeners.push(callback);
        // Immediately call the callback with the current state
        callback(this.context.currentUser);
        // Return an unsubscribe function
        return () => {
            this.authStateChangeListeners = this.authStateChangeListeners.filter(listener => listener !== callback);
        };
    }


    /**
     * Checks if the current user has a specific role.
     * @param role The role to check for (e.g., 'admin', 'authenticated').
     * @returns boolean
     */
    hasRole(role: string): boolean {
        // console.log(`[SecurityService] Checking if user has role: ${role}`);
        const user = this.getCurrentUser();
        // TODO: Implement proper role checking based on user object or claims
        return user?.role === role; // Simulated user has 'authenticated' role
    }

    /**
     * Checks if the current user has a specific permission.
     * @param permission The permission to check for (e.e.g., 'kb:write', 'task:run').
     * @returns boolean
     */
    hasPermission(permission: string): boolean {
         // console.log(`[SecurityService] Checking if user has permission: ${permission}`);
         // TODO: Implement permission check based on user roles, attributes, or a dedicated permissions table
         // This is complex and depends on your authorization model (RBAC/ABAC)

         // Simulate simple permission check (e.g., authenticated users can do anything in MVP)
         const user = this.getCurrentUser();
         return !!user; // If user is logged in, grant permission
    }

    // TODO: Implement password reset, email confirmation, etc.
    // TODO: Implement Row Level Security (RLS) logic explanation/helpers
    // TODO: Implement Attribute-Based Access Control (ABAC) if needed
    // TODO: Integrate with API Proxy to enforce security checks on incoming requests
    // TODO: This module is part of the Bidirectional Sync Domain (雙向同步領域) for syncing user data/settings.
}