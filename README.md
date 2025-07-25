
# iTea Flow - Tea Trading Platform

A comprehensive tea trading platform powered by Elastic OS, designed for producers, buyers, and KTDA board operations.

## Features

- **Multi-role Authentication**: Producer, Buyer, KTDA Board, and Operations Admin roles
- **Tea Workflow Management**: Complete bid processing from intake to tea release
- **Financial Operations**: Wallet management, payments, sweeps, and transaction tracking
- **Real-time Analytics**: Trade pulse analytics and business intelligence
- **Document Management**: E-slip generation, certificates, and document center
- **Directory Management**: Entity profiles and relationship tracking

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **UI Framework**: shadcn/ui + Tailwind CSS
- **State Management**: TanStack Query
- **Database**: In-memory storage (development)
- **Real-time**: WebSocket support

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd itea-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser to `http://localhost:5000`
   - The app runs both frontend and backend on port 5000

### Demo Accounts

Use these accounts to test different user roles:

- **Producer**: `producer@demo.com` / `demo123`
- **Buyer**: `buyer@demo.com` / `demo123`
- **KTDA Board**: `board@demo.com` / `demo123`
- **Operations Admin**: `ops@demo.com` / `demo123`

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── contexts/       # React contexts
│   │   └── lib/            # Utilities and API client
├── server/                 # Express backend
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # In-memory data storage
└── shared/                # Shared types and schemas
```

## Key Workflows

### Registration Process
1. Visit `/register` or click "Create Account" from login
2. Complete 3-step registration:
   - Role selection and credentials
   - Organization details
   - Payment setup

### Bid Processing Workflow
1. **Bid Intake**: Process incoming bids and validate data
2. **Payment Matching**: Match payments to bids automatically
3. **Split Processing**: Handle bid splits and beneficiary allocation
4. **Payout Approval**: Approve payouts for beneficiaries
5. **Tea Release**: Generate certificates and release tea

### Financial Operations
- **Wallets**: Manage multiple currency wallets
- **Payments**: Send/receive payments with approval workflows
- **Sweeps**: Automated and manual fund sweeps between accounts
- **Inflows**: Track and match incoming payments

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run check` - Type checking

### Environment Setup

The application uses in-memory storage for development. No additional database setup required.

### Authentication Flow

1. Login with demo credentials
2. Complete OTP verification (simulated)
3. Access role-specific dashboard
4. Use role switcher for testing different permissions

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/signup` - User registration

### Core Operations
- `GET /api/bids` - Get bids list
- `POST /api/bids` - Create new bid
- `GET /api/wallets` - Get user wallets
- `POST /api/payments` - Create payment

### Real-time Features
- WebSocket connection on `/ws`
- Real-time bid updates
- Live payment notifications

## Testing Different Roles

### Producer Role
- Access to bid submissions
- Tea lot management
- Payment tracking
- Producer-specific analytics

### Buyer Role
- Bid placement and management
- Payment processing
- Purchase history
- Market analytics

### KTDA Board Role
- System oversight
- Approval workflows
- Board-level reporting
- Policy management

### Operations Admin Role
- Full system access
- User management
- System configuration
- Advanced analytics

## Deployment

The application is configured for Replit deployment with:
- Automatic package installation
- Environment detection
- Port configuration (5000)
- Production build optimization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with different user roles
5. Submit a pull request

## Support

For questions or issues:
- Check existing GitHub issues
- Create new issues with detailed descriptions
- Include steps to reproduce any bugs
- Specify which user role you were testing

## License

MIT License - see LICENSE file for details
