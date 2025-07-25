
# Contributing to iTea Flow

Thank you for your interest in contributing to iTea Flow! This guide will help you get started.

## Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/itea-flow.git
   cd itea-flow
   npm install
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## Testing Your Changes

### User Role Testing
Always test your changes with different user roles:

1. **Producer Role**: `producer@demo.com` / `demo123`
2. **Buyer Role**: `buyer@demo.com` / `demo123`
3. **KTDA Board**: `board@demo.com` / `demo123`
4. **Operations Admin**: `ops@demo.com` / `demo123`

### Key Workflows to Test
- User registration and login
- Bid processing workflow
- Payment operations
- Wallet management
- Document generation
- Real-time features

### Testing Checklist
- [ ] Application starts without errors
- [ ] All user roles can login
- [ ] Navigation works correctly
- [ ] Core workflows function properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] Type checking passes (`npm run check`)

## Code Standards

### TypeScript
- Use strict TypeScript
- Properly type all props and function parameters
- Leverage shared types in `/shared` directory

### React Components
- Use functional components with hooks
- Implement proper error boundaries
- Follow shadcn/ui patterns for consistency

### API Development
- Add proper error handling
- Use consistent response formats
- Document new endpoints

## Submission Guidelines

1. **Commit Messages**
   ```
   feat: add new payment processing feature
   fix: resolve bid status update issue
   docs: update API documentation
   style: improve mobile responsive design
   ```

2. **Pull Request Process**
   - Create PR with clear description
   - Include screenshots for UI changes
   - List breaking changes if any
   - Reference related issues

3. **Review Process**
   - All PRs require review
   - Address feedback promptly
   - Keep PRs focused and small

## Getting Help

- Open an issue for bugs or feature requests
- Join discussions in existing issues
- Ask questions in pull request comments

Thank you for contributing to iTea Flow!
