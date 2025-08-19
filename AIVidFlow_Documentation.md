# AIVidFlow: The AI-Powered Video Workflow Editor

Welcome to the official documentation for AIVidFlow, a next-generation video editing application that seamlessly integrates a powerful, interactive timeline with a suite of cutting-edge AI agents. This document provides a comprehensive overview for users, developers, and administrators.

---

## 1. Feature List

AIVidFlow is designed to be a robust, professional-grade editor. Here are its core features:

### Core Editing & Timeline
- **Fully Interactive Timeline:** A drag-and-drop interface for arranging clips.
- **Direct Clip Manipulation:**
    - **Move:** Drag clips to new positions on the timeline or between tracks.
    - **Trim:** Click and drag the edges of a clip to precisely adjust its in- and out-points.
    - **Split (Blade Tool):** A blade tool (`B` key) allows you to cut clips at any point on the timeline.
    - **Delete:** Remove selected clips with the `Backspace`/`Delete` key or via the Inspector.
- **Multi-Track System:** Supports video, audio, and caption tracks.
- **Real-time Playback & Seeking:** A synchronized playhead shows the current video position, with the ability to click anywhere to seek.
- **Audio Controls:** Mute and solo buttons for each track containing audio.
- **Undo/Redo System:** Robust history management (`Ctrl/Cmd+Z`) for all major timeline operations.

### AI-Powered Agents
- **AI Asset Categorization:** On import, AI analyzes and sorts media into "Smart Bins" like "Talking Head," "B-Roll," or "Music."
- **Auto-Cut (Scene Detection):** Automatically detects scene changes in a video and splits it into corresponding clips on the timeline.
- **Auto-Caption:** Transcribes video audio using AI and generates a synchronized caption track.
- **Auto-Color:** Analyzes a clip's content and applies optimal settings for exposure, contrast, and saturation. It also suggests a creative Look-Up Table (LUT) and provides a visual preview.
- **Smart Templates:** Apply pre-defined editing recipes (e.g., "TikTok 60s Punch-Cut") to automatically generate a new edit from a source video.
- **AI Waveform Generation:** Automatically generates and displays visual audio waveforms for all clips, aiding in precise audio editing.

### Workflow & Project Management
- **Persistent Project State:** Your entire project—including assets, timeline, and layout—is automatically saved to your browser's `localStorage`, so you can resume your work at any time.
- **Interactive Workflow View:** A node-based graph that visualizes the AI processes in your project. Nodes are interactive, showing real-time status (Running, Completed, Error) and can be clicked to re-run AI agents.
- **AI-Powered Video Export:** Generates a final video by creating a detailed, descriptive prompt from your timeline and feeding it to a generative video AI model.

### UI & UX
- **Dual-View Interface:** Instantly switch between the traditional "Edit" view (timeline) and the "Workflow" view (node graph).
- **Dynamic Inspector Panel:** A context-aware panel that displays properties for any selected clip or asset, allowing for real-time adjustments (opacity, volume, transform, color effects, and caption text).
- **Comprehensive Keyboard Shortcuts:** Designed for power users, with shortcuts for major actions like toggling tools, switching views, and timeline navigation.
- **Polished & Responsive Design:** A clean, modern, and dark-themed UI that is intuitive and easy to navigate.

---

## 2. User Guide & Tutorial

Follow these steps to create your first video with AIVidFlow.

### Step 1: Getting Started - Importing Media
1.  Click the **"Import"** button in the top left, or click the **"Import"** node in the Workflow view.
2.  Select a video or audio file from your computer.
3.  Upon import, the AI will automatically categorize your asset and generate an audio waveform. You will see toast notifications indicating the progress. Your asset will appear in the "Assets" panel.

### Step 2: Using the Timeline
1.  **Add to Timeline:** When you import your first asset, it will be automatically added to the timeline. To add more assets, you can drag them from the asset panel onto the timeline in a future version (for now, work with the first imported asset).
2.  **Play & Seek:** Press the **Spacebar** to play or pause the video. Click anywhere on the timeline ruler to jump to that point.
3.  **Arrange Clips:**
    - **Move:** Click and drag a clip to move it to a new time or a different track.
    - **Trim:** Drag the left or right edge of a clip to shorten or lengthen it.
    - **Split:** Press the **'B'** key to activate the Blade Tool. Your cursor will turn into a crosshair. Click on a clip to split it in two. Press 'B' again to deactivate the tool.
