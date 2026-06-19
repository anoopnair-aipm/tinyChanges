# Contributing to tinyChanges

Thank you for your interest in contributing! This guide will help you get started.

## Code of Conduct

Please be respectful and inclusive. We're building a platform for children and families.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/tinyChanges.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Follow the [Development Guide](./docs/DEVELOPMENT.md) to set up your environment

## Development Workflow

### Before Starting Work

1. Check [Issues](https://github.com/anoopnair-aipm/tinyChanges/issues) and [Discussions](https://github.com/anoopnair-aipm/tinyChanges/discussions)
2. Create an issue for your feature/bug if one doesn't exist
3. Comment on the issue to indicate you're working on it

### Making Changes

1. Keep changes focused and atomic
2. Write clear, descriptive commit messages
3. Add tests for new functionality
4. Update documentation as needed

### Commit Message Format

```
type(scope): description

body (optional)

Closes #issue_number
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(tasks): add task priority levels
fix(auth): resolve Google OAuth redirect issue
docs(api): update endpoint documentation
test(rewards): add reward redemption tests
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier (auto-format on save)
- **Linting**: ESLint
- **Imports**: Absolute imports, organized by groups

**Prettier config**: `.prettierrc.json`
**ESLint config**: `.eslintrc.json`

### Testing Requirements

- Unit tests for business logic
- Integration tests for API endpoints
- UI component tests in frontend

```bash
# Run tests before committing
npm run test

# Check coverage
npm run test:coverage
```

### Frontend Development

- **Framework**: React with Next.js
- **Styling**: Tailwind CSS
- **State Management**: React Context (hooks)
- **Data Fetching**: React Query (recommended)

### Backend Development

- **Framework**: Express.js
- **Database ORM**: TypeORM or Knex.js
- **Validation**: Joi or Zod
- **Error Handling**: Custom error classes

## Pull Request Process

1. **Before submitting**:
   ```bash
   npm run lint:fix
   npm run format
   npm run test
   ```

2. **Create PR with description**:
   - Clear title describing changes
   - Summary of changes
   - Related issue(s)
   - Testing instructions
   - Screenshots (if UI changes)

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   How was this tested?

   ## Checklist
   - [ ] Tests pass
   - [ ] Documentation updated
   - [ ] No console errors
   - [ ] Responsive design verified (if applicable)
   ```

4. **Review and Merge**:
   - Requires 2 approvals
   - All tests must pass
   - No merge conflicts

## Common Tasks

### Adding a New API Endpoint

1. Create route in `backend/src/routes/`
2. Add controller in `backend/src/controllers/`
3. Add types in `backend/src/types/`
4. Write tests in `backend/tests/`
5. Document in `docs/API.md`
6. Add frontend client in `frontend/lib/api.ts`

### Adding a New Page in Frontend

1. Create page in `frontend/app/`
2. Create components in `frontend/components/`
3. Add to navigation if needed
4. Write page tests
5. Test on mobile and desktop

### Database Migration

1. Create migration file:
   ```bash
   cd backend
   npm run db:migrate:create -- --name descriptive_name
   ```

2. Write SQL in migration file
3. Add TypeScript interfaces if needed
4. Test migration up and down
5. Update `docs/DATABASE.md`

## Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Browser/OS information
- Error logs

### Feature Requests
Include:
- Clear description of feature
- Use case/benefit
- Proposed implementation (optional)
- mockups/examples (optional)

## Questions?

- Open a [Discussion](https://github.com/anoopnair-aipm/tinyChanges/discussions)
- Check existing [Issues](https://github.com/anoopnair-aipm/tinyChanges/issues)
- Join our community (link to Discord/Slack if available)

## Recognition

Contributors will be credited in:
- README.md contributors section
- Release notes
- GitHub contributors page

Thank you for making tinyChanges better! 🎯
