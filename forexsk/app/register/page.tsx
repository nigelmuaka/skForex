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
  CheckCircle2,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Public registration should create trader accounts.
  // Admin accounts must NEVER be selectable here.
  const role = "trader";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (cleanName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Registration failed."
        );
      }

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to create account. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0E11] px-4 py-8 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#111315] shadow-2xl lg:grid-cols-2">

        {/* LEFT BRANDING */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-yellow-500/20 via-[#15181C] to-[#0B0E11] p-10 lg:flex lg:flex-col lg:justify-between">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-yellow-500/10 blur-3xl" />

          <div className="relative">
            <h1 className="text-3xl font-black tracking-wide text-yellow-500">
              PIPMASTER
            </h1>

            <p className="mt-1 text-xs tracking-[0.3em] text-zinc-500">
              TRADING TERMINAL
            </p>
          </div>

          <div className="relative">
            <h2 className="max-w-md text-4xl font-bold leading-tight text-white">
              Trade smarter.
              <br />
              Learn faster.
              <br />
              Grow with confidence.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
              Create your personal PIPMASTER trading account
              and access your own dashboard.
            </p>
          </div>

          <div className="relative flex items-center gap-2 text-xs text-zinc-500">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            Secure session-based account authentication
          </div>
        </div>

        {/* REGISTER FORM */}
        <div className="p-6 sm:p-10">

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Register your personal PIPMASTER trading account.
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

          <form
            onSubmit={handleRegister}
            className="space-y-4"
          >

            {/* ACCOUNT TYPE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Account Type
              </label>

              <div className="rounded-xl border border-yellow-500/40 bg-yellow-500/10 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-yellow-500 text-black">
                    <User className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-yellow-500">
                      Trader Account
                    </p>

                    <p className="text-xs text-zinc-500">
                      Your account will receive its own demo wallet.
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
                  onChange={(event) =>
                    setFullName(event.target.value)
                  }
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
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
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
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
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="absolute right-3 top-3 text-zinc-500 hover:text-white"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
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
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 font-bold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Already have an account?{" "}

            <Link
              href="/login"
              className="font-semibold text-yellow-500 hover:text-yellow-400"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}