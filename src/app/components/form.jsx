"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

import { useTheme } from "context/theme-context";
import { CREATE_MESSAGE } from "client/mutations";
import { createApolloClient } from "client/client";

import Info from "./info";
import Loader from "./loader";

export default function Form() {
  const { isDarkMode } = useTheme(); // Get dark mode status from context
  const router = useRouter(); // Add router for navigation

  // Local state for error messages, loading state, menu toggle, and form fields
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    display: 1,
    email: "",
    password: "",
    confirmPassword: ""
  });

  // Handle changes in input fields: update formData accordingly
  const handleChange = (e) => {
    const { name, value } = e.target;
    const convertedValue = name === "display" ? parseInt(value, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: convertedValue }));
  };

  // Handle form submission: validate, verify turnstile, send mutation
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate that passwords match if provided
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      
      return;
    };

    setLoading(true);

    // Extract Cloudflare Turnstile token from form data
    const formState = new FormData(e.target);
    const turnstileToken = formState.get("cf-turnstile-response");
    console.log(turnstileToken);

    // Check if turnstile token is valid
    if (!turnstileToken || turnstileToken === "error") {
      setError("Turnstile verification failed.");
      setLoading(false);
      
      return;
    };

    try {
      // Create Apollo Client instance with Turnstile token for authentication
      const client = createApolloClient(turnstileToken);

      // Perform GraphQL mutation to create the message/note
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

      // Check if server returned a message ID
      if (!newId) {
        throw new Error("No id returned from server");
      };

      // Redirect to /created page with the message ID as query parameter
      router.push(`/created?id=${newId}`);
      
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    };
  };

  // Boolean indicating if passwords match or if no password set (valid)
  const passwordsMatch = !formData.password || formData.password === formData.confirmPassword;
  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY;

  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
      <div>
        <Info />
        <form onSubmit={handleSubmit}>
          <div className="notebook">
            <div className="top-0 h-full left-13 absolute border-1 border-(--color-r-100)" />
            <textarea name="message" onChange={handleChange} value={formData.message} placeholder="Enter message here..." required />
          </div>

          <div className="mb-6 grid md:flex md:h-15 space-x-4 items-center md:justify-between">
            <button className="u11 bg-bl-100 text-g-100" type="submit" disabled={loading}>
              {loading ? <Loader /> : "Create note"}
            </button>

            <div className="justify-center flex">
              <div
                className="cf-turnstile"
                data-sitekey={TURNSTILE_SITE_KEY}
                data-callback="javascriptCallback"
                data-theme={isDarkMode ? "dark" : "light"}
              />
            </div>

            <button className="u11 text-bl-100" type="button" onClick={() => setShowMenu((prev) => !prev)}>
              Settings
            </button>
          </div>

          {error && (
            <div className="mb-6 text-sm text-r">
              <strong>Error: {error}</strong>
            </div>
          )}

          <section className={`${showMenu ? "opacity-100" : "mb-0 p-0 max-h-0 opacity-0"}`}>
            <div className="u13">
              <div className="u14">
                <label>
                  <h3>Self-destruction of the note</h3>
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

              <div className="u14">
                <label>
                  <h3>Notification of destruction</h3>
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

            <div className="u13">
              <div className="u14">
                <label>
                  <h3>Set password</h3>
                  <span>Enter your own password to encrypt the note</span>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="Password" 
                    value={formData.password} 
                    onChange={handleChange}
                    className={`${!passwordsMatch ? "border-(--color-r-100)" : ""}`}
                  />
                </label>
              </div>

              <div className="u14">
                <label>
                  <h3>Repeat password</h3>
                  <span>Confirm password</span>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    placeholder="Confirmation" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`${!passwordsMatch ? "border-(--color-r-100)" : ""}`}
                  />
                </label>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};