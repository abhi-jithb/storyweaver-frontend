# 📚 StoryWeaver Catalog & Checkout

A high-performance, refined web application for browsing, reviewing, and bulk-purchasing children's stories from StoryWeaver's OPDS feeds.

Built with **React**, **Vite**, and **Tailwind CSS**, this platform is optimized for handling massive datasets (100k+ items) with a silky-smooth user interface and a clear 4-step purchase flow.

## 🚀 The Checkout Workflow

The application follows a structured, conversion-optimized flow:

1.  **Browse Catalog**: Explore the vast collection with advanced filters (Language, Level, Category).
2.  **Review Selection**: Audit your selected books, search within them, and see a metadata breakdown.
3.  **Payment**: Placeholder secure payment screen for final verification.
4.  **Download**: Instant access to the purchase package (ZIP) and metadata (CSV).

## ✨ Key Features

### 🛒 High-Performance Selection
- **Explicit Controls**: Select "All on Page" or "Entire Filtered Dataset" with clear, unambiguous buttons.
- **Persistence**: Selections are maintained across pagination, page size changes, and view modes.
- **Set-Based State**: Ultra-fast $O(1)$ selection logic using a global Map/Set state, capable of handling 10,000+ selections with zero lag.

### 🔍 Advanced Browsing
- **Hybrid Views**: Switch between a dense **Table View** and a visual **Card Grid**.
- **Web Worker Engine**: Heavy OPDS XML parsing and filtering are offloaded to background threads.
- **Dynamic Filtering**: Filters update in real-time based on the available metadata in the feed.

### ♿ Accessibility & UX
- **Keyboard Navigation**: Full support for `Enter` and `Space` keys to select books in any view.
- **Step Indicator**: Clear visual feedback on current progress through the checkout flow.
- **Sticky Actions**: The selection status bar remains visible at all times for quick actions.

## 🛠️ Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Premium Design System)
- **State Management**: React Context + Persistence Layer (IndexedDB)
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Performance**: Web Workers + React.memo + O(1) Data Structures

## 🏗️ Getting Started

### Installation

1. **Clone and Install**
   ```bash
   git clone https://github.com/abhi-jithb/storyweaver-frontend.git
   cd storyweaver-frontend
   npm install
   ```

2. **Run Locally**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## 📈 Performance Benchmarks

- **Max Items**: Comfortably handles 10,000+ items in list view using memoization.
- **Parsing Speed**: Worker-based XML parsing processes 1,000 items in <100ms.
- **Search Latency**: Deferred search values ensure the UI remains responsive even during heavy filtering.

---

<div align="center">
  <sub>Made with ❤️ for StoryWeaver by <a href="https://github.com/abhi-jithb">Abhi Jith B</a></sub>
</div>
