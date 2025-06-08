"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Script from "next/script";

import { decryptId, decryptMessage } from "../utils";
import { createApolloClient } from "client/client";
import { DELETE_MESSAGE, VERIFY_PASSWORD } from "client/mutations";
import { useTheme } from "context/theme-context";
import { GET_MESSAGE } from "client/query";

import Loader from "./loader";

export default function Message() {
  const router = useRouter();
  const { isDarkMode } = useTheme();
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [decryptedId, setDecryptedId] = useState(null);

  const [passwordRequired, setPasswordRequired] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const [encryptedMessageData, setEncryptedMessageData] = useState(null);

  // Ref to password form section
  const passwordSectionRef = useRef(null);

  const searchParams = useSearchParams();
  const encryptedId = searchParams.get("id");

  // Set global callback for Turnstile to update token state on successful verification
  useEffect(() => {
    window.javascriptCallback = function (token) {
      setTurnstileToken(token);
    };
  }, []);

  // When encryptedId changes, attempt to decrypt it
  useEffect(() => {
    if (encryptedId) {
      decryptId(encryptedId)
        .then(id => {
          setDecryptedId(id);
        })
        .catch(err => {
          setError("Error decrypting ID: " + err.message);
        });
    };
  }, [encryptedId]);

  // Automatic scroll to password form
  useEffect(() => {
    if (passwordRequired && passwordSectionRef.current) {
      // Use setTimeout to allow time for element rendering
      setTimeout(() => {
        // Slow scroll with longer duration
        const targetElement = passwordSectionRef.current;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (window.innerHeight / 2) + (targetElement.offsetHeight / 2);
        
        // Smooth scroll with controlled speed
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });
        
        // Focus on password field after scroll completion
        setTimeout(() => {
          const passwordInput = passwordSectionRef.current.querySelector("#password");
          if (passwordInput) {
            passwordInput.focus();
          }
        }, 800); // Delay for smooth transition
      }, 200);
    }
  }, [passwordRequired]);

  // When Turnstile token and decrypted ID are available, fetch the message
  useEffect(() => {
    if (!turnstileToken || !decryptedId) return;

    // Handle Turnstile verification failure
    if (turnstileToken === "error") {
      setError("Turnstile verification failed.");
      setLoading(false);

      return;
    };

    // Async function to fetch encrypted message from backend
    const fetchMessage = async () => {
      setLoading(true);
      setError("");
      try {
        const client = createApolloClient(turnstileToken);
        const { data } = await client.query({
          query: GET_MESSAGE,
          variables: { id: decryptedId }
        });

        const encryptedContent = data?.getMessage?.message;

        if (encryptedContent) {
          // Decrypt message content
          try {
            const decryptedContent = await decryptMessage(encryptedContent);

            // Check if decrypted content has a password
            if (typeof decryptedContent === "object" && decryptedContent.password && decryptedContent.password.trim() !== "") {
              // Message is password-protected
              setPasswordRequired(true);
              setEncryptedMessageData(decryptedContent);
            } else if (typeof decryptedContent === "string") {
              setMessage(decryptedContent);
            } else if (typeof decryptedContent === "object") {
              setMessage(decryptedContent.message || JSON.stringify(decryptedContent));
            };
          } catch (decryptError) {
            setError("Error decrypting content: " + decryptError.message);
          };
        } else {
          setError("Message not found.");
        };
      } catch (err) {
        setError(err.message || "Error fetching message.");
      } finally {
        setLoading(false);
      };
    };

    fetchMessage();
  }, [turnstileToken, decryptedId]);

  // Handle form submission for verifying password input
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordInput || !encryptedMessageData) return;

    setVerifyingPassword(true);
    setPasswordError("");

    try {
      // Verify password via backend
      const client = createApolloClient(turnstileToken);

      const { data } = await client.mutate({
        mutation: VERIFY_PASSWORD,
        variables: { 
          id: decryptedId,
          password: passwordInput 
        }
      });

      if (data?.verifyPassword?.message === "Password correct") {
        // Password is correct - show the message
        setMessage(encryptedMessageData.message);
        setPasswordRequired(false);
        setPasswordInput("");
      } else {
        setPasswordError("Incorrect password. Please try again.");
      };
    } catch (err) {
      // Password incorrect: show error
      setPasswordError("Error verifying password: " + err.message);
    } finally {
      setVerifyingPassword(false);
    };
  };

  // Handle deleting the message via backend mutation
  const handleDelete = async () => {
    if (!turnstileToken || !decryptedId) return;
    setDeleting(true);
    setError("");
    try {
      const client = createApolloClient(turnstileToken);
      await client.mutate({
        mutation: DELETE_MESSAGE,
        variables: { id: decryptedId }
      });

      setMessage("The note has been deleted."); // Inform user that note is deleted
      setPasswordRequired(false);
    } catch (err) {
      setError(err.message || "Error deleting message.");
    } finally {
      setDeleting(false);
    };
  };

  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_SITE_KEY;
  
  return (
    <div>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" />
      <div className="h-15 flex items-center justify-between">
        <h2>Notate</h2>
      </div>

      <div>
        <div className="notebook">
          <div className="top-0 h-full left-13 absolute border-1 border-(--color-r-100)" />
          <textarea 
            readOnly 
            name="message" 
            placeholder={loading ? "Loading..." : passwordRequired ? "Enter password to view message" : "No message"} 
            value={passwordRequired ? "" : message} 
          />
        </div>

        <div className="mb-6 grid md:flex md:h-15 space-x-4 items-center md:justify-between">
          <button
            onClick={handleDelete} 
            disabled={loading || deleting || passwordRequired}
            className="u11 bg-bl-100 text-g-100"
          >
            {(loading || deleting) ? <Loader /> : "Delete note"}
          </button>

          <div className="justify-center flex">
            <div
              className="cf-turnstile"
              data-sitekey={TURNSTILE_SITE_KEY}
              data-callback="javascriptCallback"
              data-theme={isDarkMode ? "dark" : "light"}
            />
          </div>

          <div className="md:w-40 md:h-15">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="u11 text-bl-100"
            >
              New notate
            </button>
          </div>
        </div>

        {error || passwordError && (
          <div className="mb-6 text-sm text-r">
            <strong>Error: {error || passwordError}</strong>
          </div>
        )}

        {/* Password form - shown only when required */}
        <section 
          ref={passwordSectionRef}
          className={`${passwordRequired ? "opacity-100" : "mb-0 p-0 max-h-0 opacity-0"}`}
        >
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password">
                <h4>This message is password protected</h4>
                <span>Enter password:</span>
                <input
                  type="password"
                  id="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Password..."
                  disabled={verifyingPassword}
                  className={passwordError ? "border-(--color-r-100)" : ""}
                />
              </label>
            </div>
            
            <div className="p-2">
              <button
                type="submit"
                disabled={verifyingPassword || !passwordInput}
                className="w-full py-2 px-4 bg-bl-100 text-g-100"
              >
                {verifyingPassword ? <Loader /> : "Verify password"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};