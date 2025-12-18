---
description: How to deploy the I Ching App to Vercel
---

# Deploying "Zhou Yi Answer Book" to Vercel

This guide outlines the steps to deploy your application to Vercel.

## Prerequisites
1.  A [Vercel Account](https://vercel.com).
2.  The project code pushed to a Git repository (GitHub, GitLab, or Bitbucket) **OR** Vercel CLI installed.

## Option 1: Git Integration (Recommended)

1.  **Push your code** to a GitHub/GitLab repository.
2.  Log in to your **Vercel Dashboard**.
3.  Click **"Add New..."** -> **"Project"**.
4.  Import your git repository.
5.  **Configure Project**:
    -   **Framework Preset**: Select `Vite`.
    -   **Root Directory**: `./` (default).
    -   **Build Command**: `npm run build` (default).
    -   **Output Directory**: `dist` (default).
6.  **Environment Variables** (Crucial!):
    expand the "Environment Variables" section and add the following:
    
    | Key | Value |
    | :--- | :--- |
    | `VITE_DEFAULT_AI_PROVIDER` | `gemini` (or `openai`, `grok`) |
    | `VITE_DEFAULT_API_KEY` | Your actual API Key |

7.  Click **Deploy**.

## Option 2: Vercel CLI

1.  Open your terminal in the project folder.
2.  Install Vercel CLI (if not installed):
    ```bash
    npm i -g vercel
    ```
3.  Run the deploy command:
    ```bash
    vercel
    ```
4.  Follow the prompts:
    -   Set up and deploy? **Y**
    -   Which scope? (Select your account)
    -   Link to existing project? **N**
    -   Project Name? **iching-app**
    -   Directory? **./**
    -   Want to modify settings? **N** (Auto-detection is usually correct)

5.  **Set Environment Variables**:
    Go to the Vercel Dashboard -> Your Project -> Settings -> Environment Variables, and add the keys mentioned in Option 1. Run `vercel --prod` to redeploy if needed.

## Verification
Once deployed, visit the URL provided by Vercel. Test the Coin Toss and AI interpretation to ensure the API key is working correctly.
