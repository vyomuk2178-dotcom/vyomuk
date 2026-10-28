# Contributing to OpenLearn AI

Thank you for your interest in contributing to OpenLearn AI! We welcome bug fixes, documentation improvements, new language localizations, and accessibility enhancements.

## Code of Conduct
Please review our [Code of Conduct](./CODE_OF_CONDUCT.md). All contributors are expected to uphold a welcoming, respectful environment.

## How Can You Contribute?
1. **Reporting Bugs:** File an issue using our bug report template detailing the browser, steps to reproduce, and sample educational text if applicable.
2. **Suggesting Enhancements:** Open a feature request discussing the educational need and accessibility impact.
3. **Language Translations:** Help improve terminology mappings and translations for regional languages (e.g., Hindi, Marathi, Bengali, Tamil).
4. **Accessibility Audits:** Review contrast ratios, screen-reader headings, and keyboard navigation flows.

## Development Workflow
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feature/accessible-flashcard-timer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Run type-checking and linter:
   ```bash
   npm run lint
   ```
5. Ensure production build succeeds:
   ```bash
   npm run build
   ```
6. Commit your changes with clear semantic messages and push your branch:
   ```bash
   git commit -m "feat(activities): add accessible timer option for quizzes"
   ```
7. Open a Pull Request referencing any related issues.
