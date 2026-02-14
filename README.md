
# 📚 StoryWeaver Frontend

A high-performance, refined web application for browsing and reading stories from OPDS feeds. This project serves as the frontend for **StoryWeaver**, an open-source platform by Pratham Books, designed to create a digital library of multilingual children's stories.

Built with **React**, **Vite**, and **Tailwind CSS**, focusing on speed, accessibility, and a premium user experience.

## ✨ Key Features

- **📖 OPDS Feed Integration**: Seamlessly parses and displays books from OPDS catalogs using a dedicated Web Worker for non-blocking performance.
- **⚡ Supercharged Performance**:
  - **Progressive Image Loading**: Implements skeleton screens and blur-up effects for immediate visual feedback.
  - **Eager Loading**: Prioritizes above-the-fold content to ensure the fastest possible Largest Contentful Paint (LCP).
  - **Worker-Based Parsing**: Offloads heavy XML parsing to a web worker, keeping the UI silky smooth.
- **🔍 Advanced Search & Filtering**: Client-side filtering and search algorithms to find books by language, level, and category instantly.
- **💾 Offline-First**: Uses IndexedDB to cache book data, allowing for offline browsing and resilience against network flakiness.
- **🎨 Modern UI/UX**:
  - Fully responsive design with **Tailwind CSS**.
  - Smooth animations powered by **Framer Motion**.
  - Elegant, distraction-free reading environment.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State/cache**: IndexedDB (idb)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **XML Parsing**: fast-xml-parser

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhi-jithb/storyweaver-frontend.git
   cd storyweaver-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## 🏗️ Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate the static assets in the `dist` directory.

## ⚡ Performance Optimizations

Recent updates have significantly boosted performance:
- **Web Worker Offloading**: Heavy XML parsing of OPDS feeds is moved to a dedicated worker thread to prevent UI freezing.
- **Smart Image Loading**: 
  - Thumbnails are extracted from feeds for faster initial grid rendering.
  - `ImageWithLoader` component handles skeleton states and graceful transitions.
  - Critical images are priority-loaded to improve perceived speed.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Made with ❤️ by <a href="https://github.com/abhi-jithb">Abhi Jith B</a></sub>
</div>
