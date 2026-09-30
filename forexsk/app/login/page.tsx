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
  ShieldCheck,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            email: cleanEmail,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Invalid email or password."
        );
      }

      /*
       * ONLY TRADERS CAN ENTER THE TRADING DASHBOARD.
       *
       * Admins should use the admin login/dashboard.
       */
      if (data.role === "trader") {
        router.replace("/dashboard");
        return;
      }

      if (data.role === "admin") {
        router.replace("/admin");
        return;
      }

      setError(
        "This account does not have permission to access the trading dashboard."
      );
    } catch (err: any) {
      setError(
        err?.message ||
          "Something went wrong. Please make sure the server is running."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0B0E11] px-4 py-8 text-white">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-zinc-800 bg-[#111315] shadow-2xl lg:grid-cols-2">

        {/* BRANDING */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-yellow-500/20 via-[#15181C] to-[#0B0E11] p-10 lg:flex lg:flex-col lg:justify-between">

          <div>
            <h1 className="text-3xl font-black tracking-wide text-yellow-500">
              PIPMASTER
            </h1>

            <p className="mt-1 text-xs tracking-[0.3em] text-zinc-500">
              TRADING TERMINAL
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Welcome back
              <br />
              trader.
            </h2>

            <p className="mt-5 max-w-md text-sm leading-6 text-zinc-400">
              Sign in to access your personal trading
              dashboard, wallet and account information.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            Secure session-based authentication
          </div>
        </div>

        {/* LOGIN */}
        <div className="p-6 sm:p-10">

          <div className="mb-8">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Sign in to PIPMASTER
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Enter your account details to continue.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

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
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-4 text-sm outline-none placeholder:text-zinc-600 focus:border-yellow-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-zinc-300">
                  Password
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs text-yellow-500 hover:text-yellow-400"
                >
                  Forgot password?
                </Link>
              </div>

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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="h-12 w-full rounded-xl border border-zinc-700 bg-[#0B0E11] pl-11 pr-12 text-sm outline-none placeholder:text-zinc-600 focus:border-yellow-500"
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
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-zinc-500">
            Don't have an account?{" "}

            <Link
              href="/register"
              className="font-semibold text-yellow-500 hover:text-yellow-400"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}