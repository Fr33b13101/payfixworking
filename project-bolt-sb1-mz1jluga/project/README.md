# PayFix - Professional Mobile Repair Service

[![Built with Bolt](https://img.shields.io/badge/Built%20with-Bolt-blue?style=for-the-badge&logo=bolt&logoColor=white)](https://bolt.new)

A modern, professional mobile device repair service application built with React, TypeScript, and Supabase. Features include repair request submissions with voice recordings, photo uploads, and automated email confirmations.

## Features

- 📱 **Device Repair Requests** - Submit repair requests for various mobile devices
- 🎤 **Voice Recording** - Record voice descriptions of device issues
- 📸 **Photo Upload** - Upload photos of damaged devices
- ⚡ **Priority Levels** - Choose urgency level with estimated turnaround times
- 📧 **Email Confirmations** - Automated confirmation emails with request details
- 🔒 **Secure Storage** - Files stored securely in Supabase Storage
- 📱 **Responsive Design** - Works perfectly on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Storage, Edge Functions)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your Supabase project and add environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file with:

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The application uses a single `repair_requests` table with the following structure:

- `id` (uuid, primary key)
- `created_at` (timestamp)
- `full_name` (text, required)
- `email` (text, required)
- `phone_model` (text, required)
- `issue_description` (text, optional)
- `voice_recording_url` (text, optional)
- `photo_url` (text, optional)
- `urgency` (text, default: 'medium')
- `status` (text, default: 'pending')

## License

MIT License - feel free to use this project for your own repair service business.

---

Built with ❤️ using [Bolt](https://bolt.new)