# BharatLens

**Discover and compare Indian and global brands — make informed, conscious buying decisions**

BharatLens is an AI-powered brand comparison tool that helps users discover quality Indian alternatives alongside global brands. By leveraging real-time web search and AI analysis, it provides comprehensive brand comparisons to support conscious consumer choices and promote Indian excellence.

## 🚀 Quick Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

4. **Required API Keys** - Add these to your `.env` file:
   - **EXA_API_KEY**: Get from https://exa.ai/ (for real-time web search)
   - **GEMINI_API_KEY**: Get from https://aistudio.google.com/app/apikey (for AI analysis)

5. Start the development server:
   ```bash
   npm run dev
   ```

### ⚠️ Important: API Keys Required
Without the API keys, the search functionality will not work. Make sure to:
1. Sign up at https://exa.ai/ and get your EXA API key
2. Get your GEMINI API key from https://aistudio.google.com/app/apikey
3. Add both keys to your `.env` file

## ✨ Features

- **AI-Powered Analysis**: Get intelligent brand comparisons using Gemini 2.5 Flash
- **Real-Time Data**: Search results powered by Exa AI for current market information
- **Indian Brand Discovery**: Highlight quality Indian alternatives in every product category
- **Comprehensive Comparisons**: Detailed pros, cons, and descriptions for each brand
- **Official Links**: Direct links to brand websites for easy access
- **Responsive Design**: Beautiful, mobile-first interface built with shadcn/ui
- **Fast Performance**: Lightning-fast search and results powered by modern web technologies

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality, accessible UI components
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Lucide React** - Beautiful icons

### Backend & AI
- **Supabase** - Backend-as-a-Service with Edge Functions
- **Exa AI** - Real-time web search and content extraction
- **Gemini 2.5 Flash** - AI analysis and brand comparison generation
- **Lovable AI Gateway** - AI model access and management

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📋 Prerequisites

Before setting up BharatLens, ensure you have:

- **Node.js** (v18 or higher) - [Install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** or **yarn** package manager
- **Supabase CLI** - [Installation guide](https://supabase.com/docs/guides/cli)
- **Git** for version control

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd bharatlens
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
```

### 4. Supabase Setup

#### Local Development
```bash
# Start Supabase locally
supabase start

# Deploy Edge Functions
supabase functions deploy search-brands
```

#### Production Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Update your `.env` file with production credentials
3. Deploy the Edge Function:
```bash
supabase functions deploy search-brands --project-ref your-project-id
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔑 API Configuration

### Required API Keys

BharatLens requires the following API keys to be configured in your Supabase project:

#### 1. Exa AI API Key
- Sign up at [Exa AI](https://exa.ai)
- Get your API key from the dashboard
- Add to Supabase Edge Function secrets:
```bash
supabase secrets set EXA_API_KEY=your-exa-api-key
```

#### 2. Lovable API Key
- Available in your Lovable project settings
- Add to Supabase Edge Function secrets:
```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

### Setting Secrets in Supabase

For production deployment:
1. Go to your Supabase project dashboard
2. Navigate to Settings > Edge Functions
3. Add the required environment variables:
   - `EXA_API_KEY`
   - `GEMINI_API_KEY`

## 📁 Project Structure

```
bharatlens/
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── integrations/       # External service integrations
│   ├── lib/                # Utility functions and configurations
│   ├── pages/              # Page components (Home, SearchResults, etc.)
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── supabase/
│   ├── functions/
│   │   └── search-brands/  # Edge Function for AI-powered search
│   └── config.toml         # Supabase configuration
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

## 🚀 Deployment

### Frontend Deployment

#### Using Lovable (Recommended)
1. Open your [Lovable Project](https://lovable.dev/projects/e2990bf9-074f-4a08-86d3-0ca309fbb717)
2. Click Share → Publish
3. Your app will be deployed automatically

#### Manual Deployment
```bash
# Build for production
npm run build

# Deploy to your preferred hosting service
# (Vercel, Netlify, etc.)
```

### Backend Deployment

Ensure your Supabase Edge Functions are deployed:
```bash
supabase functions deploy search-brands --project-ref your-project-id
```

### Custom Domain

To connect a custom domain:
1. Navigate to Project > Settings > Domains in Lovable
2. Click "Connect Domain"
3. Follow the DNS configuration instructions

Read more: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Supabase
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase functions deploy search-brands  # Deploy Edge Function
```

## 🤝 Contributing

We welcome contributions to BharatLens! Here's how you can help:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add TypeScript types for new features
   - Test your changes thoroughly
4. **Commit your changes**
   ```bash
   git commit -m "feat: add your feature description"
   ```
5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**

### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing component structure
- Use shadcn/ui components when possible
- Maintain responsive design principles
- Add proper error handling
- Include JSDoc comments for complex functions

### Areas for Contribution

- **Brand Database**: Help expand our knowledge of Indian brands
- **UI/UX Improvements**: Enhance the user experience
- **Performance Optimization**: Improve search and rendering speed
- **Accessibility**: Make the app more accessible
- **Testing**: Add unit and integration tests
- **Documentation**: Improve guides and API documentation

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Exa AI** for providing real-time web search capabilities
- **Supabase** for the robust backend infrastructure
- **shadcn/ui** for the beautiful component library
- **Lovable** for the AI-powered development platform

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/bharatlens/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for conscious consumers and Indian excellence**
