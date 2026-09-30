"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";

export default function AdminRegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!fullName || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      // Points to the separate admin registration endpoint
      const response = await fetch("http://localhost:5000/api/admin/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Admin registration failed");
      }

      setSuccess("Admin account created successfully! Redirecting to admin login...");
      setTimeout(() => {
        router.push("/admin/login"); // Redirects strictly to the admin login page
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Is the backend server running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0E11] px-4 py-8 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#111315] shadow-2xl lg:grid-cols-2">
        
        {/* LEFT BRANDING */}
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
            <h2 className="max-w-md text-4xl font-bold leading-tight text-white">
              System oversight.
              <br />
              Secure management.
              <br />
              Absolute control.
            </h2>
            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
              Manage platform users, oversee trading activities, and maintain
              system operations from the administrative gateway.
            </p>
          </div>
          <div className="relative flex items-center gap-2 text-xs text-zinc-500">
            <ShieldAlert className="h-4 w-4 text-red-500" />
            Restricted Access: Administrator Registration
          </div>
        </div>

        {/* REGISTER FORM */}
        <div className="p-6 sm:p-10">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold text-red-400 mb-3 border border-red-500/20">
              <ShieldAlert className="h-3.5 w-3.5" />
              Admin Portal
            </div>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Create Admin Account
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Register a new system administrator credentials.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 p-3 text-sm text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter admin full name"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@pipmaster.com"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-zinc-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a secure password"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <p className="mt-2 text-xs text-zinc-600">
                Use at least 6 characters.
              </p>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating admin account...
                </>
              ) : (
                <>
                  Create admin account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an admin account?{" "}
            <Link
              href="/admin/login"
              className="font-semibold text-red-500 hover:text-red-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}