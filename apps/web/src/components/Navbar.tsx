"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SignIn from './auth/Sign-in';
import { API_ENDPOINTS } from '@/config/api';

import { supabase } from '../utils/supabase/client';
import { LogOut } from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
}

const links = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Help Center", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is already logged in
  const checkUserSession = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
        return;
      }
      
      if (session) {
        await fetchUserProfile(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSignIn = () => {
    setIsSignInOpen(!isSignInOpen);
    // Close other menus when opening sign-in
    setIsUserMenuOpen(false);
    setOpen(false);
  };

  // Fetch user profile data
  const fetchUserProfile = async (userId: string) => {
    console.log('Fetching user profile for ID:', userId);
    try {
      // Use the backend API instead of direct Supabase query
      const res = await fetch(API_ENDPOINTS.getProfileByUUID(userId), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!res.ok) {
        console.error('Error fetching user profile:', res.status, res.statusText);
        // If profile doesn't exist yet, create a basic one from auth data
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          return;
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url
          });
        }
        return;
      }
      
      const json: any = await res.json();
      if (!json.success || !json.data) {
        console.error('Error fetching user profile:', json.message);
        // Fallback to auth data
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          return;
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url
          });
        }
        return;
      }
      
      // Set user data from backend response
      setUser({
        id: json.data.id || json.data.user_uuid || userId,
        email: json.data.email || '',
        full_name: json.data.full_name || json.data.name,
        avatar_url: json.data.avatar_url || json.data.profile_image
      });
      
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      // Fallback to auth data
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) {
          console.error('Error getting user:', error);
          return;
        }
        
        if (user) {
          setUser({
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
            avatar_url: user.user_metadata?.avatar_url || user.identities?.[0]?.identity_data?.avatar_url
          });
        }
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
      }
    }
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      
      setUser(null);
      setIsUserMenuOpen(false);
      router.push('/');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  // Toggle user menu
  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
    setIsSignInOpen(false);
    setOpen(false);
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isUserMenuOpen && !target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
      if (isSignInOpen && !target.closest('.sign-in-container')) {
        setIsSignInOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isSignInOpen]);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Check user session on component mount
  useEffect(() => {
    checkUserSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event:any, session:any) => {
        if (event === 'SIGNED_IN' && session) {
          await fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-7xl px-4">
          <nav
            aria-label="Main"
            className="mt-3 flex h-14 items-center justify-between rounded-2xl border border-black/10 bg-gradient-to-b from-white/70 to-white/40 px-3 shadow-[0_2px_24px_rgba(0,0,0,0.08)] backdrop-blur-xl dark:border-white/10 dark:from-[#111111]/70 dark:to-[#111111]/40"
          >
            <Link href="/" className="flex items-center gap-1 rounded-lg px-1 py-1">
              <Image
                src={`/assets/logo.png`}
                alt="Zero Logo"
                width={28}
                height={28}
                className="w-7 h-7"
                priority
              />
              <span className="text-lg font-semibold tracking-tight">Zero</span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden items-center gap-8 md:flex">
              {links.map((l) => (
                <li key={l.name}>
                  <Link
                    href={l.href}
                    className="group relative text-sm text-black/80 transition hover:text-black dark:text-white/80 dark:hover:text-white"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop Auth Section */}
            <div className="hidden items-center gap-2 md:flex">
              {isLoading ? (
                <div className="h-8 w-20 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              ) : user ? (
                <div className="user-menu-container relative">
                  <button
                    type="button"
                    onClick={toggleUserMenu}
                    className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                    aria-expanded={isUserMenuOpen}
                  >
                    {user.avatar_url ? (
                      <Image
                        src={user.avatar_url}
                        alt="Avatar"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center text-white text-xs">
                        {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="max-w-24 truncate">
                      {user.full_name || user.email.split('@')[0]}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <div className="border-b border-gray-100 px-4 py-2 dark:border-gray-700">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link 
                        href="/account" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-green-900/20"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Account
                      </Link>
                      <Link 
                        href="/orders" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 dark:text-gray-300 dark:hover:bg-green-900/20"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <button 
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut className="mr-2 size-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  type="button"
                  onClick={toggleSignIn}
                  className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                >
                  Sign in
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="md:hidden inline-flex items-center justify-center rounded-lg p-2"
            >
              <Hamburger open={open} />
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="fixed inset-x-0 top-[4.25rem] z-50 mx-auto w-[min(92%,40rem)] overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/95 text-white shadow-2xl md:hidden"
              initial={{ y: -16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -16, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", damping: 24, stiffness: 260 }}
            >
              <div className="p-2">
                <ul className="divide-y divide-white/10">
                  {links.map((l, i) => (
                    <motion.li
                      key={l.name}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 * i }}
                    >
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-4 py-3 text-base hover:bg-white/5"
                      >
                        {l.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                
                {/* Mobile Auth Buttons */}
                <div className="mt-2 p-2">
                  {isLoading ? (
                    <div className="h-12 w-full animate-pulse rounded bg-gray-700" />
                  ) : user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-xl border border-white/15 px-4 py-3">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt="Avatar"
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="h-6 w-6 rounded-full bg-green-600 flex items-center justify-center text-white text-sm">
                            {user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {user.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Link
                          href="/account"
                          onClick={() => setOpen(false)}
                          className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium hover:bg-white/5"
                        >
                          Account
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            handleSignOut();
                            setOpen(false);
                          }}
                          className="rounded-xl border border-red-500/50 px-4 py-3 text-center text-sm font-medium text-red-400 hover:bg-red-500/10"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          toggleSignIn();
                          setOpen(false);
                        }}
                        className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium hover:bg-white/5"
                      >
                        Sign in
                      </button>
                      <Link
                        href="/dashboard"
                        onClick={() => setOpen(false)}
                        className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-white/90"
                      >
                        Dashboard
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Sign In Modal/Drawer */}
      {isSignInOpen && (
        <div className="sign-in-container">
          <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
        </div>
      )}

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <div className="relative h-6 w-5" aria-hidden="true">
      <span
        className={`absolute left-0 right-0 top-1 block h-[2px] rounded bg-current transition-all duration-300 ease-in-out ${
          open ? "translate-y-2 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 right-0 top-1/2 block h-[2px] -translate-y-1/2 rounded bg-current transition-all duration-200 ease-in-out ${
          open ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        className={`absolute left-0 right-0 bottom-1 block h-[2px] rounded bg-current transition-all duration-300 ease-in-out ${
          open ? "-translate-y-2 -rotate-45" : ""
        }`}
      />
    </div>
  );
}