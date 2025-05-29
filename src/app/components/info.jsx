"use client";
import { useState } from "react";

import QuestionMark from "styles/icons/question-mark";

export default function Info() {
  const [showManual, setShowManual] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2>New Note</h2>
        <button
          onClick={() => setShowManual((prev) => !prev)}
          className="bg-transparent p-0.5"
          aria-expanded={showManual}
          aria-controls="manual-content"
        >
          <QuestionMark />
        </button>
      </div>

      <aside className={`${showManual ? "opacity-100" : "max-h-0 opacity-0 p-0 mb-0"}`}>
        <p>
          Using Enigma, you can send notes that will be automatically destroyed
          after reading.
        </p>
        <ol>
          <li>Write a note in the box below, encrypt and receive the link.</li>
          <li>Send the link to the person you want to forward the message to.</li>
          <li>
            The note will self-destruct after being read by the recipient.
          </li>
        </ol>
        <p>
          After clicking on “Settings” you can manually set the password to
          encrypt the note, the expiration time and activate the notification
          when it is destroyed.
        </p>
      </aside>
    </div>
  );
};