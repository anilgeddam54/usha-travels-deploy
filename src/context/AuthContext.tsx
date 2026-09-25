import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  role?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: string | null;
  displayRole: 'ADMIN' | 'CUSTOMER' | null;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  profileError: string | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ error?: string; code?: string; status?: number; rawMessage?: string }>;
  register: (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ) => Promise<{ error?: string; message?: string }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<{ profile: UserProfile | null; error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Prevent race conditions between initial getSession/getUser and onAuthStateChange
  const initialFetchCompleted = useRef(false);

  /**
   * Requirements:
   * 1. After Supabase authentication, get the current authenticated user's ID using:
   *    supabase.auth.getUser()
   * 2. Query the existing public.profiles table using the authenticated user's ID:
   *    select * from profiles where id = user.id single()
   * 3. Use the returned profiles.role value as the actual application role.
   * 6. Do NOT determine the role from email, username, display name, or hardcoded values.
   * 7. Do NOT create another role system or another profile table.
   * 8. Respect the existing Supabase RLS policies.
   */
  const fetchAuthenticatedUserProfile = async (): Promise<{
    user: User | null;
    profile: UserProfile | null;
    error: string | null;
  }> => {
    try {
      // Step 1: Call supabase.auth.getUser() to retrieve authenticated user from Supabase Auth server
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        return { user: null, profile: null, error: null };
      }

      const authUser = userData?.user;
      if (!authUser) {
        return { user: null, profile: null, error: null };
      }

      // Step 2: Query existing public.profiles table using authenticated user's ID:
      // select * from profiles where id = user.id single()
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileErr) {
        console.error('Error querying public.profiles table for user ID:', authUser.id, profileErr);
        return {
          user: authUser,
          profile: null,
          error: profileErr.message || `Failed to fetch profile: ${profileErr.code || ''}`,
        };
      }

      if (!profileData) {
        return {
          user: authUser,
          profile: null,
          error: 'No profile record found in public.profiles table for this account.',
        };
      }

      return {
        user: authUser,
        profile: (profileData as UserProfile) || null,
        error: null,
      };
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Unexpected exception during profile query:', error);
      return {
        user: null,
        profile: null,
        error: error?.message || 'Unexpected failure fetching profile from database',
      };
    }
  };

  // Re-fetch profile manually on demand (e.g. retry on error)
  const refreshProfile = async (): Promise<{ profile: UserProfile | null; error: string | null }> => {
    setIsProfileLoading(true);
    setProfileError(null);
    try {
      const result = await fetchAuthenticatedUserProfile();
      if (result.user) {
        setUser(result.user);
        if (result.error) {
          setProfile(null);
          setProfileError(result.error);
        } else {
          setProfile(result.profile);
          setProfileError(null);
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      return { profile: result.profile, error: result.error };
    } finally {
      setIsProfileLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    // 9. Make sure the profile is fetched after authentication session is restored, including after page refresh.
    // 10. Handle loading state while profile is being fetched so CUSTOMER is not temporarily shown as the final role.
    const initializeAuth = async () => {
      setIsLoading(true);
      setIsProfileLoading(true);
      setProfileError(null);

      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (!mounted) return;
        setSession(existingSession);

        if (existingSession?.user) {
          // 1. Get current authenticated user's ID using supabase.auth.getUser()
          // 2. Query existing public.profiles table where id = user.id single()
          const result = await fetchAuthenticatedUserProfile();
          if (!mounted) return;

          if (result.user) {
            setUser(result.user);
            if (result.error) {
              setProfile(null);
              // 11. If the profile query fails, show an appropriate error instead of silently assuming CUSTOMER
              setProfileError(result.error);
            } else {
              setProfile(result.profile);
              setProfileError(null);
            }
          } else {
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err: unknown) {
        const error = err as Error;
        console.error('Session restoration error:', error);
        if (mounted) {
          setProfileError(error?.message || 'Failed to restore authentication session');
        }
      } finally {
        if (mounted) {
          initialFetchCompleted.current = true;
          setIsProfileLoading(false);
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;
      setSession(newSession);

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setUser(null);
        setProfile(null);
        setProfileError(null);
        setIsProfileLoading(false);
        setIsLoading(false);
        return;
      }

      // Ignore INITIAL_SESSION event if initializeAuth is already handling it
      if (event === 'INITIAL_SESSION' && !initialFetchCompleted.current) {
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        setIsProfileLoading(true);
        setProfileError(null);

        try {
          const result = await fetchAuthenticatedUserProfile();
          if (!mounted) return;

          if (result.user) {
            setUser(result.user);
            if (result.error) {
              setProfile(null);
              setProfileError(result.error);
            } else {
              setProfile(result.profile);
              setProfileError(null);
            }
          }
        } catch (err: unknown) {
          const error = err as Error;
          if (mounted) setProfileError(error?.message || 'Error updating profile session');
        } finally {
          if (mounted) {
            setIsProfileLoading(false);
            setIsLoading(false);
          }
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Login handler
  const login = async (
    email: string,
    password: string
  ): Promise<{ error?: string; code?: string; status?: number; rawMessage?: string }> => {
    try {
      setIsLoading(true);
      setIsProfileLoading(true);
      setProfileError(null);

      // AUTH LOGIN: Exact required call
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        setIsLoading(false);
        setIsProfileLoading(false);
        console.error('Supabase signInWithPassword raw error:', error);

        // DEBUGGING: Temporarily display actual error.message and error.code/status if available
        const errCode = (error as any)?.code || '';
        const errStatus = (error as any)?.status || '';
        const debugParts = [
          errCode ? `code: ${errCode}` : null,
          errStatus ? `status: ${errStatus}` : null,
        ]
          .filter(Boolean)
          .join(', ');

        const formattedError = debugParts
          ? `${error.message} (${debugParts})`
          : error.message;

        return {
          error: formattedError,
          code: errCode,
          status: typeof errStatus === 'number' ? errStatus : undefined,
          rawMessage: error.message,
        };
      }

      // Requirement 9: After successful login, use the returned session/user.
      setSession(data.session);
      setUser(data.user);

      // Requirement 10: Then fetch public.profiles using the authenticated user's ID.
      if (data.user?.id) {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr) {
          console.error('Error querying public.profiles after login:', profileErr);
          setProfile(null);
          setProfileError(profileErr.message || 'Failed to fetch user profile');
        } else {
          setProfile((profileData as UserProfile) || null);
          setProfileError(null);
        }
      }

      setIsLoading(false);
      setIsProfileLoading(false);
      return {};
    } catch (err: unknown) {
      setIsLoading(false);
      setIsProfileLoading(false);
      const authErr = err as AuthError;
      const errCode = (authErr as any)?.code || '';
      const errStatus = (authErr as any)?.status || '';
      const debugParts = [
        errCode ? `code: ${errCode}` : null,
        errStatus ? `status: ${errStatus}` : null,
      ]
        .filter(Boolean)
        .join(', ');
      const message = authErr?.message || 'Login failed. Please check credentials.';
      return {
        error: debugParts ? `${message} (${debugParts})` : message,
        code: errCode,
        status: typeof errStatus === 'number' ? errStatus : undefined,
        rawMessage: message,
      };
    }
  };

  // Register handler
  const register = async (
    email: string,
    password: string,
    fullName: string,
    phone: string
  ): Promise<{ error?: string; message?: string }> => {
    try {
      setIsLoading(true);
      setIsProfileLoading(true);
      setProfileError(null);

      const cleanEmail = email.trim();
      const cleanName = fullName.trim();
      const cleanPhone = phone.trim();

      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: cleanPhone,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        setIsProfileLoading(false);
        const errCode = (error as any)?.code || '';
        const errStatus = (error as any)?.status || '';
        const debugParts = [
          errCode ? `code: ${errCode}` : null,
          errStatus ? `status: ${errStatus}` : null,
        ]
          .filter(Boolean)
          .join(', ');
        return {
          error: debugParts ? `${error.message} (${debugParts})` : error.message,
        };
      }

      // Check if user already exists (Supabase returns an empty identities array for existing users)
      if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
        setIsLoading(false);
        setIsProfileLoading(false);
        return {
          error:
            'An account with this email address already exists. Please Sign In with your existing password.',
        };
      }

      // If session is returned (email confirmation disabled or auto-confirmed)
      if (data.session && data.user) {
        setSession(data.session);
        setUser(data.user);

        // Attempt updating profile fields in public.profiles
        try {
          await supabase
            .from('profiles')
            .update({
              full_name: cleanName,
              phone: cleanPhone,
            })
            .eq('id', data.user.id);
        } catch {
          // Trigger may handle this
        }

        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileErr) {
          setProfileError(profileErr.message);
        } else {
          setProfile((profileData as UserProfile) || null);
          setProfileError(null);
        }

        setIsLoading(false);
        setIsProfileLoading(false);
        return {};
      }

      // If email confirmation is required (session is null)
      // Do NOT keep user in authenticated state in React when there is no auth session token
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsLoading(false);
      setIsProfileLoading(false);

      return {
        message:
          'Registration successful! Please check your email inbox to confirm your account and sign in.',
      };
    } catch (err: unknown) {
      setIsLoading(false);
      setIsProfileLoading(false);
      const authErr = err as AuthError;
      return { error: authErr?.message || 'Registration failed. Please try again.' };
    }
  };

  // Requirement 8: signOut() uses await supabase.auth.signOut()
  const logout = async () => {
    setIsProfileLoading(false);
    setProfileError(null);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  /**
   * Requirement 11: Keep CUSTOMER for normal users.
   * Requirement 12: Keep ADMIN based on profiles.role === 'admin'.
   */
  const actualRole = profile?.role ? String(profile.role).trim().toLowerCase() : null;
  const isAdmin = !!user && actualRole === 'admin';
  const isCustomer = !!user && !isAdmin;

  const displayRole: 'ADMIN' | 'CUSTOMER' | null = !user || isProfileLoading
    ? null
    : isAdmin
    ? 'ADMIN'
    : 'CUSTOMER';

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role: actualRole,
        displayRole,
        isAdmin,
        isCustomer,
        isLoading,
        isProfileLoading,
        profileError,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
