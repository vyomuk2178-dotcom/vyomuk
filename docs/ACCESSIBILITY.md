# WCAG 2.2 Level AA Accessibility Guide

OpenLearn AI is engineered to empower learners with disabilities, neurodivergence, or reading challenges.

## Key Conformance Features
- **Visual Focus Indicators:** High-contrast 3px indigo outline on all interactive targets.
- **Color Contrast:** Conforms to 4.5:1 ratio for normal text and 3:1 for large graphical components.
- **Dyslexia Typography:** Lexend font integration to maximize character distinction and decrease visual crowding.
- **Text Scaling:** Fluid text size scaling up to 140% without breaking column layouts or obscuring buttons.
- **Screen Reader Support:** Accessible names, ARIA roles (`role="dialog"`, `aria-modal="true"`, `aria-label`), and live status regions.
- **Reduced Motion:** Automatic suppression of animations when `prefers-reduced-motion: reduce` is detected.
- **Keyboard Navigation:** Full flashcard cycling (`Space`, `ArrowLeft`, `ArrowRight`), drawer toggles (`Escape`), and `Skip to main content` bypass.
