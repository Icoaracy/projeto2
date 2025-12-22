import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./globals.css";

// Import DOMPurify for client-side sanitization
import DOMPurify from 'dompurify';

// Make DOMPurify available globally for security utilities
if (typeof window !== 'undefined') {
  window.DOMPurify = DOMPurify;
}

createRoot(document.getElementById("root")!).render(<App />);