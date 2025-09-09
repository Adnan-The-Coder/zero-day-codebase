"use client";
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const links = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "Pricing", href: "#pricing" },
  { name: "Help Center", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
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
                alt="Logo"
                width={10000}
                height={10000}
                className="w-7 h-7"
                priority
              />
              <span className="text-lg font-semibold tracking-tight">Zero</span>
            </Link>
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
            <div className="hidden items-center gap-2 md:flex">
              <Link
                href="/login"
                className="rounded-xl border border-black/15 px-4 py-2 text-sm font-medium text-black/80 shadow-sm transition hover:shadow md:block dark:border-white/15 dark:text-white/90"
              >
                Login
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:translate-x-0.5 hover:shadow-lg dark:bg-white dark:text-black"
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
                <div className="mt-2 grid grid-cols-2 gap-2 p-2">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl border border-white/15 px-4 py-3 text-center text-sm font-medium hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-white px-4 py-3 text-center text-sm font-semibold text-black hover:bg-white/90"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
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
