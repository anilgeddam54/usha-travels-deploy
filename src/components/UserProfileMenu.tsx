import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, LayoutDashboard, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface UserProfileMenuProps {
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onOpenAdmin: () => void;
  mobile?: boolean;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  onOpenAuth,
  onOpenAdmin,
  mobile = false,
}) => {
  const {
    user,
    profile,
    isAdmin,
    isCustomer,
    displayRole,
    isProfileLoading,
    profileError,
    refreshProfile,
    logout,
  } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    if (mobile) {
      return (
        <button
          type="button"
          onClick={() => onOpenAuth('login')}
          className="w-full flex items-center justify-center gap-2 border border-amber-500/60 text-amber-400 hover:bg-amber-400/10 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <User className="w-4 h-4" />
          <span>Sign In / Register</span>
        </button>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onOpenAuth('login')}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-200 hover:text-amber-400 hover:bg-slate-800/60 border border-slate-700/80 transition-all active:scale-[0.98]"
        title="Sign In or Register"
      >
        <User className="w-3.5 h-3.5 text-amber-400" />
        <span>Sign In</span>
      </button>
    );
  }

  // User is logged in
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';

  if (mobile) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center font-bold text-xs">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">{displayName}</div>
              <div className="text-[10px] text-slate-400 truncate max-w-[160px]">{user.email}</div>
            </div>
          </div>

          {/* Role badge with loading and error states */}
          {isProfileLoading ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-amber-300 animate-pulse border border-slate-700">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              <span>Verifying...</span>
            </span>
          ) : profileError ? (
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/60"
              title={profileError}
            >
              Role Error
            </span>
          ) : isAdmin ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40">
              ADMIN
            </span>
          ) : isCustomer ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              CUSTOMER
            </span>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {profile?.role ? String(profile.role).toUpperCase() : 'CUSTOMER'}
            </span>
          )}
        </div>

        {/* Profile fetch error message & retry button if profile query failed */}
        {profileError && (
          <div className="p-2 bg-red-950/60 border border-red-800/80 rounded-lg text-xs text-red-200 space-y-1">
            <div className="flex items-center gap-1.5 font-semibold text-red-300 text-[11px]">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Error querying profiles table</span>
            </div>
            <div className="text-[10px] text-red-300/90 leading-tight">{profileError}</div>
            <button
              type="button"
              onClick={() => refreshProfile()}
              className="text-[11px] text-amber-300 hover:text-amber-200 underline font-semibold mt-1"
            >
              Retry fetching profile
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-2 pt-1 border-t border-slate-800">
          {/* Show Admin Dashboard button ONLY if role === 'admin' */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => onOpenAdmin()}
              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 px-3 rounded-lg text-xs transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-3 rounded-lg text-xs transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all"
      >
        <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xs">
          {displayName.charAt(0).toUpperCase()}
        </div>
        <span className="max-w-[100px] truncate font-semibold">{displayName}</span>

        {/* Trigger Button Role Badge */}
        {isProfileLoading ? (
          <span className="inline-flex items-center gap-1 text-[10px] bg-slate-700 text-amber-300 px-1.5 py-0.5 rounded font-semibold animate-pulse">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Verifying...</span>
          </span>
        ) : profileError ? (
          <span
            className="text-[10px] bg-red-900/60 text-red-200 border border-red-700/60 px-1.5 py-0.5 rounded font-bold"
            title={profileError}
          >
            Role Error
          </span>
        ) : isAdmin ? (
          <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded border border-amber-500/40 font-bold uppercase tracking-wider">
            ADMIN
          </span>
        ) : isCustomer ? (
          <span className="text-[10px] bg-slate-700/80 text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            CUSTOMER
          </span>
        ) : (
          <span className="text-[10px] bg-slate-700/80 text-slate-300 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
            {profile?.role ? String(profile.role).toUpperCase() : 'CUSTOMER'}
          </span>
        )}

        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 truncate">{displayName}</span>

              {/* Header Role Badge */}
              {isProfileLoading ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-600 animate-pulse">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  <span>Verifying...</span>
                </span>
              ) : profileError ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800 border border-red-300">
                  Role Error
                </span>
              ) : isAdmin ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  ADMIN
                </span>
              ) : isCustomer ? (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  CUSTOMER
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                  {profile?.role ? String(profile.role).toUpperCase() : 'CUSTOMER'}
                </span>
              )}
            </div>

            <div className="text-xs text-slate-500 truncate mt-0.5">{user.email}</div>
            {profile?.phone && (
              <div className="text-[11px] text-slate-500 mt-0.5">Ph: {profile.phone}</div>
            )}

            {/* Error detail in dropdown */}
            {profileError && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 space-y-1">
                <div className="flex items-center gap-1 font-semibold text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                  <span>Role query failed</span>
                </div>
                <div className="text-[10px] text-red-600 break-words">{profileError}</div>
                <button
                  type="button"
                  onClick={() => refreshProfile()}
                  className="text-xs text-red-800 underline font-semibold hover:text-red-900 pt-0.5 block"
                >
                  Retry fetching profile
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="p-1 space-y-0.5">
            {/* Show Admin Dashboard button ONLY if role === 'admin' */}
            {isAdmin && (
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenAdmin();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-amber-800 bg-amber-50/80 hover:bg-amber-100/80 rounded-lg transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Open Admin Dashboard</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 hover:text-red-700 hover:bg-red-50/60 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
