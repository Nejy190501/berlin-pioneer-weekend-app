# 🐻 Week-end Pionnier Berlin — Interactive App

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, interactive, and beautifully designed web application built to manage and navigate the **Pioneer Weekend in Berlin**. This Progressive Web App (PWA) helps participants track events, view practical information, and engage with the weekend's schedule seamlessly.

---

## ✨ Features

- **Interactive Schedule**: Browse daily events with filtering and detailed views.
- **Real-time Status**: Events show dynamic states (upcoming, in progress, past).
- **Calendar Integration**: Export individual events or the full schedule as `.ics` files.
- **Responsive Design**: Beautiful UI powered by Tailwind CSS, perfect for mobile use while walking around Berlin.
- **Smooth Animations**: Transitions and micro-interactions powered by `motion/react`.
- **Practical Info Tab**: Quick access to essential information (maps, transport, contacts).

---

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Core** | React 19, TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React |

---

## 🚀 Getting Started

### Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Nejy190501/week-end-pionnier-berlin.git
   cd week-end-pionnier-berlin
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

### Build for Production

```bash
npm run build
```
This generates optimized static files in the `dist/` directory.

---

## 📂 Project Structure

```text
week-end-pionnier-berlin/
├── src/
│   ├── components/      # Reusable React components (EventCard, SettingsModal...)
│   ├── utils/           # Utility functions (calendar export, defaults)
│   ├── App.tsx          # Main application logic and routing
│   ├── index.css        # Global Tailwind CSS imports
│   └── types.ts         # TypeScript interfaces and types
├── public/              # Static assets
├── package.json         # Project dependencies and scripts
├── vite.config.ts       # Vite bundler configuration
└── tailwind.config.js   # Tailwind theme customization
```

---

## 👤 Author

**Jean Yves Nkwane**  

- 🐙 GitHub: [@Nejy190501](https://github.com/Nejy190501)

---

<p align="center">Made with 💻 and ❤️ for the Pioneer Weekend</p>
