"use client";

import { toggleTheme } from "@/lib/machine";

export default function ThemeToggle() {
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      onClick={toggleTheme}
    >
      <span aria-hidden="true">◐</span>
    </button>
  );
}
