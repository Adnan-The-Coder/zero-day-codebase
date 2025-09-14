"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SignIn from './auth/Sign-in';
import { API_ENDPOINTS } from '@/config/api';

import { supabase } from '@/utils/supabase/client';
import { LogOut } from "lucide-react";
import { useUser } from '@/utils/hooks/useUser';


const links = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Help Center", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading: userLoading } = useUser();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const isLoading = userLoading;
  const router = useRouter();

  const toggleSignIn = () => {
    setIsSignInOpen(!isSignInOpen);
    // Close other menus when opening sign-in
    setIsUserMenuOpen(false);
    setOpen(false);
  };

  // Handle sign out
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        return;
      }
      
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
                alt="Z3RO Logo"
                width={28}
                height={28}
                className="w-7 h-7"
                priority
              />
              <span className="text-lg font-semibold tracking-tight">Z3RO</span>
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
                    className="flex items-center gap-2 rounded-md border border-gray-200 text-black bg-white px-2 py-1.25 text-sm font-medium transition-colors"
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
                    <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-md border border-[#171717] bg-[#0f0e0e] py-2 shadow-lg">
                      <div className="border border-[#171717] px-4 py-2">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user.full_name || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Link 
                        href="/account" 
                        className="block px-4 py-2 text-sm text-white hover:text-white/80"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Account
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
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black transition-colors hover:bg-white/90"
                >
                  Sign in
                </button>
              )}
                <Link 
                  href={`/dashboard`}
                  className="rounded-md bg-white px-3 py-1.5 text-sm font-medium text-black hover:bg-white/90 hover:translate-x-[1px] transition"
                >
                  Dashboard
                </Link>
            </div>
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
                        {/* <Link
                          href="/account"
                          onClick={() => setOpen(false)}
                          className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium hover:bg-white/5"
                        >
                          Account
                        </Link> */}
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
          <SignIn isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} redirectUrl="/dashboard"/>
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