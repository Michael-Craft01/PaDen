```markdown
# PaDen: The Step-by-Step Build Guide

This document outlines our journey to build PaDen, connecting Landlords (Web) and Tenants (WhatsApp). We will tackle this one piece at a time.

## 🏗️ Phase 1: The Foundation (Completed)
**Goal:** Create the workspace and install necessary tools.

*   **Project Initialization (Vite + React):**
    *   **What we did:** Used `create-vite` to set up a React project.
    *   **Why:** React is excellent for building dynamic user interfaces like dashboards. Vite is a super-fast tool that helps us run the "dev server" and build the final site.
*   **Adding TypeScript:**
    *   **What we did:** Chose TypeScript over JavaScript.
    *   **Why:** TypeScript adds "types" (like saying "Price must be a number"). This prevents common bugs where you might accidentally try to do math with text.
*   **Styling (Tailwind CSS):**
    *   **What we did:** Installed Tailwind.
    *   **Why:** Instead of writing separate `.css` files, we use classes like `text-blue-500` directly in our code. It's faster and keeps styles consistent.
*   **The Backend (Express):**
    *   **What we did:** Created a `server` folder with Node.js and Express.
    *   **Why:** React runs in the user's browser (Frontend). We need a "Backend" server to listen for messages from WhatsApp (Twilio) and talk to our AI, securely hidden from the public.

## 🗄️ Phase 2: The Database (Supabase)
**Goal:** Create a place to store our users and properties.

*   **Why Supabase?**
    *   It gives us a PostgreSQL database (industry standard).
    *   It handles Authentication (Logins) for us.
    *   It has a great free tier.
*   **Step A: Define Tables**
    *   `profiles`: Links to the Auth user, stores names and phone numbers.
    *   `properties`: Stores title, price, location, images, and links to the `owner_id`.
*   **Step B: Row Level Security (RLS)**
    *   **Concept:** "You can only edit your own properties." We need to write rules to enforce this.

## 🏠 Phase 3: Landlord Portal (Frontend)
**Goal:** Allow landlords to sign up and list houses.

*   **Authentication UI:** (We have a basic Login page)
    *   **Next Step:** Connect the "Sign Up" button to Supabase so it actually creates users.
*   **Property Management:**
    *   **Create:** A form to upload photos and enter details (Price, Location).
    *   **Read:** The Dashboard list (already sketched out) needs to pull real data from Supabase.
    *   **Update/Delete:** Buttons to edit or remove listings.

## 🧠 Phase 4: The Backend (AI & Logic)
**Goal:** Make the server smart.

*   **Twilio Setup:**
    *   Register for Twilio (WhatsApp Sandbox).
    *   **Webhook:** A specific URL on our server (e.g., `/api/whatsapp`) that Twilio hits whenever a user sends a message.
*   **Handling Messages:**
    *   We need code to read the incoming text ("I need a room in Harare").
*   **The AI Brain (LLM):**
    *   We will send the user's text to an AI (like Google Gemini or OpenAI).
    *   **Prompt:** "You are a rental assistant. The user wants X. Search the database and reply."
*   **Database Search:**
    *   The Backend needs to query Supabase: `SELECT * FROM properties WHERE location = 'Harare'`.

## 📱 Phase 5: WhatsApp Integration
**Goal:** The final link.

*   **Connecting the Pipes:**
    *   Twilio sends message -> Our Backend -> AI processes -> Database Search -> Backend Formats Response -> Twilio sends reply -> User receives WhatsApp.

## 🚀 Phase 6: Deployment
**Goal:** Put it on the internet.

*   **Frontend:** Vercel or Netlify (Great for React).
*   **Backend:** Render or Railway (Great for Node.js).

## 👉 What's Next?
We are currently moving from Phase 1 to Phase 2 (The Database). We need to set up the Supabase Tables so our Frontend has somewhere to save data.
```