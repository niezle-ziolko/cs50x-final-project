"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Copy() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageLink, setMessageLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  const messageId = searchParams.get("id");

  useEffect(() => {
    if (messageId && typeof window !== "undefined") {
      setMessageLink(`${window.location.origin}/notate?id=${messageId}`);
    }
  }, [messageId]);

  // Copy the message URL to clipboard when requested
  const handleCopy = async () => {
    if (!messageLink) return;
    
    try {
      await navigator.clipboard.writeText(messageLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    } catch {
      alert("Failed to copy link.");
    };
  };

  // Navigate to the created message
  const handleViewMessage = () => {
    if (messageLink) {
      window.open(messageLink, "_blank", "noopener,noreferrer");
    };
  };

  return (
    <div className="mt-6 mb-6">
      <section>
        <p>Your note is ready!</p>
      </section>

      <div className="mb-6 grid md:flex md:h-15 space-x-4 items-center md:justify-between">
        <button className="u11 bg-bl-100 text-g-100" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={handleViewMessage}
          className="u11 text-bl-100"
        >
          View Message
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className="u11 text-bl-100"
        >
          New notate
        </button>
      </div>
    </div>
  );
};