# Tailwind CSS v4 Migration Guide

## Installation Complete ✅

Successfully installed and configured:

- Tailwind CSS v4.0.0 (beta)
- @tailwindcss/postcss v4.0.0
- PostCSS configuration
- Tailwind configuration with Japanese design system

## Configuration Structure

### 1. Tailwind Config (`tailwind.config.js`)

- Custom Japanese color palette (shu, enji, sango colors)
- Ma (間) spacing system for Japanese design principles
- Custom animations (fade-in, slide-up, slide-down, scale-in)
- Japanese-specific shadows and border radius

### 2. PostCSS Config (`postcss.config.js`)

- Using @tailwindcss/postcss plugin (v4 format)
- Autoprefixer for browser compatibility

### 3. Tailwind CSS Entry (`src/scss/tailwind.scss`)

- Tailwind base, components, and utilities layers
- CSS-first configuration using @theme directive (v4 feature)
- Custom component classes using @layer

## Migration Strategy

### Phase 1: Parallel Implementation ✅

- Keep Bootstrap for existing functionality
- Add Tailwind alongside Bootstrap
- Gradual migration of components

### Phase 2: Component Migration (In Progress)

- Convert Bootstrap utilities to Tailwind classes
- Migrate custom SCSS components to Tailwind

### Phase 3: Bootstrap Removal (Future)

- Remove Bootstrap dependencies
- Pure Tailwind implementation

## Utility Class Mapping

### Spacing

| Bootstrap | Tailwind | Japanese Custom |
|-----------|----------|-----------------|
| `p-5` | `p-5` | `p-ma-lg` |
| `m-3` | `m-3` | `m-ma-md` |
| `px-5` | `px-5` | `px-ma-xl` |

### Colors

| CSS Variable | Tailwind Class |
|--------------|----------------|
| `var(--shu-primary)` | `text-shu-primary`, `bg-shu-primary` |
| `var(--enji-secondary)` | `text-enji-secondary`, `bg-enji-secondary` |
| `var(--sango-accent)` | `text-sango-accent`, `bg-sango-accent` |

### Flexbox & Grid

| Bootstrap | Tailwind |
|-----------|----------|
| `d-flex` | `flex` |
| `justify-content-center` | `justify-center` |
| `align-items-center` | `items-center` |
| `row` | `grid` or `flex` |
| `col-lg-6` | `lg:w-1/2` or `lg:col-span-6` |

### Display & Visibility

| Bootstrap | Tailwind |
|-----------|----------|
| `d-none` | `hidden` |
| `d-block` | `block` |
| `d-inline-block` | `inline-block` |
| `d-lg-block` | `lg:block` |

### Text

| Bootstrap | Tailwind |
|-----------|----------|
| `text-center` | `text-center` |
| `text-start` | `text-left` |
| `text-end` | `text-right` |
| `fw-bold` | `font-bold` |

## Custom Components

### Japanese Buttons

```pug
// Old Bootstrap way
a.btn.btn-primary

// New Tailwind way
a.btn-japanese-primary

// Or using utilities directly
a.px-6.py-3.bg-shu-primary.text-white.rounded-japanese
```

### Japanese Cards

```pug
// Old Bootstrap way
.card

// New Tailwind way
.card-japanese

// Or using utilities directly
.bg-white.dark:bg-dark-surface.rounded-japanese.shadow-japanese.p-ma-lg
```

### Section Spacing with Ma

```pug
// Old way
section.py-5

// New Tailwind way with Ma
section.section-ma

// Or using utilities directly
section.py-ma-xl.md:py-ma-2xl.lg:py-ma-3xl
```

## Dark Mode Support

Tailwind v4 provides automatic dark mode support:

```pug
// Light/dark responsive
div.bg-white.dark:bg-dark-surface
p.text-gray-900.dark:text-gray-100
```

## Performance Considerations

1. **PurgeCSS Integration**: Already configured in Gruntfile.js
2. **Tailwind JIT**: v4 includes Just-In-Time compilation by default
3. **Tree-shaking**: Only used utilities are included in final CSS

## Build Process Updates

The build process has been updated to:

1. Process SCSS with Sass
2. Apply Tailwind transformations via PostCSS
3. Apply autoprefixer for browser compatibility
4. Minify in production

## Testing

Run build to test:

```bash
bun run build
```

For development with watch:

```bash
bun start
```

## Next Steps

1. ✅ Install and configure Tailwind v4
2. ✅ Set up PostCSS pipeline
3. ✅ Create custom component classes
4. 🔄 Begin migrating templates from Bootstrap to Tailwind
5. ⏳ Update all Pug templates
6. ⏳ Remove Bootstrap dependency
7. ⏳ Optimize bundle size

## Resources

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs/v4-beta)
- [Tailwind CSS v4 Blog Post](https://tailwindcss.com/blog/tailwindcss-v4-beta)
- [PostCSS Documentation](https://postcss.org/)
