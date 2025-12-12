# 3D Holographic Portfolio 🌐

A fully immersive, 3D personal portfolio website built with **React**, **Three.js**, and **Vite**. This project features a futuristic holographic interface, interactive 3D elements, and a responsive design that works seamlessly across desktop and mobile devices.

🔗 **Live Demo:** [https://jaynaik.tech](https://jaynaik.tech)

---

## ✨ Features

- **3D Immersive Scene**: Built using `@react-three/fiber` and `@react-three/drei`.
- **Holographic Interface**: Glowing, futuristic UI elements with bloom and vignette post-processing effects.
- **Interactive Navigation**:
  - **Home**: A rotating holographic core.
  - **About**: Hexagonal data nodes displaying profile details.
  - **Projects**: A 3D rotating carousel of project cards.
  - **Skills**: A floating 3D cloud of skill nodes.
  - **Contact**: Interactive 3D icons for social links.
- **Fully Responsive**: Optimized camera rigs and layouts for both Mobile and Desktop views.
- **Performance**: Powered by Vite for lightning-fast development and building.

---

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **3D Engine**: [Three.js](https://threejs.org/)
- **React 3D Bindings**: [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- **3D Helpers**: [@react-three/drei](https://github.com/pmndrs/drei)
- **Post-Processing**: [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) (Bloom, Vignette)
- **Animation**: [Maath](https://github.com/pmndrs/maath) (for smooth damping/transitions)

---

## 🚀 Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/Jay-Naik2526/3d-portfolio.git](https://github.com/Jay-Naik2526/3d-portfolio.git)
   cd 3d-portfolio
Install dependencies

Bash

npm install
Start the development server

Bash

npm run dev
Open your browser and navigate to http://localhost:5173.

## 📂 Project Structure
Bash

src/
├── components/          # 3D Components
│   ├── HologramScene.jsx    # Main 3D Scene setup
│   ├── HomeHeader.jsx       # 3D Title Text
│   ├── AboutPanel.jsx       # About Me Section (HexNodes)
│   ├── ProjectGallery.jsx   # Projects Carousel
│   ├── SkillsCloud.jsx      # Skills visualization
│   ├── ContactPanel.jsx     # Contact Icons
│   └── UI.jsx               # 2D HTML Overlay (Navigation)
├── data.js              # Central configuration file for content
├── App.jsx              # Main App logic & State
└── main.jsx             # Entry point
🎨 Customization
You can easily update the portfolio with your own information by editing a single file: src/data.js.

## JavaScript

// Example: src/data.js
export const myProfile = {
  name: "YOUR NAME",
  title: "YOUR TITLE",
  // ...
};

export const myProjects = [
  {
    title: "Project Name",
    desc: "Description...",
    url: "[https://project-url.com](https://project-url.com)",
    image: "/img/project-image.png" // Place images in public/img/
  },
  // ...
];
## 🤝 Contact
Jay Naik - 📧 Email: naikjay208@gmail.com

## 💼 LinkedIn: Jay Naik

## 🐙 GitHub: Jay-Naik2526

## 📄 License
This project is open source and available under the MIT License.