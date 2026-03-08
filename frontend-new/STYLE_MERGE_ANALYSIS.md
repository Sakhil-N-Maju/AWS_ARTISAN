# Global Styles Merge Analysis

## Overview
This document analyzes the differences between the two globals.css files and documents the merge strategy.

## Source Files
1. **Current Production** (`frontend-new/app/globals.css`): Warm earthy palette with black primary & gold accents
2. **Reference Frontend** (`frontend-new/styles/globals.css`): Standard oklch color system

## Key Differences

### Color System
- **Production**: Uses named color variables (warm-cream, warm-sand, etc.) with hex values
- **Reference**: Uses oklch color space for better color manipulation

### Custom Variables
- **Production**: Has custom warm palette variables (warm-cream, warm-sand, warm-terracotta, etc.)
- **Reference**: Uses standard CSS color variables only

### Utility Classes
- **Production**: Has custom utility classes:
  - `.hero-gradient`
  - `.section-divider`
  - `.card-hover`
  - `.card-light`
  - `.accent-underline`
  - `.bg-floral-soft`
  - `.bg-floral-full`
  - `.animate-slide-up`
- **Reference**: No custom utility classes

### Imports
- **Production**: `@import 'tailwindcss';`
- **Reference**: `@import 'tailwindcss';` and `@import 'tw-animate-css';`
- **Decision**: Keep only `@import 'tailwindcss';` as Tailwind CSS v4 has built-in animation support and tw-animate-css is not installed

### Font Configuration
- **Production**: Includes `--font-serif` variable
- **Reference**: Only `--font-sans` and `--font-mono`

## Merge Strategy

### 1. Preserve Production Color Palette
The production warm earthy palette is intentional and should be preserved as it defines the brand identity.

### 2. Animation Support
The reference frontend imports `tw-animate-css`, but this is not needed as:
- Tailwind CSS v4 has built-in animation support
- The package is not installed in the project
- All animation classes used in the codebase are either standard Tailwind (animate-spin, animate-pulse, animate-bounce) or custom-defined (animate-slide-up)

### 3. Add Missing Variables
Add `--popover` and `--popover-foreground` variables from reference frontend.

### 4. Preserve Custom Utilities
Keep all custom utility classes from production as they are used throughout the application.

### 5. Dark Mode Support
Both files have dark mode support - production version is more aligned with the warm palette.

## Conflicts Identified

### None - Complementary Features
The two files are complementary rather than conflicting:
- Production has brand-specific colors and utilities
- Reference has additional animation support and popover variables

## Recommendations

1. **Merge approach**: Add missing features from reference to production
2. **Keep**: Production color palette (warm earthy theme)
3. **Add**: Animation import and popover variables from reference
4. **Preserve**: All custom utility classes from production

## Implementation

The merged file:
1. Starts with production globals.css as base (warm earthy palette)
2. Adds `--popover` and `--popover-foreground` variables to both :root and .dark
3. Adds corresponding theme inline variables for popover colors
4. Keeps all existing custom utilities and animations
5. Does NOT add tw-animate-css import (not needed with Tailwind CSS v4)