4.  **Undo/Redo:** Made a mistake? Press `Ctrl/Cmd+Z` to undo and `Ctrl/Cmd+Shift+Z` to redo.

### Step 3: Applying AI Agents
1.  **Select a Clip:** Click on a clip in the timeline to select it.
2.  **Open the Agents Panel:** In the left rail, click on the **Agents** tab (the magic wand icon).
3.  **Run an Agent:**
    - Click **"Run"** next to **"Auto-Cut"** to have the AI detect scenes and split your selected clip.
    - Click **"Run"** next to **"Auto-Caption"** to generate a caption track.
    - Click **"Run"** next to **"Auto-Color"** to have the AI correct the colors of your clip.
    - To use a Smart Template, go to the **"Templates"** tab and click **"Use"** on your desired template.

### Step 4: Using the Workflow View
- Switch to the **Workflow** view by clicking the tab at the top of the center area.
- Here you can see the flow of your project. As you run AI agents, the corresponding nodes will update with their status. You can click on any node to re-run that action.

### Step 5: Editing in the Inspector
1.  Select a clip on the timeline.
2.  The **Inspector** panel on the right will update to show its properties.
3.  Adjust the **Transform** (position/scale), **Opacity**, or **Effects** (color) and see the changes in the video preview instantly. If you select a caption clip, you can edit its text here.

### Step 6: Exporting Your Video
1.  Click the **"Export"** button in the top bar.
2.  An "Export Video" dialog will appear. It contains a text prompt that the AI has generated based on your timeline edits.
3.  Click the **"Export"** button in the dialog. The AI will begin rendering your video. This may take a few moments.
4.  Once complete, a preview of the final video will appear.

---

## 3. Development Guide

### Prerequisites
- Node.js (v20 or later)
- npm

### Installation
1.  Clone the repository.
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Development Server
- **Run the Next.js App:**
  ```bash
  npm run dev
  ```
- **Run the Genkit AI Flows:** In a separate terminal, start the Genkit development service:
  ```bash
  npm run genkit:watch
  ```
The application will be available at `http://localhost:3000`.

### Project Structure
- `src/app/page.tsx`: The main application component and entry point.
- `src/components/`: Contains all React components, organized by function (editor, ui).
- `src/ai/flows/`: Contains all backend Genkit AI flows. Each file represents a specific AI capability.
- `src/types/`: TypeScript type definitions for the application.
- `src/hooks/`: Custom React hooks, such as `useHistory` for undo/redo.
- `src/lib/`: Utility functions.

### Adding a New AI Flow
1.  Create a new file in `src/ai/flows/`, e.g., `new-agent.ts`.
2.  Follow the existing structure: define input/output schemas with Zod, create an `ai.definePrompt`, and wrap it in an `ai.defineFlow`.
3.  Export an async function that calls your flow.
4.  Import the new flow in `src/ai/dev.ts` to register it with Genkit.
5.  Import the exported function in `src/app/page.tsx` and call it from a new UI element.

---

## 4. Deployment & Production

### Environment Variables
Before deploying, you must obtain a **Gemini API Key** from Google AI Studio.
1.  Create a `.env` file in the project root.
2.  Add your API key to the file:
    ```
    GEMINI_API_KEY=your_google_api_key_here
    ```

### Building for Production
Run the following command to build the application for production:
```bash
npm run build
```

### Deployment with Firebase App Hosting
This application is configured for easy deployment with Firebase App Hosting.
1.  Ensure you have the Firebase CLI installed and are logged in.
2.  Initialize Firebase in your project directory.
3.  The `apphosting.yaml` file is pre-configured. You can deploy by running:
    ```bash
    firebase apphosting:backends:deploy
    ```
Follow the CLI prompts to select your Firebase project. The CLI will handle the build and deployment process.

---

## 5. User Experience (UX) Philosophy

The design of AIVidFlow was guided by these core principles:
- **AI as a Collaborative Partner:** AI should not replace the editor but augment their creativity. AI agents are designed to be run on command, giving the user full control.
- **Fluidity and Interactivity:** The application prioritizes a seamless, responsive experience. Direct manipulation on the timeline, real-time previews, and fast keyboard shortcuts are essential.
- **Clarity and Feedback:** The UI should always provide clear feedback. This is visible in the interactive node graph statuses, real-time video previews, and non-blocking toast notifications.
- **Power and Simplicity:** The interface should be clean and intuitive for new users, while providing the depth and power (like Smart Templates and Workflow view) that professionals expect.
