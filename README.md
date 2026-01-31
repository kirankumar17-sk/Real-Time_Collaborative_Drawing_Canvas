# Real-Time Collaborative Drawing Canvas

A real-time whiteboard application where multiple users can draw, erase, and undo actions simultaneously. Built with **React**, **Node.js**, and **Socket.io**.

## Features
* **Real-Time Collaboration**: Drawings appear instantly on all connected screens.
* **Global Undo**: Any user can undo the last action, affecting the global canvas state.
* **Presence System**: See live cursors and names of other users.
* **Tools**: Brush, Eraser, Color Picker, and Adjustable Stroke Size.
* **Resilient History**: New users receive the full drawing history upon joining.

---

## 🚀 How to Install and Run

This project uses a **Client-Server** architecture. You need to run the backend and frontend in separate terminals.

### Prerequisites
* Node.js (v14 or higher)
* npm

### Step 1: Clone and Install Dependencies

**1. Install Backend Dependencies:**
```bash
cd server
npm install