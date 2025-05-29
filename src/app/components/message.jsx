"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Message() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const authToken = process.env.NEXT_PUBLIC_CHALLENGE_AUTH;

  useEffect(() => {
    if (id && authToken) {
      fetch(`/api/messages?id=${id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then(async (res) => {
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Error fetch message.");
          };

          return res.json();
        })
        .then((data) => {
          if (data?.message) {
            setMessage(data.message);
          } else {
            setError("Not found message.");
          };
        })
        .catch((err) => {
          console.error("Fetch error:", err);
          setError(err.message || "Error not found.");
        });
    } else if (!authToken) {
      setError("Error authentication.");
    };
  }, [id, authToken]);

  return (
    <div className="mt-(--m)">
      <div className="relative box-border rounded-lg bg-white bg-[linear-gradient(#f5f5f0_1.1rem,_#ccc_1.2rem)] bg-[length:100%_1.2rem] leading-[1.2rem] pt-[1.2rem] pr-2 pl-[4.5rem] pb-2 shadow-sm mb-(--m)">
        <div className="absolute border-l border-red-400 h-full left-[3.3rem] top-0" />
        <textarea
          readOnly
          name="message"
          placeholder="Loading..."
          value={message}
        />
      </div>
      {error && (
        <div className="text-sm text-(--red) mb-(--m)">
          <strong>Error: {error}</strong>
        </div>
      )}
    </div>
  );
};