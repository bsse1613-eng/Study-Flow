#!/usr/bin/env node

/**
 * StudyFlow Setup Script
 * Helps users configure and run the project
 */

const fs = require('fs');
const path = require('path');

console.log('\n🎓 StudyFlow - AI Study Planner Setup\n');

// Check if .env.local exists
const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envLocalPath)) {
  console.log('📝 Setting up environment variables...\n');
  
  if (fs.existsSync(envExamplePath)) {
    // Copy .env.example to .env.local
    fs.copyFileSync(envExamplePath, envLocalPath);
    console.log('✅ Created .env.local from .env.example');
    console.log('⚠️  IMPORTANT: Please update .env.local with your Gemini API key\n');
    console.log('Get your API key at: https://aistudio.google.com/app/apikey\n');
  } else {
    console.log('❌ .env.example not found. Creating .env.local template...\n');
    fs.writeFileSync(
      envLocalPath,
      'VITE_GEMINI_API_KEY=your_gemini_api_key_here\n'
    );
    console.log('✅ Created .env.local template');
    console.log('⚠️  Please add your Gemini API key to .env.local\n');
  }
} else {
  console.log('✅ .env.local already exists\n');
}

console.log('Next steps:');
console.log('1. npm install (if not already done)');
console.log('2. Update .env.local with your API key');
console.log('3. npm run dev\n');
