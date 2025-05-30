"use client";
import { useState } from "react";
import Script from "next/script";

import { CREATE_MESSAGE } from "client/mutations";
import { createApolloClient } from "client/client";

import Info from "./info";
import Loader from "./loader";

export default function Form() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [formData, setFormData] = useState({
    message: "",
    display: 1,
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const convertedValue = name === 'display' ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: convertedValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formState = new FormData(e.target);
    const turnstileToken = formState.get("cf-turnstile-response");

    if (!turnstileToken || turnstileToken === "error") {
      setError("Turnstile verification failed.");
      setLoading(false);
      
      return;
    };

    try {
      const client = createApolloClient(turnstileToken);

      const { data } = await client.mutate({
        mutation: CREATE_MESSAGE,
        variables: {
          message: formData.message,
          password: formData.password || "",
          email: formData.email || "",
          display: formData.display
        }
      });

      const newId = data?.createMessage?.id;

      if (!newId) {
        throw new Error("No ID returned from server");
      };

      setMessageId(newId);
      setFormData({ message: "", display: 1, email: "", password: "" });
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
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
              <textarea name="message" onChange={handleChange} value={formData.message} placeholder="Enter message here..." required />
            </div>

            <div className="mb-6 flex space-x-4 items-center justify-between h-15">
              <button className="w-40 py-2 px-4 bg-(--blue) text-(--gray)" type="submit" disabled={loading}>
                {loading ? <Loader /> : "Create note"}
              </button>

              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-callback="javascriptCallback"
                data-theme="dark"
              />

              <button className="w-40 py-2 px-4 text-(--blue)" type="button" onClick={() => setShowMenu((prev) => !prev)}>
                Settings
              </button>
            </div>

            {error && (
              <div className="mb-6 text-sm text-(--red)">
                <strong>Error: {error}</strong>
              </div>
            )}

            <aside className={`${showMenu ? "opacity-100" : "mb-0 p-0 max-h-0 opacity-0"}`}>
              <div className="flex gap-2.5">
                <div className="w-1/2">
                  <label>
                    <h4>Self-destruction of the note</h4>
                    <span>
                      Set the time after which the note is to be destroyed
                    </span>
                    <select name="display" value={formData.display} onChange={handleChange} required>
                      <option value={1}>After seen</option>
                      <option value={2}>After 2 seen</option>
                      <option value={3}>After 3 seen</option>
                      <option value={4}>After 4 seen</option>
                      <option value={5}>After 5 seen</option>
                    </select>
                  </label>
                </div>

                <div className="w-1/2">
                  <label>
                    <h4>Notification of destruction</h4>
                    <span>Email for note destruction notification</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-2.5">
                <div className="w-1/2">
                  <label>
                    <h4>Set password</h4>
                    <span>Enter your own password to encrypt the note</span>
                    <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
                  </label>
                </div>

                <div className="w-1/2">
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