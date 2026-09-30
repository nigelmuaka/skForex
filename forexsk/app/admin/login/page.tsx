"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdminLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your admin email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid login credentials");
      }

      // Restrict login strictly to admin role
      if (data.role !== "admin") {
        throw new Error("Access denied. This portal is restricted to administrators only.");
      }

      // Force a hard navigation load to ensure cookies/sessions sync correctly with the layout group
      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend server running?");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0E11] px-4 py-8 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#111315] shadow-2xl lg:grid-cols-2">
        
        {/* BRANDING */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-red-500/20 via-[#15181C] to-[#0B0E11] p-10 lg:flex lg:flex-col lg:justify-between">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-red-500/10 blur-3xl" />
          <div className="relative">
            <h1 className="text-3xl font-black tracking-wide text-red-500">
              PIPMASTER
            </h1>
            <p className="mt-1 text-xs tracking-[0.3em] text-zinc-500">
              ADMIN CONTROL PORTAL
            </p>
          </div>

          <div className="relative">
            <h2 className="text-4xl font-bold leading-tight">
              System Access
              <br />
              Administrator.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
              Secure administrative terminal for managing users, monitoring trading activities, and updating platform parameters.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-zinc-500">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            Restricted System Login Gateway
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 mb-3 border border-red-500/20">
              <ShieldAlert className="h-3.5 w-3.5" />
              Restricted Area
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              Admin Sign In
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Enter your administrator credentials to proceed.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Admin Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@pipmaster.com"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter admin password"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-12 text-sm outline-none placeholder:text-zinc-600 focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Verifying admin credentials...
                </>
              ) : (
                <>
                  Sign in as Admin
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-500">
            <Link
              href="/login"
              className="font-semibold text-zinc-400 hover:text-white"
            >
              &larr; Back to regular user sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}