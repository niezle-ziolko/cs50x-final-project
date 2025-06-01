"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

import { decryptId, decryptMessage } from "../utils";
import { createApolloClient } from "client/client";
import { DELETE_MESSAGE } from "client/mutations";
import { useTheme } from "context/theme-context";
import { GET_MESSAGE } from "client/query";

import Loader from "./loader";

export default function Message() {
  const { isDarkMode } = useTheme();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [decryptedId, setDecryptedId] = useState(null);

  const searchParams = useSearchParams();
  const encryptedId = searchParams.get("id");

  useEffect(() => {
    window.javascriptCallback = function (token) {
      setTurnstileToken(token);
    };
  }, []);

  // Odszyfruj ID gdy komponent się ładuje
  useEffect(() => {
    if (encryptedId) {
      decryptId(encryptedId)
        .then(id => {
          setDecryptedId(id);
        })
        .catch(err => {
          setError("Błąd odszyfrowywania ID: " + err.message);
        });
    };
  }, [encryptedId]);

  useEffect(() => {
    if (!turnstileToken || !decryptedId) return;

    if (turnstileToken === "error") {
      setError("Turnstile verification failed.");
      setLoading(false);
      
      return;
    };

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
          // Odszyfruj zawartość wiadomości przed wyświetleniem
          try {
            const decryptedContent = await decryptMessage(encryptedContent);
            setMessage(decryptedContent);
          } catch (decryptError) {
            console.error("Błąd odszyfrowywania zawartości:", decryptError);
            setError("Błąd odszyfrowywania zawartości wiadomości: " + decryptError.message);
          };
        } else {
          setError("Message not found.");
        };
      } catch (err) {
        console.error("GraphQL fetch error:", err);
        setError(err.message || "Error fetching message.");
      } finally {
        setLoading(false);
      };
    };

    fetchMessage();
  }, [turnstileToken, decryptedId]);

  const handleDelete = async () => {
    if (!turnstileToken || !decryptedId) return;
    setDeleting(true);
    setError("");
    try {
      const client = createApolloClient(turnstileToken);
      await client.mutate({
        mutation: DELETE_MESSAGE,
        variables: { id: decryptedId }, // Używamy odszyfrowanego ID
      });

      setMessage("The note has been deleted.");
    } catch (err) {
      console.error("Delete error:", err);
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
          <div className="top-0 h-full left-13 absolute border-l border-(--red)" />
          <textarea readOnly name="message" placeholder={loading ? "Loading..." : "No message"} value={message} />
        </div>

        <div className="h-15 mb-6 flex space-x-4 items-center justify-between">
          <button className="w-40 py-2 px-4 bg-(--blue) text-(--gray)" onClick={handleDelete} disabled={loading || deleting}>
            {(loading || deleting) ? <Loader /> : "Delete note"}
          </button>

          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-callback="javascriptCallback"
            data-theme={isDarkMode ? "dark" : "light"}
          />

          <div className="w-40 h-15" />
        </div>

        {error && (
          <div className="mb-(--m) text-sm text-(--red)">
            <strong>Error: {error}</strong>
          </div>
        )}
      </div>
    </div>
  );
}