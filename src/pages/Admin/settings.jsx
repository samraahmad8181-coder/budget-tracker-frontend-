import React, { useEffect, useRef, useState } from "react";
import { User, Mail, Lock, LogOut, Sun, Moon, Trash2, Save, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/userContext"; // adjust path to match your project structure

const API_URL = "http://localhost:3000/api/auth";

export default function Settings() {
    const navigate = useNavigate();

    // Profile — now sourced from shared context instead of local state
    const { user, setUser, loading } = useUser();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [savingProfile, setSavingProfile] = useState(false);

    const fileInputRef = useRef(null);
    const pickerHandledRef = useRef(false);
    const focusHandlerRef = useRef(null);

    // Password
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);

    // Theme
    const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

    // Delete account
    const [deletingAccount, setDeletingAccount] = useState(false);

    // Feedback
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // Sync local form fields whenever the context user loads or changes
    useEffect(() => {
        if (user) {
            setUsername(user.username || "");
            setEmail(user.email || "");
        }
    }, [user]);

    // Redirect to login if the context finished loading with no user
    useEffect(() => {
        if (!loading && !user) {
            navigate("/");
        }
    }, [loading, user, navigate]);

    // Native "cancel" event isn't exposed as a React prop, so bind it directly
    useEffect(() => {
        const input = fileInputRef.current;
        if (!input) return;

        input.addEventListener("cancel", handleFileDialogCancel);
        return () => input.removeEventListener("cancel", handleFileDialogCancel);
    });

    // Apply theme
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Clean up avatar preview URL + any pending picker listener
    useEffect(() => {
        return () => {
            if (avatarPreview) URL.revokeObjectURL(avatarPreview);
            if (focusHandlerRef.current) window.removeEventListener("focus", focusHandlerRef.current);
        };
    }, [avatarPreview]);

    // Saves username/email, and uploads a new avatar if one was picked
    const saveProfile = async (avatarFile) => {
        setSavingProfile(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`${API_URL}/profile`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to update profile");

            let updatedUser = data.user;

            if (avatarFile) {
                const formData = new FormData();
                formData.append("profileImage", avatarFile);

                const imageRes = await fetch(`${API_URL}/profile/image`, {
                    method: "PUT",
                    credentials: "include",
                    body: formData,
                });
                const imageData = await imageRes.json();

                if (!imageRes.ok) throw new Error(imageData.message || "Failed to upload photo");

                updatedUser = imageData.user;
            }

            // Pushed into shared context, so AppSidebar (and anything else
            // reading useUser) picks up the new avatar/name immediately
            setUser(updatedUser);
            setAvatarPreview(null);
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.message);
        } finally {
            setSavingProfile(false);
        }
    };

    // Clicking "Update Profile" opens the OS file browser first.
    // Picking a photo (or dismissing the dialog) then saves everything.
    const handleUpdateProfileClick = () => {
        pickerHandledRef.current = false;
        fileInputRef.current.value = "";
        fileInputRef.current.click();

        // Fallback for browsers that don't fire a "cancel" event on the
        // file input: if the window regains focus and no file change
        // came through shortly after, treat it as a skipped selection.
        const handleWindowFocus = () => {
            setTimeout(() => {
                if (!pickerHandledRef.current) {
                    pickerHandledRef.current = true;
                    saveProfile(null);
                }
            }, 300);
        };
        focusHandlerRef.current = handleWindowFocus;
        window.addEventListener("focus", handleWindowFocus, { once: true });
    };

    const handleFileChange = (e) => {
        pickerHandledRef.current = true;

        const file = e.target.files[0];
        if (file) {
            setAvatarPreview(URL.createObjectURL(file));
            saveProfile(file);
        } else {
            saveProfile(null);
        }
    };

    const handleFileDialogCancel = () => {
        pickerHandledRef.current = true;
        saveProfile(null);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all password fields.");
            return;
        }
        if (newPassword.length < 6) {
            setError("New password must be at least 6 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }

        try {
            setChangingPassword(true);

            const res = await fetch(`${API_URL}/password`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to change password");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowPasswordModal(false);
            setMessage("Password changed successfully.");
        } catch (err) {
            setError(err.message);
        } finally {
            setChangingPassword(false);
        }
    };

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Logout failed");

            setUser(null);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete your account? This action cannot be undone."
        );
        if (!confirmed) return;

        try {
            setDeletingAccount(true);
            setMessage("");
            setError("");

            const res = await fetch(`${API_URL}/account`, { method: "DELETE", credentials: "include" });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to delete account");

            setUser(null);
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setDeletingAccount(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-[#111111] text-gray-900 dark:text-white">
                <p className="text-sm text-neutral-400">Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 px-4 py-8 text-gray-900 transition-colors duration-300 dark:bg-[#111111] dark:text-white sm:px-6">
            <div className="mx-auto max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="mt-1 text-sm text-neutral-500">Manage your account and dashboard preferences.</p>
                </div>

                {message && (
                    <div className="mb-5 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-400">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* MY PROFILE */}
                <section className="rounded-xl border border-gray-200 bg-white dark:border-[#292D33] dark:bg-[#191C20]">
                    <div className="border-b border-gray-200 px-6 py-5 dark:border-[#292D33]">
                        <h2 className="text-lg font-semibold">My Profile</h2>
                        <p className="mt-1 text-sm text-neutral-500">Manage your personal account information.</p>
                    </div>

                    <div className="p-6">
                        <div className="mb-7 flex items-center gap-4">
                            <img
                                src={avatarPreview || user?.profileImage || `https://ui-avatars.com/api/?name=${username}`}
                                alt="Profile"
                                className="h-16 w-16 shrink-0 rounded-full border object-cover"
                            />
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />

                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{username}</p>
                                <p className="text-xs text-neutral-500">
                                    {user?.role === "admin" ? "Administrator" : "User"}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-300">Username</label>
                                <div className="relative">
                                    <User size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#00D5C8] dark:border-[#353A42] dark:bg-[#111315] dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-300">Email</label>
                                <div className="relative">
                                    <Mail size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2.5 pl-10 pr-3 text-sm text-gray-900 outline-none transition focus:border-[#00D5C8] dark:border-[#353A42] dark:bg-[#111315] dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="button"
                                onClick={handleUpdateProfileClick}
                                disabled={savingProfile}
                                className="flex items-center gap-2 rounded-lg bg-[#00D5C8] px-5 py-2.5 text-sm font-semibold text-[#101315] transition hover:bg-[#12E4D7] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Save size={16} />
                                {savingProfile ? "Saving..." : "Update Profile"}
                            </button>
                        </div>
                    </div>
                </section>

                {/* ACCOUNT SECURITY */}
                <section className="mt-6 rounded-xl border border-gray-200 bg-white dark:border-[#292D33] dark:bg-[#191C20]">
                    <div className="border-b border-gray-200 px-6 py-5 dark:border-[#292D33]">
                        <h2 className="text-lg font-semibold">Account Security</h2>
                        <p className="mt-1 text-sm text-neutral-500">Manage your password and account access.</p>
                    </div>

                    <div className="divide-y divide-gray-200 dark:divide-[#292D33]">
                        <div className="flex items-center justify-between px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#25282D]">
                                    <Mail size={18} className="text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                                    <p className="mt-1 text-xs text-neutral-500">{email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-6 py-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#25282D]">
                                    <Lock size={18} className="text-neutral-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
                                    <p className="mt-1 text-xs text-neutral-500">Keep your account secure.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold transition dark:bg-[#25282D]"
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="flex items-center justify-between px-6 py-5">
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Log out</p>
                                <p className="mt-1 text-xs text-neutral-500">Sign out of your current account.</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-xs font-semibold transition dark:bg-[#25282D]"
                            >
                                <LogOut size={15} />
                                Log out
                            </button>
                        </div>
                    </div>
                </section>

                {/* APPEARANCE */}
                <section className="mt-6 rounded-xl border border-gray-200 bg-white transition-colors duration-300 dark:border-[#292D33] dark:bg-[#191C20]">
                    <div className="border-b border-gray-200 px-6 py-5 dark:border-[#292D33]">
                        <h2 className="text-lg font-semibold">Appearance</h2>
                        <p className="mt-1 text-sm text-neutral-500">Choose how your dashboard looks.</p>
                    </div>

                    <div className="flex items-center justify-between px-6 py-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-[#25282D]">
                                {theme === "dark" ? <Moon size={18} className="text-[#00D5C8]" /> : <Sun size={18} className="text-[#00D5C8]" />}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">Theme</p>
                                <p className="mt-1 text-xs text-neutral-500">
                                    Currently using {theme === "dark" ? "Dark" : "Light"} mode.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className={`relative h-7 w-14 rounded-full transition-colors duration-200 ${theme === "dark" ? "bg-[#00D5C8]" : "bg-gray-300"}`}
                        >
                            <span
                                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${theme === "dark" ? "translate-x-8" : "translate-x-1"}`}
                            />
                        </button>
                    </div>
                </section>

                {/* DANGER ZONE */}
                <section className="mt-6 rounded-xl border border-red-200 bg-white dark:border-red-900/40 dark:bg-[#191C20]">
                    <div className="border-b border-red-200 px-6 py-5 dark:border-red-900/40">
                        <h2 className="text-lg font-semibold text-red-400">Danger Zone</h2>
                        <p className="mt-1 text-sm text-neutral-500">Permanent actions for your account.</p>
                    </div>

                    <div className="flex items-center justify-between px-6 py-5">
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Delete Account</p>
                            <p className="mt-1 max-w-xl text-xs text-neutral-500">
                                Permanently delete your account and remove access to the dashboard. This action cannot be undone.
                            </p>
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            disabled={deletingAccount}
                            className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-400 transition hover:bg-red-500/20 disabled:opacity-50"
                        >
                            <Trash2 size={15} />
                            {deletingAccount ? "Deleting..." : "Delete Account"}
                        </button>
                    </div>
                </section>
            </div>

            {/* CHANGE PASSWORD MODAL */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white shadow-2xl dark:border-[#353A42] dark:bg-[#191C20]">
                        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5 dark:border-[#292D33]">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Change Password</h2>
                                <p className="mt-1 text-xs text-neutral-500">Update your account password.</p>
                            </div>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-neutral-500 transition hover:text-gray-900 dark:hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <form onSubmit={handlePasswordChange} className="space-y-4 p-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-300">Current Password</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00D5C8] dark:border-[#353A42] dark:bg-[#111315] dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-300">New Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00D5C8] dark:border-[#353A42] dark:bg-[#111315] dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-neutral-300">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-[#00D5C8] dark:border-[#353A42] dark:bg-[#111315] dark:text-white"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordModal(false)}
                                    className="rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-gray-100 dark:hover:bg-[#25282D]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={changingPassword}
                                    className="rounded-lg bg-[#00D5C8] px-4 py-2.5 text-sm font-semibold text-[#101315] hover:bg-[#12E4D7] disabled:opacity-50"
                                >
                                    {changingPassword ? "Updating..." : "Update Password"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}