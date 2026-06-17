import React from "react";
import { checkPasswordRules } from "../utils/validation";

const RULES = [
  { key: "length", label: "At least 8 characters" },
  { key: "uppercase", label: "One uppercase letter" },
  { key: "lowercase", label: "One lowercase letter" },
  { key: "number", label: "One number" },
];

const PasswordStrength = ({ password }) => {
  if (!password) return null;
  const results = checkPasswordRules(password);

  return (
    <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs">
      {RULES.map(({ key, label }) => {
        const passed = results[key];
        return (
          <li
            key={key}
            className={`flex items-center gap-1.5 ${passed ? "text-success" : "text-muted"}`}
          >
            <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] ${passed ? "bg-success/20" : "bg-surface2"}`}>
              {passed ? "✓" : "·"}
            </span>
            {label}
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordStrength;