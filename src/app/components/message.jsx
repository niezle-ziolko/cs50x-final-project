"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Message() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const authToken = process.env.NEXT_PUBLIC_MESSAGE_AUTH;

  console.log(id);

  useEffect(() => {
    if (!id) return;

    const fetchMessage = async () => {
      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`
          },
          body: JSON.stringify({
            query: `
              query GetMessage($id: ID!) {
                getMessage(id: $id) {
                  message
                }
              }
            `,
            variables: { id }
          }),
        });

        const result = await response.json();

        if (result.errors) {
          throw new Error(result.errors[0]?.message || "GraphQL error");
        }

        const content = result.data?.getMessage?.message;

        if (content) {
          setMessage(content);
        } else {
          setError("Not found message.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching message.");
      }
    };

    fetchMessage();
  }, [id, authToken]);

  return (
    <div className="mt-(--m)">
      <div className="notebook">
        <div className="top-0 h-full left-13 absolute border-l border-(--red)" />
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
}