"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Script from "next/script";

import { createApolloClient } from "client/client";
import { DELETE_MESSAGE } from "client/mutations";
import { GET_MESSAGE,  } from "client/query";

import Loader from "./loader";

export default function Message() {
  const [turnstileToken, setTurnstileToken] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    window.javascriptCallback = function (token) {
      setTurnstileToken(token);
    };
  }, []);

  useEffect(() => {
    if (!turnstileToken) return;

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
          variables: { id },
        });

        const content = data?.getMessage?.message;

        if (content) {
          setMessage(content);
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
  }, [turnstileToken, id]);

  const handleDelete = async () => {
    if (!turnstileToken || !id) return;
    setDeleting(true);
    setError("");
    try {
      const client = createApolloClient(turnstileToken);
      await client.mutate({
        mutation: DELETE_MESSAGE,
        variables: { id },
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
      <div className="flex items-center justify-between h-15">
        <h2>Notate</h2>
      </div>

      <div>
        <div className="notebook">
          <div className="top-0 h-full left-13 absolute border-l border-(--red)" />
          <textarea readOnly name="message" placeholder={loading ? "Loading..." : "No message"} value={message} />
        </div>

        <div className="mb-6 flex space-x-4 items-center justify-between h-15">
          <button className="w-40 py-2 px-4 bg-(--blue) text-(--gray)" onClick={handleDelete} disabled={loading || deleting}>
            {(loading || deleting) ? <Loader /> : "Delete note"}
          </button>

          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-callback="javascriptCallback"
            data-theme="dark"
          />

          <div className="w-40 h-15" />
        </div>

        {error && (
          <div className="text-sm text-(--red) mb-(--m)">
            <strong>Error: {error}</strong>
          </div>
        )}
      </div>
    </div>
  );
};