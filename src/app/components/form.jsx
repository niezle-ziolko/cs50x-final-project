"use client";
import { useState } from "react";
import Script from "next/script";

import Info from "./info";
import Loader from "./loader";

export default function Form() {
  const [error, setError] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [formData, setFormData] = useState({
    message: "",
    expires_at: "seen",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const formState = new FormData(e.target);
    const turnstileRes = formState.get("cf-turnstile-response");

    if (!turnstileRes || turnstileRes === "error") {
      setError("Turnstile verification failed.");
      return;
    };
    
    try {
      setLoading(true);

      if (!turnstileRes || turnstileRes === "error") {
        setError("Turnstile verification failed.");
        setLoading(false);
        return;
      };

      const authToken = process.env.NEXT_PUBLIC_CHALLENGE_AUTH;

      const response = await fetch("/api/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          token: turnstileRes,
          ...formData
        })
      });

      if (response.ok) {
        setLoading(true);

        const response2 = await fetch("/api/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData)
        });

        if (!response2.ok) {
          throw new Error("Failed to send message");
        };

        const data = await response2.json();
        setMessageId(data.id);
        setFormData({ message: "", expires_at: "seen", email: "", password: "" });
      };
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    };
  };

  const handleCopy = async () => {
    const link = `${window.location.origin}/message?id=${messageId}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      alert("Failed to copy link.");
    };
  };

  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY;

  const primary = "w-1/2";
  const secondary = "flex gap-2.5";

  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
      {messageId ? (
        <div className="mt-(--m) mb-6">
          <aside>
            <p>
              Your note is ready:{" "}
              <a href={`/message?id=${messageId}`} target="_blank" rel="noopener noreferrer">
                {typeof window !== "undefined" ? `${window.location.origin}/message?id=${messageId}` : ""}
              </a>
            </p>
          </aside>

          <button className="w-40 py-2 px-4 bg-(--blue) text-(--gray)" onClick={handleCopy}>
            Copy
          </button>

        </div>
      ) : (
        <div>
          <Info />
          <form onSubmit={handleSubmit}>
            <div className="notebook">
              <div className="top-0 h-full left-13 absolute border-l border-(--red)" />
              <textarea
                required
                name="message"
                onChange={handleChange}
                value={formData.message}
                placeholder="Enter message here..."
              />
            </div>

            <div className="mb-6 flex space-x-4 items-center justify-between">
              <button className="w-40 py-2 px-4 bg-(--blue) text-(--gray)" type="submit" disabled={loading}>
                {loading ? <Loader /> : "Create notate"}
              </button>

              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-callback="javascriptCallback"
                data-theme="dark"
              />

              <button className="w-40 py-2 px-4 text-(--blue)" type="button"onClick={() => setShowMenu((prev) => !prev)}>
                Settings
              </button>
            </div>

            {error && (
              <div className="mb-6 text-sm text-(--red)">
                <strong>Error: {error}</strong>
              </div>
            )}

            <aside className={`${showMenu ? "opacity-100" : "mb-0 p-0 max-h-0 opacity-0"}`}>
              <div className={secondary}>
                <div className={primary}>
                  <label>
                    <h4>Self-destruction of the note</h4>
                    <span>Set the time after which the note is to be destroyed</span>
                    <select name="expires_at" value={formData.expires_at} onChange={handleChange} required>
                      <option value="seen">After seen</option>
                      <option value="hour">After hour</option>
                      <option value="24h">After 24 hours</option>
                      <option value="7d">After 7 days</option>
                      <option value="30d">After 30 days</option>
                    </select>
                  </label>
                </div>

                <div className={primary}>
                  <label>
                    <h4>Notification of destruction</h4>
                    <span>Email for note destruction notification</span>
                    <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                  </label>
                </div>
              </div>

              <div className={secondary}>
                <div className={primary}>
                  <label>
                    <h4>Set password</h4>
                    <span>Enter your own password to encrypt the note</span>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                  </label>
                </div>

                <div className={primary}>
                  <label>
                    <h4>Repeat password</h4>
                    <span>Confirm password</span>
                    <input type="password" placeholder="Confirmation" />
                  </label>
                </div>
              </div>
            </aside>
          </form>
        </div>
      )}
    </div>
  );
};