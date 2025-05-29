"use client";
import { useState } from "react";
import Script from "next/script";

import Info from "./info";
import Loader from "./loader";

const mapExpiresAt = (value) => {
  switch (value) {
  case "after seen":
    return "after seen";
  case "after hour":
    return "after hour";
  case "after 24h":
    return "after 24h";
  case "after 7d":
    return "after 7d";
  case "after 30d":
    return "after 30d";
  default:
    return value;
  }
};

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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formState = new FormData(e.target);
    const turnstileRes = formState.get("cf-turnstile-response");
    if (!turnstileRes || turnstileRes === "error") {
      setError("Turnstile verification failed.");
      setLoading(false);
      return;
    }

    try {
      const authToken = process.env.NEXT_PUBLIC_CHALLENGE_AUTH;
      const challengeRes = await fetch("/api/challenge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({ token: turnstileRes })
      });
      if (!challengeRes.ok) {
        throw new Error("Turnstile challenge failed");
      }

      const graphqlQuery = {
        query: `
          mutation CreateMessage(
            $message: String!
            $password: String
            $email: String
            $expires_at: String!
          ) {
            createMessage(
              message: $message
              password: $password
              email: $email
              expires_at: $expires_at
            ) {
              id
            }
          }
        `,
        variables: {
          message: formData.message,
          password: formData.password || "",
          email: formData.email || "",
          expires_at: mapExpiresAt(formData.expires_at)
        }
      };

      const graphqlToken = process.env.NEXT_PUBLIC_MESSAGE_AUTH;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${graphqlToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(graphqlQuery)
      });

      const { data, errors } = await res.json();
      if (errors && errors.length) {
        throw new Error(errors[0].message);
      }
      const newId = data.createMessage.id;
      if (!newId) {
        throw new Error("No ID returned from server");
      }

      setMessageId(newId);
      setFormData({ message: "", expires_at: "seen", email: "", password: "" });
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    const link = `${window.location.origin}/message?id=${messageId}`;
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      alert("Failed to copy link.");
    }
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
              <a
                href={`/message?id=${messageId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {typeof window !== "undefined"
                  ? `${window.location.origin}/message?id=${messageId}`
                  : ""}
              </a>
            </p>
          </aside>

          <button
            className="w-40 py-2 px-4 bg-(--blue) text-(--gray)"
            onClick={handleCopy}
          >
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
              <button
                className="w-40 py-2 px-4 bg-(--blue) text-(--gray)"
                type="submit"
                disabled={loading}
              >
                {loading ? <Loader /> : "Create note"}
              </button>

              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-callback="javascriptCallback"
                data-theme="dark"
              />

              <button
                className="w-40 py-2 px-4 text-(--blue)"
                type="button"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                Settings
              </button>
            </div>

            {error && (
              <div className="mb-6 text-sm text-(--red)">
                <strong>Error: {error}</strong>
              </div>
            )}

            <aside
              className={`${
                showMenu
                  ? "opacity-100"
                  : "mb-0 p-0 max-h-0 opacity-0"
              }`}
            >
              <div className="flex gap-2.5">
                <div className="w-1/2">
                  <label>
                    <h4>Self-destruction of the note</h4>
                    <span>
                      Set the time after which the note is to be destroyed
                    </span>
                    <select
                      name="expires_at"
                      value={formData.expires_at}
                      onChange={handleChange}
                      required
                    >
                      <option value="after seen">After seen</option>
                      <option value="after hour">After hour</option>
                      <option value="after 24h">After 24 hours</option>
                      <option value="after 7d">After 7 days</option>
                      <option value="after 30d">After 30 days</option>
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
                    <input
                      type="password"
                      name="password"
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                    />
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
}
