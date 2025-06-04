"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LinkPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageLink, setMessageLink] = useState("");
  const [copied, setCopied] = useState(false);
  
  const messageId = searchParams.get("id");

  useEffect(() => {
    if (messageId && typeof window !== "undefined") {
      setMessageLink(`${window.location.origin}/message?id=${messageId}`);
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

  // Navigate to home page to create new note
  const handleNewNote = () => {
    router.push("/");
  };

  // Navigate to the created message
  const handleViewMessage = () => {
    if (messageLink) {
      window.open(messageLink, "_blank", "noopener,noreferrer");
    };
  };

  // CSS utility classes for styling layout
  const button = "w-full md:w-40 py-2 px-4 mr-0 mb-2";

  if (!messageId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl mb-4">No message ID found</h2>
          <button 
            onClick={handleNewNote}
            className={`${button} bg-(--blue) text-(--gray) hover:opacity-80`}
          >
            Create New Note
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-(--m) mb-6">
      <section>
        <p>Your note is ready!</p>
      </section>

      <div className="mb-6 grid md:flex md:h-15 space-x-4 items-center md:justify-between">
        <button className={`${button} bg-(--blue) text-(--gray)`} onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>

        <button
          onClick={handleViewMessage}
          className={`${button} text-(--blue)`}
        >
            View Message
        </button>

        <button
          type="button"
          onClick={() => router.push("/")}
          className={`${button} text-(--blue)`}
        >
              New notate
        </button>
      </div>
    </div>
  );
};