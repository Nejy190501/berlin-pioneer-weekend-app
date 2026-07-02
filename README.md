<div align="center">
  <h1>🐻 Week-end Pionnier Berlin</h1>
  <p><strong>Your Ultimate Companion App for the Pioneer Weekend</strong></p>
  <h3><a href="https://programme-week-end-pionnier-berlin-fr.netlify.app/">🚀 View Live Demo</a></h3>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
</div>

<br />

A modern, interactive, and beautifully designed web application built to manage and navigate the **Pioneer Weekend in Berlin**. This Progressive Web App (PWA) helps participants track events, view practical information, and engage with the weekend's schedule seamlessly.

## ✨ Features

- 📅 **Interactive Schedule**: Browse daily events with filtering and detailed views.
- ⏱️ **Real-time Status**: Events show dynamic states (upcoming, in progress, past).
- 🗓️ **Calendar Integration**: Export individual events or the full schedule as `.ics` files.
- 📱 **Responsive Design**: Beautiful UI powered by Tailwind CSS, perfect for mobile use while walking around Berlin.
- 💫 **Smooth Animations**: Transitions and micro-interactions powered by `motion/react`.
- ℹ️ **Practical Info Tab**: Quick access to essential information (maps, transport, contacts).

## 📸 Screenshots

*(Replace these placeholders with actual screenshots of your app once ready)*

| Schedule View | Event Details | Practical Info |
| :---: | :---: | :---: |
| <img src="https://via.placeholder.com/250x500.png?text=Schedule+View" alt="Schedule" width="200"/> | <img src="https://via.placeholder.com/250x500.png?text=Event+Details" alt="Event Details" width="200"/> | <img src="https://via.placeholder.com/250x500.png?text=Info+Tab" alt="Info" width="200"/> |

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Core** | React 19, TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

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

4. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

### Build for Production

```bash
npm run build
```
This generates optimized static files in the `dist/` directory, ready to be deployed.

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

## ☁️ Deployment

This project is configured for seamless deployment on **Netlify** (via `netlify.toml`).

1. Connect your GitHub repository to Netlify.
2. Netlify will automatically detect the build settings (`npm run build` and `dist` directory).
3. Push to the `main` branch to trigger automatic deployments.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Jean Yves Nkwane**  

- 🐙 GitHub: [@Nejy190501](https://github.com/Nejy190501)
- 💼 LinkedIn: [Jean Yves Nkwane](#) *(Update your link here)*

---
<div align="center">
  <p>Made with 💻 and ❤️ for the Pioneer Weekend</p>
</div>
