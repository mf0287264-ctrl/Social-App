import React from "react";

export default function Footer() {
  return (
    <div>
      <footer
        style={{ borderTop: "0.5px solid var(--color-border-tertiary)" }}
        className="bg-white py-6 px-8 flex justify-between items-center"
      >
        <p className="text-sm text-gray-400">
          © 2026 LinkedPosts. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
            About
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
            Privacy
          </a>
          <a href="#" className="text-sm text-gray-400 hover:text-gray-600">
            Terms
          </a>
        </div>
      </footer>
    </div>
  );
}
