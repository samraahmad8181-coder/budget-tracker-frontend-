import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/auth";

export default function LoginScreen() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,

                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Invalid email or password."
                );
            }

            console.log("Login successful:", data);

            // Go to dashboard after successful login
            navigate("/admin");

        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black font-sans select-none">

            {/* Background Decorative Glows */}
            <div className="pointer-events-none absolute inset-0 z-0">

                {/* Left Purple Glow */}
                <div className="absolute -left-32 -top-20 h-[800px] w-[600px] rotate-[-45deg] rounded-full bg-gradient-to-r from-purple-900/60 via-purple-700/30 to-transparent blur-[100px]" />

                {/* Right Purple Glow */}
                <div className="absolute -right-32 -top-10 h-[900px] w-[700px] rotate-[12deg] rounded-full bg-gradient-to-l from-purple-800/50 via-purple-600/20 to-transparent blur-[120px]" />

                {/* Bottom Glow */}
                <div className="absolute -bottom-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-t from-purple-900/40 via-purple-800/10 to-transparent blur-[140px]" />

            </div>

            {/* Main Content */}
            <div className="relative z-10 flex w-full max-w-sm flex-col items-center px-6">

                {/* Logo */}
                <div className="mb-10 flex flex-col items-center">

                    {/* Logo Icon */}
                    <div className="mb-3 text-[#00e5be]">

                        <svg
                            className="h-10 w-10"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <circle
                                cx="12"
                                cy="14"
                                r="2"
                                fill="currentColor"
                            />

                            <path
                                d="M16 14H28M28 14L24 10M28 14L24 18"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M24 26H12M12 26L16 22M12 26L16 30"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <circle
                                cx="28"
                                cy="26"
                                r="2"
                                fill="currentColor"
                            />
                        </svg>

                    </div>

                    {/* Logo Text */}
                    <h1 className="flex items-center text-3xl font-extrabold tracking-wider text-white">
                        <span>EX</span>
                        <span className="text-[#00e5be]">
                            PENSIO
                        </span>
                    </h1>

                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-5"
                >

                    {/* Email */}
                    <div className="space-y-2">

                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Email
                        </label>

                        <div className="relative">

                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-transparent bg-[#333333]/80 py-3 pl-10 pr-4 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#00e5be]"
                                required
                            />

                        </div>

                    </div>

                    {/* Password */}
                    <div className="space-y-2">

                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>

                        <div className="relative">

                            <Lock
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            />

                            <input
                                id="password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"

                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                className="w-full rounded-lg border border-transparent bg-[#333333]/80 py-3 pl-10 pr-11 text-white placeholder-gray-500 transition-all duration-200 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#00e5be]"
                                required
                            />

                            {/* Show / Hide Password */}
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                            >
                                {showPassword ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-[#00e5be] px-4 py-3 font-semibold text-black shadow-lg shadow-[#00e5be]/20 transition-all duration-200 hover:bg-[#00c8a6] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

            </div>
        </div>
    );
}