# 🥗 Nutrition Coach App

An AI-powered nutrition coaching application that makes weight loss tracking feel effortless. Chat with your personal nutrition coach instead of using a technical tracking system.

## ✨ Features

### Core Experience
- **Natural Conversations**: Chat about your nutrition like you would with a real coach
- **30-Second Morning Check-ins**: Share your weight and plans, get instant personalized targets
- **Smart Food Logging**: Take photos or describe your meals - AI handles the nutrition analysis
- **Real-time Tracking**: Watch your daily progress update as you log meals
- **Encouraging Coaching**: Get context-aware, supportive feedback throughout the day

### Key Capabilities
1. **Daily Setup** - Quick morning routine establishes your targets automatically
2. **Intelligent Food Analysis** - Photos and text both work seamlessly
3. **Smart Database System** - Learns from your habits with priority hierarchy:
   - First: Your personal learned foods
   - Second: Project food database
   - Third: Web search, then save to personal database
4. **Real-time Progress Tracking** - Live updates as you log meals
5. **User Data Persistence** - Track patterns over time

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **File Storage**: Supabase Storage
- **AI**: Anthropic Claude API (text + vision)
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account ([sign up free](https://supabase.com))
- An Anthropic API key ([get one here](https://console.anthropic.com))

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd nutrition-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your credentials
3. Run the database schema:
   - Open the SQL Editor in your Supabase dashboard
   - Copy the contents of `database/schema.sql`
   - Execute the SQL to create all tables and policies

### 4. Set Up Anthropic API

1. Get your API key from [Anthropic Console](https://console.anthropic.com)
2. You'll need this for the AI coaching features

### 5. Configure Environment Variables

Create a `.env.local` file in the `nutrition-app` directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Anthropic Claude API
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 6. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app!

## 📊 Calculation System

The app uses a sophisticated calculation system for daily targets:

### BMR Calculation
```
BMR = (10 × weight) + (6.25 × height) - (5 × age) + 5
```

### Daily Target Calories
```
Target = BMR + Activity Base (900) - Deficit + Modifiers
```

**Sliding Deficit by Weight:**
- 90-100kg: -750 cal
- 80-90kg: -650 cal
- 70-80kg: -550 cal
- 60-70kg: -450 cal
- <60kg: -350 cal

**Modifiers:**
- Apple Watch: (Move calories - 600) ÷ 2
- Weekend Banking: -100 Mon-Thu, +133 Fri-Sun
- Training Day: +250 calories

### Macro Targets
- **Protein**: 2g per kg body weight
- **Fat**: 25% of daily calories
- **Carbs**: Remaining calories

## 🗂️ Project Structure

```
nutrition-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/          # React components
│   ├── lib/                 # Third-party configurations
│   │   ├── supabase.ts     # Supabase client
│   │   └── anthropic.ts    # Claude API functions
│   ├── types/               # TypeScript types
│   │   ├── index.ts        # Core types
│   │   └── database.ts     # Database types
│   └── utils/               # Utility functions
│       ├── calculations.ts  # BMR, macros, progress
│       └── date.ts         # Date helpers
├── database/
│   └── schema.sql          # Supabase database schema
├── public/                  # Static assets
├── .env.local.example      # Environment variables template
└── README.md               # This file
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- API keys stored securely in environment variables
- Image uploads scoped to authenticated users

## 📝 Database Schema

The app uses 5 main tables:

1. **users** - User profiles (extends Supabase auth)
2. **daily_logs** - Daily check-ins and calculated targets
3. **food_entries** - Individual food log entries
4. **personal_foods** - User's learned food database
5. **project_foods** - Shared food database

See `database/schema.sql` for the complete schema.

## 🎯 Development Phases

### Phase 1: Foundation ✅
- [x] Project setup
- [x] Database schema
- [x] Core calculations
- [x] Type definitions

### Phase 2: Daily Setup (Next)
- [ ] Morning check-in UI
- [ ] Target calculation integration
- [ ] Daily tracker creation

### Phase 3: Food Logging
- [ ] Photo upload system
- [ ] Text-based entry
- [ ] Claude API integration
- [ ] Database hierarchy implementation

### Phase 4: Tracker & Progress
- [ ] Real-time daily tracker UI
- [ ] Progress visualization
- [ ] Coaching messages
- [ ] Weekly/monthly views

## 🧪 Testing

```bash
npm run test
# or
yarn test
```

## 📦 Building for Production

```bash
npm run build
npm start
# or
yarn build
yarn start
```

## 🚢 Deployment

The app is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

## 📄 License

MIT

## 🆘 Troubleshooting

### Database Connection Issues
- Verify your Supabase URL and anon key in `.env.local`
- Check that the database schema has been run
- Ensure RLS policies are enabled

### Image Upload Issues
- Confirm Supabase Storage is set up
- Check that the `food-images` bucket exists
- Verify storage policies allow authenticated uploads

### API Rate Limits
- Anthropic API has rate limits - check your usage
- Consider implementing caching for frequent requests

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Anthropic Claude API](https://docs.anthropic.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

Built with ❤️ using Next.js, Supabase, and Claude AI
