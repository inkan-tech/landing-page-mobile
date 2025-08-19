# Bootstrap Usage Audit Report

## Summary
Comprehensive audit of Bootstrap usage across the Sealfie landing page codebase to facilitate complete migration to Tailwind CSS v4 with Japanese design system.

## 🔍 Bootstrap Classes Found

### High Priority Migration (Core Layout)
- `container` → Already using Tailwind `container mx-auto px-5`
- `row` → Convert to Flexbox/Grid utilities
- `col-*` → Convert to Tailwind grid system
- `d-flex` → Already using Tailwind `flex`
- `justify-content-*` → Already using Tailwind `justify-*`

### Medium Priority (UI Components)
- `btn` → Convert to `.btn-japanese-*` system
- `btn-primary` → Use `.btn-japanese-primary`
- `btn-outline-*` → Use `.btn-japanese-secondary`
- `card` → Use `.card-japanese` system

### Low Priority (Utility Classes)
- `px-*`, `py-*` → Already using Tailwind spacing
- `mb-*`, `mt-*` → Already using Tailwind margin
- `text-center` → Already using Tailwind

## 📁 Files Requiring Migration

### Templates (.pug)
1. **src/pug/offline.pug** - Heavy Bootstrap usage
   - `.btn` classes (4 instances)
   - `.offline-container` custom styling
   
2. **src/pug/post-register.pug** - Bootstrap grid system
   - `.row`, `.col-*` classes
   - `.d-flex`, `.align-items-center`
   - Bootstrap button classes

3. **src/pug/includes/feedback-modal.pug** - Bootstrap modal
   - `.btn-close`, `.btn-primary`
   - Bootstrap modal structure

### SCSS Components
1. **src/scss/_global.scss** - Button focus styles
2. **src/scss/sections/_cta.scss** - Outline button styles
3. **src/scss/components/_navbar.scss** - Button styling
4. **src/scss/components/_accessibility.scss** - Button accessibility

## 🎯 Migration Strategy

### Phase 1: Component Conversion (Week 1)
```pug
// OLD Bootstrap
.btn.btn-primary → .btn-japanese-primary
.btn.btn-outline-primary → .btn-japanese-secondary
.card → .card-japanese
```

### Phase 2: Layout System (Week 2)
```pug
// OLD Bootstrap Grid
.row.justify-content-center
  .col-lg-8
    // content

// NEW Tailwind Grid
.grid.justify-center
  div(class="lg:col-span-8")
    // content
```

### Phase 3: Utilities Cleanup (Week 3)
- Remove remaining `.d-*` classes
- Convert `.text-*` positioning
- Update spacing utilities

## 🚧 Files Ready for Immediate Migration

### Minimal Bootstrap Usage (Quick Wins)
- `src/pug/index.pug` - Already mostly Tailwind
- `src/pug/documentation.pug` - Already mostly Tailwind  
- `src/pug/pricing.pug` - Already mostly Tailwind
- `src/pug/support.pug` - Already mostly Tailwind
- `src/pug/challenge.pug` - Already mostly Tailwind
- `src/pug/press.pug` - Already mostly Tailwind

### Moderate Bootstrap Usage (Requires Planning)
- `src/pug/offline.pug` - Custom button styling
- `src/pug/post-register.pug` - Grid system usage
- `src/pug/includes/feedback-modal.pug` - Modal components

## 📊 Migration Impact Assessment

### Bundle Size Impact
- Current Bootstrap usage: ~15% of styles.css
- Post-migration savings: Estimated 8-12KB
- Tailwind Japanese components: Already implemented

### Performance Impact
- Remove Bootstrap dependency completely
- Single CSS framework (Tailwind only)
- Better tree-shaking with Tailwind JIT

## ✅ Japanese Design System Compatibility

### Already Implemented Components
- `.btn-japanese-primary` (Shu red background)
- `.btn-japanese-secondary` (Shu red outline)
- `.card-japanese` (with shadow system)
- `.section-ma` (Ma spacing system)

### Missing Components Needed
- Japanese modal system for feedback modal
- Japanese form components
- Japanese offline page styling

## 🎌 Recommended Japanese Enhancements

### New Component Classes Needed
```scss
// Japanese Modal System
.modal-japanese {
  @apply bg-white dark:bg-dark-surface rounded-japanese shadow-japanese-hover;
}

// Japanese Offline Page  
.offline-japanese {
  @apply bg-gradient-to-br from-shu-primary to-sango-accent;
}

// Japanese Form Elements
.form-japanese {
  @apply border-gray-300 focus:border-shu-primary rounded-japanese;
}
```

## 🚀 Implementation Priority

### Immediate (This Week)
1. Convert `offline.pug` to Japanese design system
2. Update `post-register.pug` grid system
3. Create Japanese modal component for feedback

### Short-term (Next 2 Weeks)
1. Remove all `.btn` references
2. Update SCSS button focus styles
3. Test cross-browser compatibility

### Long-term (1 Month)
1. Complete Bootstrap dependency removal
2. Validate Japanese design consistency
3. Performance audit post-migration

## 📝 Migration Checklist

- [ ] Convert offline page to Japanese styling
- [ ] Update post-register grid system
- [ ] Create Japanese modal component
- [ ] Update button focus states in SCSS
- [ ] Remove Bootstrap button classes from navbar
- [ ] Update accessibility button styles
- [ ] Test all interactive components
- [ ] Validate Japanese color usage
- [ ] Remove Bootstrap from package.json
- [ ] Final performance audit

## 🎯 Success Criteria

1. **Zero Bootstrap classes** in final codebase
2. **Consistent Japanese design** across all components  
3. **Performance improvement** of 8-12KB bundle reduction
4. **Accessibility maintained** for all interactive elements
5. **Cross-browser compatibility** preserved