# Deploying PlayPath

PlayPath is a Next.js application that can be easily deployed to Vercel.

## Prerequisites

- A GitHub, GitLab, or Bitbucket account.
- A [Vercel](https://vercel.com) account.

## Environment Variables

The application requires the following environment variables. Make sure to set these up in your deployment provider's dashboard.

- `GEMINI_API_KEY`: Your Google Gemini API key.
- `MONGODB_URI`: Your MongoDB connection string.

## Deployment Steps (Vercel)

1.  **Push to Git**: Ensure your latest code is committed and pushed to your git repository.
2.  **Import Project**: Log in to Vercel and click "Add New..." -> "Project". Import your git repository.
3.  **Configure Project**:
    - **Framework Preset**: Next.js (should be auto-detected).
    - **Root Directory**: `.` (default).
    - **Environment Variables**: Add the variables listed above.
4.  **Deploy**: Click "Deploy". Vercel will build and deploy your application.

## Troubleshooting

### MongooseServerSelectionError / Connection Errors

If you see a "Connection Error" or `MongooseServerSelectionError`, it means the application cannot reach your MongoDB database.

1.  **Check Environment Variables**:
    -   Go to your Vercel Project Settings > Environment Variables.
    -   Ensure `MONGODB_URI` is set correctly. It should look like `mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority`.

2.  **IP Whitelist (MongoDB Atlas)**:
    -   Vercel uses dynamic IP addresses, so you cannot whitelist a single IP.
    -   Go to MongoDB Atlas > Network Access.
    -   Add IP Address: `0.0.0.0/0` (Allow Access from Anywhere).
    -   *Note: Ensure you have a strong password for your database user since this allows access from any IP.*

-   **Build Errors**: Check the build logs in Vercel. Ensure all dependencies are in `package.json`.
