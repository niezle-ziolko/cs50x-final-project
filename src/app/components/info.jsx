"use client";
import { useState } from "react";
import QuestionMark from "styles/icons/question-mark";

export default function Info() {
  const [showManual, setShowManual] = useState(false);

  return (
    <div className="info">
      <div className="title">
        <h3>New Note</h3>
        <button onClick={() => setShowManual(prev => !prev)}>
          <QuestionMark />
        </button>
      </div>

      <div className={`manual ${showManual ? "show" : ""}`}>
        <p>Using Enigma, you can send notes that will be automatically destroyed after reading.</p>
        <ol>
          <li>Write a note in the box below, encrypt and receive the link.</li>
          <li>Send the link to the person you want to forward the message to.</li>
          <li>The note will self-destruct after being read by the recipient.</li>
        </ol>
        <p>After clicking on “options,” you can manually set the password to encrypt the note, the expiration time and activate the notification when it is destroyed.</p>
      </div>
    </div>
  );
};