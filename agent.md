# PaDen – AI WhatsApp Rental Assistant  
## Project Specification Document (agent.md)

### 1. Project Overview

PaDen is an AI-powered WhatsApp chatbot and web platform designed to help students and general users easily find rental accommodation such as rooms, boarding houses, cottages, and apartments.

The system connects two user groups:

- **Tenants (students and property seekers)** – who search for accommodation via WhatsApp  
- **Landlords / Property Owners** – who upload and manage property listings through a web dashboard  

The core goal of PaDen is to simplify property discovery, reduce scams, and make the accommodation search process fast, safe, and accessible using only WhatsApp.

---

## 2. Core Problem Being Solved

Current accommodation search challenges:

- Listings scattered across Facebook and WhatsApp groups  
- No structured information  
- No verified landlords  
- Outdated posts  
- No clear locations  
- No price transparency  
- High risk of scams  
- Difficult comparison of options  

PaDen solves these problems by providing:

- Centralized property listings  
- AI-assisted searching  
- Verified landlords  
- Location-based results  
- Structured images and details  
- Direct communication through WhatsApp  

---

## 3. System Components

The project consists of four major parts:

### A. WhatsApp AI Chatbot (Tenant Interface)

Used by students and tenants to:

- Search for properties  
- View images  
- Receive suggestions  
- Get locations  
- Contact landlords  
- Save favorites  

### B. Backend API

Responsible for:

- Receiving messages from WhatsApp (via Twilio API)  
- Processing user intent  
- Querying database  
- Sending structured responses  
- Managing notifications  

### C. Database Layer

Stores:

- Users  
- Landlords  
- Properties  
- Images  
- Preferences  
- Alerts  
- Conversations  
- Subscriptions  

### D. Web Platform (Landlord Portal)

Allows landlords to:

- Register and login  
- Upload properties  
- Add images  
- Manage listings  
- View analytics  
- Subscribe to packages  

---

## 4. Target Users

### Primary Users
- University students  
- Young professionals  
- People searching for rentals  

### Secondary Users
- Landlords  
- Boarding house owners  
- Real estate agents  

---

## 5. Key Features

### 5.1 WhatsApp Chatbot Features

Tenants can:

- Search using natural language  
- Filter by:
  - location  
  - price  
  - property type  
  - distance  
- View property images  
- Receive map locations  
- Save properties  
- Get recommendations  
- Contact landlords  
- Set alerts  

#### Example User Queries

- “I need a room under $80 near MSU”  
- “Show cottages in Senga”  
- “Find a single room near UZ”  
- “Any rooms with WiFi under $100?”  

---

### 5.2 Landlord Platform Features

Through the website, landlords can:

- Create accounts  
- Upload property details  
- Add multiple images  
- Set prices  
- Add locations  
- Manage availability  
- Choose subscription packages  
- View inquiries  
- View analytics  

---

### 5.3 Trust & Safety Features

- Verified landlord badges  
- Scam reporting  
- User reviews  
- Listing moderation  
- Identity verification  

---

### 5.4 Notification System

Users can opt-in to:

- New property alerts  
- Price drop notifications  
- Viewing reminders  
- Saved search updates  

---

### 5.5 Payment & Monetization

Landlords can pay for:

- Listing packages  
- Featured properties  
- Premium visibility  
- Verification badges  

---

## 6. Technical Architecture

### 6.1 Technology Stack

#### Frontend (Landlord Dashboard)
- React.js  
- Tailwind CSS  
- Supabase Auth  
- Responsive UI  

#### Backend
- Node.js with Express.js
- Real-time message handling

- Webhooks from Twilio

- JSON APIs

- Database communication
- Twilio WhatsApp API  
- AI/NLP processing(using gemma-3-27b-it as the ai model)

#### Database
- PostgreSQL (via Supabase)

#### Storage
- Supabase Storage

#### Messaging
- Twilio WhatsApp API  

---

## 7. WhatsApp Integration Details

### 7.1 Twilio API Usage

PaDen will use Twilio for:

- Receiving WhatsApp messages  
- Sending:
  - text  
  - images  
  - interactive buttons  
  - list menus  
  - locations  

### 7.2 Supported Message Types

The bot must support:

- Plain text  
- Formatted messages  
- Image messages  
- Interactive buttons  
- List selections  
- Location pins  
- Map links  

---

## 8. Data Model (Core Tables)

### Users
- id  
- name  
- phone  
- role  
- preferences  

### Landlords
- id  
- name  
- phone  
- verification_status  

### Properties
- id  
- title  
- description  
- price  
- location  
- latitude  
- longitude  
- type  
- landlord_id  

### Images
- id  
- property_id  
- url  

### Alerts
- id  
- user_id  
- filters  

---

## 9. Typical User Flow

1. User opens WhatsApp  
2. Chats with PaDen bot  
3. Describes need  
4. Bot suggests properties  
5. User views images  
6. Bot sends location  
7. User contacts landlord  
8. User saves or sets alert  

---

## 10. Performance Expectations

- Response time: under 2 seconds  
- Fast image delivery  
- Reliable message delivery  
- Real-time search  
- Scalable architecture  

---

## 11. Accessibility Considerations

- Works on WhatsApp bundles  
- No app installation required  
- Low data consumption  
- Simple text-based interaction  

---

## 12. Business Model

### Tenant Side
- Free to use  

### Landlord Side
Paid services:

- Basic listing  
- Premium listing  
- Featured placement  
- Verification badges  

---

## 13. Future Enhancements

Planned upgrades:

- AI price suggestions  
- Roommate matching  
- In-app payments  
- Virtual tours  
- University partnerships  
- Moving service integration  

---

## 14. Compliance & Restrictions

System must respect:

- WhatsApp 24-hour messaging rules  
- Opt-in notification policies  
- Data privacy standards  
- Anti-spam regulations  

---

# 15. Project Identity

**Project Name:** PaDen  
**Type:** AI WhatsApp Rental Assistant  
**Primary Platform:** WhatsApp  
**Secondary Platform:** Web Dashboard  
**Target Market:** Students and renters  

---

### Final Goal

To become the easiest, safest, and fastest way for people to find accommodation using only WhatsApp.

---

End of Specification.
