"use client";
import { useState } from "react";

export default function Form() {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div>
      <div className="card">
        <div className="margin"></div>
        <textarea placeholder="Enter message here..." />
      </div>

      <div className="buttons">
        <button className="create">
          Create notate
        </button>

        <button onClick={() => setShowMenu(prev => !prev)}>
          Settings
        </button>
      </div>

      <div className={`settings ${showMenu ? "show" : ""}`}>
        <div className="box">
          <div className="input">
            <label>
              <h3>Self-destruction of the note</h3>
              <span>Set the time after which the note is to be destroyed</span>
              <select defaultValue="">
                <option value="" disabled>
                  Select time
                </option>

                <option value="seen">After seen</option>
                <option value="hour">After hour</option>
                <option value="24h">After 24 hours</option>
                <option value="7d">After 7 days</option>
                <option value="30d">After 30 days</option>
              </select>
            </label>
          </div>

          <div className="input">
            <label>
              <h3>Notification of destruction</h3>
              <span>Email for note destruction notification</span>
              <input
                type="email"
                placeholder="Email"
              />
            </label>
          </div>
        </div>

        <div className="box">
          <div className="input">
            <label>
              <h3>Set password</h3>
              <span>Enter your own password to encrypt the note</span>
              <input
                type="password"
                placeholder="Password"
              />
            </label>
          </div>

          <div className="input">
            <label>
              <h3>Repeat password</h3>
              <span>Confirm password</span>
              <input
                type="password"
                placeholder="Confirmation"
              />
            </label>
          </div>
        </div>

      </div>
    </div>
  );
};