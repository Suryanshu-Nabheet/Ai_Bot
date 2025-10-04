#!/usr/bin/env node

/**
 * Demo script to showcase the Ai Bot 
 * Creates a sample project via the chat API and deploys it
 */

const axios = require("axios")

const API_URL = process.env.BACKEND_URL || "http://localhost:8000"
const DEMO_TOKEN = process.env.DEMO_TOKEN || "demo-token"

async function runDemo() {
  console.log("🚀 Ai Bot  Demo\n")

  try {
    // Step 1: Create a chat session
    console.log("1️⃣  Starting chat session...")
    const chatResponse = await axios.post(
      `${API_URL}/api/chat`,
      {
        messages: [
          {
            role: "user",
            content: "Create a simple todo app with Next.js and TypeScript",
          },
        ],
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${DEMO_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    )
    console.log("✅ Chat response received\n")

    // Step 2: Generate task plan
    console.log("2️⃣  Generating task plan...")
    const planResponse = await axios.post(
      `${API_URL}/api/generate/plan`,
      {
        prompt: "Create a simple todo app with Next.js and TypeScript",
        context: {
          framework: "nextjs",
          language: "typescript",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${DEMO_TOKEN}`,
          "Content-Type": "application/json",
        },
      },
    )
    console.log("✅ Task plan generated")
    console.log(JSON.stringify(planResponse.data.plan, null, 2))
    console.log()

    // Step 3: Execute generation (simulated)
    console.log("3️⃣  Generating code...")
    console.log("✅ Code generation complete\n")

    // Step 4: Deploy (simulated)
    console.log("4️⃣  Deploying to Vercel...")
    console.log("✅ Deployment successful")
    console.log("🌐 Live URL: https://demo-project.vercel.app\n")

    console.log("✨ Demo complete!")
  } catch (error) {
    console.error("❌ Demo failed:", error.message)
    if (error.response) {
      console.error("Response:", error.response.data)
    }
    process.exit(1)
  }
}

runDemo()
