# Flip Skateshop — Frontend

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-4.36-FF4154?logo=react-query&logoColor=white)](https://tanstack.com/query/latest)
[![Stripe](https://img.shields.io/badge/Stripe-Payment_Integration-635BFF?logo=stripe&logoColor=white)](https://stripe.com/)

**Flip Skateshop Frontend** is a modern e-commerce single-page application built with **React**, **TypeScript**, and **TailwindCSS**. It provides a fluid, responsive, and secure shopping experience for skateboards and streetwear, complete with customer accounts, order management, interactive payments, and an administrative back-office.

> **Backend Repository**: This application communicates with the REST API provided by [**flip_backend**](https://github.com/thomas-btst/flip_backend).

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Architecture](#architecture)
4. [Environment Variables](#environment-variables)
5. [Getting Started](#getting-started)
6. [Available Scripts](#available-scripts)
7. [Docker](#docker)
8. [Contributing](#contributing)
9. [Author and License](#author-and-license)

## Features

### Catalog & Product Browsing
- **Dynamic Catalog**: Infinite scroll and masonry grid layouts for intuitive product discovery.
- **Search & Filtering**: Real-time product search by name, category, and specifications.
- **Product Details**: High-resolution image galleries, dynamic pricing, stock availability, and size selections.

### Authentication & Customer Accounts
- **Secure Authentication**: User registration and login powered by JWT.
- **Account Verification**: Email activation workflow for new accounts.
- **Password Management**: Password strength meter and self-service password reset via email tokens.
- **User Profile**: Update profile details, shipping addresses, and personal preferences.

### Cart & Checkout Flow
- **Shopping Cart**: Real-time cart state management (add, update quantities, delete, price calculation).
- **Secure Stripe Checkout**: Embedded payment form leveraging **Stripe Elements** for credit card processing.
- **Order Confirmation**: Instant feedback and payment status resolution pages.

### Orders & Tracking
- **Customer Order History**: View previous orders with detailed line items and pricing breakdown.
- **Order Status Tracking**: Real-time tracking of order fulfillment states.

### Admin Back-Office
- **Analytics & Dashboard**: Sales metrics and performance visualization with interactive charts (**Recharts**).
- **Product Management (CRUD)**: Create, view, edit, and delete products, categories, and inventory.
- **Order Administration**: Monitor all customer orders, update fulfillment statuses, and inspect details.
- **User Management**: View registered users, manage account permissions, and assign roles.

### UI / UX & Design
- **Responsive Layout**: Mobile-first design styled with **TailwindCSS**.
- **Smooth Animations**: Animated transitions and interactive micro-interactions powered by **Framer Motion**.
- **Accessible Icons**: Vector icons powered by **FontAwesome**.

## Technologies Used

| Category | Technology |
|---|---|
| **Core Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Bundler & Tooling** | [Vite](https://vite.dev/) |
| **Styling** | [TailwindCSS](https://tailwindcss.com/), [Emotion](https://emotion.sh/) |
| **Routing** | [React Router DOM v6](https://reactrouter.com/) |
| **State & Data Fetching** | [TanStack React Query](https://tanstack.com/query/latest), [Axios](https://axios-http.com/) |
| **Payment Gateway** | [Stripe.js](https://stripe.com/) & [@stripe/react-stripe-js](https://github.com/stripe/react-stripe-js) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Animations & UI Utilities** | [Framer Motion](https://www.framer.com/motion/), [React Masonry CSS](https://github.com/paulcollett/react-masonry-css), [React Infinite Scroller](https://github.com/danivek/react-infinite-scroll-component), [FontAwesome](https://fontawesome.com/) |
| **Code Quality** | [ESLint](https://eslint.org/) |

## Architecture

The project follows a modular, feature-based architecture within the `src/` directory:

```
src/
├── api/          # API services, endpoints, DTOs (Data Transfer Objects), and mappers
├── assets/       # Static assets (images, logos, SVGs)
├── components/   # Reusable UI components (buttons, inputs, modals, etc.)
├── config/       # Global configuration files (TanStack Query, Axios, Stripe)
├── contexts/     # React Context providers (Authentication, Cart, etc.)
├── features/     # Feature-specific components and business logic (Cart, Admin, Payment, Auth, Product)
├── hooks/        # Custom reusable React hooks
├── pages/        # Route page components (Home, Search, Account, Admin, Product, etc.)
├── utils/        # Helper functions, formatters, and utility logic
├── App.tsx       # Root component with routing and layout orchestration
└── main.tsx      # Application entrypoint
```

## Environment Variables

The application requires environment variables prefixed with `VITE_` to configure the backend API connection and the Stripe payment gateway.

### 1. Setup `.env` File

Copy the provided `.env.example` file to create your `.env` file at the root of the project:

```bash
cp .env.example .env
```

### 2. Available Variables

| Variable | Required | Description | Example / Default |
|---|---|---|---|
| `VITE_API_URL` | **Yes** | Base URL of the [Flip Backend REST API](https://github.com/thomas-btst/flip_backend) | `http://localhost:8080` |
| `VITE_STRIPE_PUBLIC_KEY` | **Yes** | Stripe Publishable API Key (Test or Live) used by Stripe Elements | `pk_test_...` |

### 3. Example `.env`

```env
# Backend API Base URL
VITE_API_URL="http://localhost:8080"

# Stripe Publishable Key
VITE_STRIPE_PUBLIC_KEY="pk_test_00000000000000000000000000000000000000000000000"
```

> **Note**: Ensure that the [Flip Backend](https://github.com/thomas-btst/flip_backend) is running and reachable at `VITE_API_URL` before testing features like authentication, cart synchronization, or checkout.

## Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** (v22 or higher recommended)
- **[NPM](https://www.npmjs.com/)**
- **[Flip Backend](https://github.com/thomas-btst/flip_backend)** running locally or accessible remotely.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/thomas-btst/flip_frontend.git
   cd flip_frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create and fill your `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```
   *(See [Environment Variables](#environment-variables) for detailed configuration).*

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## Available Scripts

In the project directory, you can run:

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server with Vite HMR (Hot Module Replacement). |
| `npm run build` | Compiles TypeScript declarations and creates an optimized production bundle. |
| `npm run preview` | Locally previews the production build. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |

## Docker

You can also build and run the frontend using Docker:

```bash
# Build the Docker image
docker build -t flip-frontend .

# Run the container
docker run -p 5173:5173 flip-frontend
```

## Contributing

Before submitting a pull request or pushing changes, please ensure:

1. **Build verification**: Ensure the project compiles without errors:
   ```bash
   npm run build
   ```
2. **Code Quality**: Verify code style and linting standards:
   ```bash
   npm run lint
   ```

## Author and License

- **Author**: Thomas BATISTA
- **Institution**: IUT of Arles - BUT Informatique
- **License**: Developed for academic and educational purposes.