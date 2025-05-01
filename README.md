# Job Hunt Tracker

A comprehensive application to help job seekers organize and manage their job search process from start to finish.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Key Components](#key-components)
- [Subscription Plans](#subscription-plans)
- [Project Structure](#project-structure)
- [Development](#development)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Job Hunt Tracker is a full-featured application that serves as a personal organizer for job seekers. Unlike job boards such as LinkedIn or Indeed which focus on finding jobs, this platform helps users stay organized after they've found potential positions to apply for. It's designed to be a personal assistant that helps job seekers keep everything in one place and never miss important deadlines or follow-ups during their job search journey.

## Features

### Authentication & User Management

- Email and password-based authentication
- JWT-based session management
- Password reset functionality
- User profile management

### Dashboard

- Overview of job search metrics
- Recent application activity tracking
- Upcoming tasks and interview reminders
- Visual progress indicators

### Job Application Tracking

- Track all job applications in one place
- Update application status (Applied, Screening, Interview, Offer, Rejected)
- Store job descriptions, requirements, and salary information
- Record interview experiences and outcomes

### Task Management

- Create and assign tasks related to job search
- Set priorities and due dates
- Track task completion status
- Filter and sort by various criteria

### Contact Management

- Store recruiter and networking contact information
- Log interaction history with each contact
- Set follow-up reminders
- Tag and categorize professional connections

### Document Storage

- Upload and store multiple resume versions
- Manage cover letters for different applications
- Organize documents by tags and categories
- Access documents from anywhere

### Subscription System

- Free tier with basic features
- Premium plans with advanced capabilities
- Integrated payment system via Razorpay
- Subscription management

## Technology Stack

### Frontend

- **Framework**: React.js 18
- **Routing**: React Router v6
- **State Management**: Context API
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form (optional)

### Backend

- **Server**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Local storage with option for cloud integration
- **Payment Gateway**: Razorpay

## Project Architecture

The project follows a modular architecture with clear separation of concerns:

### Frontend Architecture

```
src/
├── components/       # Reusable UI components
├── context/          # Application state management
├── hooks/            # Custom React hooks
├── pages/            # Feature-specific pages
├── services/         # API integration layer
└── utils/            # Helper utilities
```

### Backend Architecture

```
src/
├── config/           # Environment & app configuration
├── controllers/      # Request handlers
├── middleware/       # Express middlewares
├── models/           # Mongoose data models
├── routes/           # API route definitions
├── services/         # Business logic
└── utils/            # Helper utilities
```

## Getting Started

### Prerequisites

- Node.js (v14.0+)
- npm or yarn
- MongoDB instance
- Razorpay account for payments

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/job-hunt-tracker.git
   cd job-hunt-tracker
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file based on `.env.example`

   ```
   REACT_APP_API_URL=http://localhost:5000/api/v1
   REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

4. Start the development server
   ```bash
   npm start
   # or
   yarn start
   ```

## Key Components

### Authentication System

The authentication system (`src/context/AuthContext.js`) provides a secure and seamless user experience:

- JWT-based authentication with token refresh capabilities
- Protected routes that redirect unauthenticated users
- Password reset via email links
- Persistent sessions using localStorage with secure handling

**Significance**: Provides app-wide authentication state and methods, eliminating prop drilling and ensuring consistent security throughout the application.

### Data Management

The data context (`src/context/DataContext.js`) serves as the central data store:

- Centralizes all API calls and data manipulation
- Provides CRUD operations for all data entities
- Manages loading and error states consistently
- Implements optimistic updates for better UX

**Significance**: Creates a clean, consistent interface for components to interact with backend data while handling complex operations like token refresh and error management.

### Layout Components

The layout system (`src/components/dashboard/DashboardLayout.js`) provides consistent structure:

- Responsive sidebar navigation that collapses on mobile
- Top navigation with search and user settings
- Content container with consistent padding and max-width
- Footer with links and copyright information

**Significance**: Ensures visual consistency while simplifying page component development by abstracting away layout concerns.

### Service Layer

The service layer (`src/services/`) separates API communication from UI:

- Implements API endpoints with consistent error handling
- Formats request and response data
- Manages authentication headers
- Provides domain-specific services (jobs, tasks, contacts)

**Significance**: Creates a clean separation between data fetching and UI rendering, making the codebase more maintainable and testable.

## Subscription Plans

The application offers multiple subscription tiers:

### Free Plan

- Limited to 10 job applications
- Basic task management
- Up to 5 contacts
- 10MB document storage

### Premium Plan

- Unlimited job applications
- Advanced task management with reminders
- Unlimited contacts
- 100MB document storage
- Advanced analytics and reporting

### Enterprise Plan

- Everything in Premium
- Team collaboration features
- Custom branding
- Priority support
- Unlimited document storage

## Project Structure

```
.
├── package.json
├── package-lock.json
├── public/
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── src/
│   ├── App.js               # Main app component with routes
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components
│   │   │   ├── Footer.js    # Footer component
│   │   │   ├── Navbar.js    # Top navigation bar
│   │   │   └── Sidebar.js   # Side navigation
│   │   ├── dashboard/       # Dashboard-specific components
│   │   │   └── DashboardLayout.js  # Layout wrapper
│   │   └── protectedRoute.js # Authentication guard
│   ├── context/             # Application state
│   │   ├── AuthContext.js   # Authentication state and methods
│   │   └── DataContext.js   # Application data state
│   ├── hooks/               # Custom React hooks
│   │   ├── useCurrentPlans.js  # Plan management hook
│   │   └── useRazerpay.js   # Payment gateway hook
│   ├── index.css            # Global styles
│   ├── index.js             # React entry point
│   ├── pages/               # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── ForgotPasswordPage.js
│   │   │   ├── LoginPage.js
│   │   │   ├── ResetPasswordPage.js
│   │   │   ├── SignupPage.js
│   │   │   └── SignupWithPlanPage.js
│   │   ├── dashboard/       # Main application pages
│   │   │   ├── ApplicationsPage.js
│   │   │   ├── ContactDetailsPage.js
│   │   │   ├── ContactFormPage.js
│   │   │   ├── ContactPage.js
│   │   │   ├── DashboardPage.js
│   │   │   ├── InterviewFormPage.js
│   │   │   ├── JobDetailsPage.js
│   │   │   ├── JobFormPage.js
│   │   │   ├── ProfilePage.js
│   │   │   ├── TaskDetailsPage.js
│   │   │   ├── TaskFormPage.js
│   │   │   └── TasksPage.js
│   │   └── plans/          # Subscription-related pages
│   │       ├── PaymentHistoryPage.js
│   │       ├── PaymentPage.js
│   │       ├── PlansPage.js
│   │       └── SubscriptionPage.js
│   ├── services/           # API integration
│   │   ├── analyticsService.js
│   │   ├── authService.js
│   │   ├── contactService.js
│   │   ├── index.js        # Service exports
│   │   ├── jobService.js
│   │   ├── paymentService.js
│   │   ├── planService.js
│   │   └── taskService.js
│   └── utils/              # Utilities
│       ├── axiosConfig.js  # HTTP client setup
│       └── razerpay.js     # Payment integration
└── tailwind.config.js      # Tailwind CSS configuration
```

### Key Files and Their Significance

- **App.js**: Central routing configuration that defines all application routes and wraps components with required providers.

- **AuthContext.js**: Manages authentication state, user data, and provides login/logout functionality throughout the application.

- **DataContext.js**: Central data management that abstracts away API calls and provides data operations to all components.

- **DashboardLayout.js**: Layout wrapper used by all authenticated pages to maintain consistent UI.

- **protectedRoute.js**: Route guard that prevents unauthenticated access to protected pages.

- **axiosConfig.js**: Configures axios with interceptors for authentication and error handling.

- **Service files**: Domain-specific API integration (jobs, tasks, contacts) that separate data fetching from UI components.

## Development

### Code Style

The project follows modern React practices:

- Functional components with hooks
- Context API for state management
- Async/await for asynchronous operations
- React Router v6 patterns

### Recommended Extensions

For VS Code users:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets

### Scripts

- `npm start` - Start development server
- `npm build` - Build production version
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## Deployment

The frontend can be deployed to various platforms:

### Static Hosting (Recommended)

- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Setup Instructions

1. Build the production version

   ```bash
   npm run build
   ```

2. Deploy the `build` folder to your chosen platform

3. Configure environment variables on your hosting platform

   - `REACT_APP_API_URL`
   - `REACT_APP_RAZORPAY_KEY_ID`

4. Set up proper redirects for SPA routing
   - Create a `_redirects` file for Netlify
   - Configure rewrites for other platforms

## Contributing

We welcome contributions to the Job Hunt Tracker project!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Acknowledgements

- [Create React App](https://create-react-app.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Razorpay](https://razorpay.com/)

```

```
