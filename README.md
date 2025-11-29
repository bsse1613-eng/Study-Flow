<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/18rRW1puUbkIl-LNIft7NDGa7sATH-79F

## Run Locally

**Prerequisites:**  Node.js 16+

### Setup Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure API Key:**
   - Copy the environment template:
     ```bash
     cp .env.example .env.local
     ```
   - Open `.env.local` and add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     ```
   - Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

### Features

- **AI-Powered Study Planning**: Uses Google's Gemini AI to create personalized study schedules
- **Subject Management**: Organize subjects with topics and difficulty levels
- **Exam Tracking**: Track upcoming exams and deadlines
- **Schedule Optimization**: Respects busy schedules and generates optimal study sessions
- **Progress Monitoring**: Track completion progress with visual dashboards
- **Local Storage**: All data persists locally in browser storage

### Project Structure

```
components/       # React components
├── Dashboard.tsx      # Main dashboard with study sessions
├── ExamManager.tsx    # Exam management interface
├── Subjects.tsx       # Subject and topic management
├── ScheduleManager.tsx # Fixed schedule configuration
├── Planner.tsx        # AI study plan generator
├── Layout.tsx         # App layout and navigation
└── ui/Button.tsx      # Reusable button component

services/
├── geminiService.ts   # Gemini API integration
└── storageService.ts  # LocalStorage management

types.ts          # TypeScript type definitions
utils.ts          # Utility functions
App.tsx           # Main app component
```

### Troubleshooting

**"API Key not found" error:**
- Ensure `.env.local` file exists
- Verify `VITE_GEMINI_API_KEY` is set correctly
- Make sure there are no extra spaces in the API key

**Build warnings about large chunks:**
- This is normal for this app size
- Consider using dynamic imports for code splitting in future updates

### Recent Fixes

See [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) for details on project improvements and bug fixes.
