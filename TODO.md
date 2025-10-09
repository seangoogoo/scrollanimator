# ScrollAnimator - TODO List

- Check and find how to manage 'debug: true' with custom styles of type 'functions' or 'external' which should actually be buggy,
- Enable 'will-change' tweak (true/false),
- check how behave the 'will-change' injection in case of custom styles of type 'functions' or 'external',
- Add a customzable ID to the injected stylesheet tag.

## 🐛 Debug Mode Issue Investigation

### Overview
Investigation needed for how the `debug: true` configuration option interacts with custom styles in different scenarios.

### Problem Statement
The debug mode adds a `::after` pseudo-element with `data-info` attribute to animated elements (see lines 623-639 in `_generateDefaultStyles()`). However, this debug styling is only injected when using the default CSS template, which creates inconsistent behavior:

- ✅ **Default styles** (`customStyles: null` or `'template'`): Debug styles are injected
- ❌ **Function-based custom styles** (`customStyles: Function`): Debug `::after` styles are NOT injected
- ❌ **External stylesheet mode** (`customStyles: 'external'`): No styles are injected at all

This causes the `data-info` attribute to be set on elements (line 493 in `_aosSelectorsManager()`) but not be visually displayed in custom/external style scenarios.

---

## 📋 Tasks

### High Priority

- [ ] **Verify debug mode with function-based custom styles**
  - Create test case with `customStyles` as a function
  - Enable `debug: true`
  - Verify if element information is visually displayed
  - Document actual behavior vs expected behavior
  - Related code: Lines 684-696 in `_injectStyles()`

- [ ] **Verify debug mode with external stylesheet**
  - Create test case with `customStyles: 'external'`
  - Enable `debug: true`
  - Verify if element information is visually displayed
  - Document actual behavior vs expected behavior
  - Related code: Lines 667-677 in `_injectStyles()`

- [ ] **Analyze debug styles injection strategy**
  - Determine if debug styles should be injected separately from animation styles
  - Consider pros/cons of different approaches:
    - Option A: Always inject debug styles when `debug: true`
    - Option B: Require users to include debug styles in custom CSS
    - Option C: Provide a separate method to inject debug styles
  - Document recommendation with rationale

### Medium Priority

- [ ] **Refactor `_injectStyles()` method**
  - Consider splitting into two methods:
    - `_injectAnimationStyles()` - handles animation CSS
    - `_injectDebugStyles()` - handles debug CSS (when `debug: true`)
  - Ensure debug styles are always injected when `debug: true`, regardless of `customStyles` setting
  - Maintain backward compatibility
  - Update JSDoc comments
  - Related code: Lines 665-711

- [ ] **Create comprehensive test suite**
  - Test Scenario 1: Default styles + debug mode
  - Test Scenario 2: Function-based custom styles + debug mode
  - Test Scenario 3: External styles + debug mode
  - Test Scenario 4: String-based custom styles + debug mode
  - Test Scenario 5: Template mode + debug mode
  - Verify visual display of debug information in all scenarios
  - Verify `data-info` attribute is set correctly in all scenarios

- [ ] **Update documentation**
  - Document expected behavior for debug mode with each `customStyles` option
  - Add examples showing debug mode with custom styles
  - Update README with debug mode best practices
  - Add troubleshooting section for debug mode issues

### Low Priority

- [ ] **Consider debug window enhancements**
  - Evaluate if debug window (lines 723-757) provides sufficient information
  - Consider adding toggle button to show/hide debug info
  - Consider adding visual indicators for elements in viewport
  - Explore browser DevTools integration possibilities

- [ ] **Code quality improvements**
  - Add TypeScript definitions for better IDE support
  - Consider adding ESLint configuration
  - Review and optimize debug mode performance impact
  - Add unit tests for debug-related methods

---

## 🔍 Investigation Notes

### Current Debug Mode Implementation

**Debug styles generation** (lines 623-639):
```javascript
if (this._config.debug) {
    css += `
&:after {
    --font-size: 0.585rem;
    content: attr(data-info);
    position: absolute;
    display: block;
    top: calc(var(--font-size) / -2);
    left: 0;
    font-size: var(--font-size);
    font-weight: 300;
    line-height: 1;
    text-align: left;
    color: black;
    background-color: rgba(255,255,255,0.6);
}
`
}
```

**Debug info assignment** (line 493):
```javascript
entry.target.dataset.info = `${this._transition.batchItemNb} | transition duration: ${this._transition.currentSpeed}ms, item delay: ${this._transition.currentDelay}ms, total delay: ${this._transition.delayStack}ms`
```

### Affected Code Sections

1. **`_generateDefaultStyles()`** (lines 606-648)
   - Generates default CSS including debug styles
   - Only called when using default template

2. **`_injectStyles()`** (lines 665-711)
   - Handles CSS injection logic
   - Different paths for custom vs default styles
   - Debug styles only included in default path

3. **`_aosSelectorsManager()`** (lines 477-531)
   - Sets `data-info` attribute regardless of style mode
   - Assumes debug styles are available

---

## 💡 Proposed Solutions

### Solution A: Separate Debug Styles Injection (Recommended)

**Approach**: Always inject debug styles separately when `debug: true`

**Pros**:
- Consistent debug experience across all style modes
- Clean separation of concerns
- No breaking changes for users

**Cons**:
- Adds another `<style>` element to DOM
- Slightly more complex implementation

**Implementation outline**:
```javascript
_injectStyles() {
    // Inject animation styles (existing logic)
    // ...

    // Always inject debug styles if debug mode enabled
    if (this._config.debug) {
        this._injectDebugStyles()
    }
}

_injectDebugStyles() {
    const debugStyleElement = document.createElement('style')
    debugStyleElement.textContent = `
        .${this._config.mainClassName}:after {
            /* debug styles */
        }
    `
    this._elements.debugStyleElement = debugStyleElement
    document.head.appendChild(debugStyleElement)
}
```

### Solution B: Document Current Behavior

**Approach**: Keep current implementation, document limitations

**Pros**:
- No code changes required
- Maintains current behavior

**Cons**:
- Inconsistent user experience
- Users must manually add debug styles for custom CSS
- Confusing for developers

### Solution C: Provide Debug Styles Helper

**Approach**: Provide a static method to generate debug styles

**Pros**:
- Flexible for users
- No automatic injection concerns

**Cons**:
- Requires manual integration by users
- More complex setup

---

## 📝 Additional Considerations

### Breaking Changes Assessment
- Any changes to debug mode should maintain backward compatibility
- Consider deprecation warnings if behavior changes
- Version bump strategy (patch vs minor vs major)

### Performance Impact
- Debug mode should have minimal performance impact
- Consider lazy loading debug styles
- Evaluate memory footprint of debug features

### Browser Compatibility
- Ensure debug styles work across all supported browsers
- Test `::after` pseudo-element behavior
- Verify `attr()` CSS function support

---

## 🎯 Success Criteria

- [ ] Debug mode displays element information consistently across all `customStyles` options
- [ ] Documentation clearly explains debug mode behavior
- [ ] Test suite covers all debug mode scenarios
- [ ] No breaking changes for existing users
- [ ] Performance impact is negligible

---

## 📅 Timeline

- **Week 1**: Investigation and testing (Tasks 1-3)
- **Week 2**: Implementation and refactoring (Task 4)
- **Week 3**: Testing and documentation (Tasks 5-6)
- **Week 4**: Review and release

---

*Last updated: 2025-10-09*

