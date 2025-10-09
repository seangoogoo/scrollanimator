# ScrollAnimator

**Speed-Adaptive Scroll Animation Library**

A lightweight, vanilla JavaScript class that creates smooth, speed-adaptive scroll animations. ScrollAnimator dynamically adjusts animation timing based on scroll velocity, providing a natural and responsive user experience without any external dependencies.

## ✨ Features

- **🚀 Speed-Adaptive Animations** - Automatically adjusts animation duration based on scroll speed
- **🎨 Flexible CSS Injection** - Multiple patterns: default template, custom CSS, function-based, or external stylesheets
- **⚡ Performance Optimized** - Built-in LCP (Largest Contentful Paint) optimization
- **🔧 Highly Configurable** - 15+ configuration options for fine-tuned control
- **♻️ Memory Safe** - Comprehensive cleanup with `destroy()` method for SPA compatibility
- **📦 Zero Dependencies** - Pure vanilla JavaScript, no external libraries required
- **🎯 IntersectionObserver API** - Modern, performant viewport detection
- **🔍 Debug Mode** - Visual indicators and console logs for development
- **📱 Responsive** - Works seamlessly across all device sizes

## 📦 Installation

### Option 1: Direct Download

Download `scroll-animator.js` and include it in your project:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Page</title>

    <!-- Load ScrollAnimator in <head> -->
    <script src="path/to/scroll-animator.js"></script>

    <!-- Initialize in <head> -->
    <script>
        const animator = new ScrollAnimator()
        animator.init()
    </script>
</head>
<body>
    <div class="animate-on-scroll">Content to animate</div>
</body>
</html>
```

### Option 2: ES6 Module (if using a build system)

```javascript
import ScrollAnimator from './scroll-animator.js'

const animator = new ScrollAnimator()
animator.init()
```

## ⚠️ Critical: Script Placement Requirements

**The ScrollAnimator script and initialization code MUST be placed in the `<head>` tag, NOT at the bottom of `<body>`.**

### Why This Matters

ScrollAnimator injects CSS styles dynamically when initialized. These styles define the initial state of animated elements (e.g., `opacity: 0`, `transform: translateY(100px)`).

**If the script runs AFTER body elements are already rendered:**
- Initial CSS states are not applied
- Elements appear in their final state immediately
- Transitions/animations fail to trigger
- You see no animation effect

**The CSS must be injected BEFORE the browser renders body elements.**

### ✅ Correct: Script in `<head>`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Page</title>

    <!-- ✅ CORRECT: Load and initialize in <head> -->
    <script src="scroll-animator.js"></script>
    <script>
        const animator = new ScrollAnimator({
            mainClassName: 'fade-in'
        })
        animator.init()
    </script>
</head>
<body>
    <div class="fade-in">This will animate correctly</div>
    <div class="fade-in">This will also animate</div>
</body>
</html>
```

### ❌ Incorrect: Script at Bottom of `<body>`

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Page</title>
</head>
<body>
    <div class="fade-in">This will NOT animate</div>
    <div class="fade-in">This will NOT animate</div>

    <!-- ❌ WRONG: Script runs after body is rendered -->
    <script src="scroll-animator.js"></script>
    <script>
        const animator = new ScrollAnimator({
            mainClassName: 'fade-in'
        })
        animator.init()
        // CSS injected too late - elements already rendered!
    </script>
</body>
</html>
```

### Alternative: External CSS

If you prefer to place scripts at the bottom of `<body>`, use the `customStyles: 'external'` option with an external stylesheet:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>My Page</title>

    <!-- External CSS in <head> -->
    <style>
        .fade-in {
            opacity: 0;
            transform: translateY(100px);
            transition: all 0.8s ease-out;
        }
        .fade-in.aos-visible {
            opacity: 1;
            transform: translateY(0);
        }
    </style>
</head>
<body>
    <div class="fade-in">This will animate correctly</div>

    <!-- Script can be at bottom when using external CSS -->
    <script src="scroll-animator.js"></script>
    <script>
        const animator = new ScrollAnimator({
            mainClassName: 'fade-in',
            customStyles: 'external' // Skip CSS injection
        })
        animator.init()
    </script>
</body>
</html>
```

### 🔍 Troubleshooting: Animations Not Working?

If your animations aren't triggering, check these common issues:

1. **Script Placement**: Is the script in `<head>` or using `customStyles: 'external'`?
2. **Class Names**: Do your HTML elements have the correct class (default: `animate-on-scroll`)?
3. **Initialization**: Is initialization blocked? (Note: `init()` is called automatically on `window.load`, or call it manually for immediate initialization)
4. **Console Errors**: Check browser console (F12) for error messages
5. **CSS Injection**: Inspect `<head>` - is there a `<style>` element with your animation CSS?
6. **Viewport**: Are elements below the fold? Scroll down to trigger animations
7. **Browser Support**: Does your browser support IntersectionObserver? (IE11 requires polyfill)

**Quick Test**: Open browser console and check if CSS was injected:
```javascript
// Should show injected style element
document.querySelector('head style')
```

## 🚀 Quick Start

### Basic Usage

**Automatic Initialization (Recommended)**

ScrollAnimator automatically initializes on `window.load` event. Simply create an instance:

```javascript
// Create instance - initialization happens automatically on window.load
const animator = new ScrollAnimator()

// That's it! Elements with class "animate-on-scroll" will animate when page loads
```

**Manual Initialization (Optional)**

For immediate control or early initialization:

```javascript
// Create instance and initialize immediately
const animator = new ScrollAnimator()
animator.init() // Initialize before window.load

// Useful for dynamic content or SPA scenarios
```

### HTML Structure

```html
<div class="animate-on-scroll">
    <h2>This will fade in and slide up</h2>
    <p>When it enters the viewport</p>
</div>

<div class="animate-on-scroll">
    <h2>This will also animate</h2>
    <p>With a slight delay after the first element</p>
</div>
```

### Custom Configuration

```javascript
const animator = new ScrollAnimator({
    debug: true,                    // Enable debug mode
    mainClassName: 'fade-in',       // Custom class name
    maxSpeed: 1000,                 // Slower animations
    optimizeLCP: true,              // Optimize for performance
    observerRootMargin: '0px 0px 100px 0px' // Trigger earlier
})

// Automatic initialization on window.load
// Or call animator.init() for immediate initialization
```

### Initialization Behavior

ScrollAnimator provides **automatic initialization** by default, triggered on the `window.load` event. This means you don't need to call `init()` manually in most cases.

**How Automatic Initialization Works:**

1. When you create a ScrollAnimator instance, event listeners are attached
2. On `document.readyState === 'interactive'`, the DOM is queried for elements
3. On `window.load` event, `init()` is called automatically if elements exist
4. Your animations start working without any manual intervention

**When to Use Manual `init()`:**

Manual initialization is useful in specific scenarios:

- **Early Initialization**: Start animations before `window.load` completes
  ```javascript
  const animator = new ScrollAnimator()
  animator.init() // Start immediately
  ```

- **Dynamic Content**: Re-initialize after loading content via AJAX
  ```javascript
  const animator = new ScrollAnimator()
  // Later, after loading new content:
  animator.refresh() // Re-query DOM and restart observation
  ```

- **SPA Route Changes**: Re-initialize when navigating between routes
  ```javascript
  // React example
  useEffect(() => {
      const animator = new ScrollAnimator()
      animator.init() // Initialize on component mount
      return () => animator.destroy() // Cleanup on unmount
  }, [])
  ```

- **Testing**: Explicit control over initialization timing
  ```javascript
  const animator = new ScrollAnimator()
  // Run tests...
  animator.init() // Initialize when ready
  ```

**Best Practice**: Use automatic initialization for standard websites, and manual `init()` only when you need explicit control over timing.

## 📚 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `debug` | boolean | `false` | Enable debug mode with console logs and visual indicators |
| `mainClassName` | string | `'animate-on-scroll'` | CSS class for elements to animate |
| `visibleClassName` | string | `'aos-visible'` | CSS class added when element is visible |
| `translateYvalue` | number | `100` | Y-axis translation in pixels (auto-adjusted for custom CSS) |
| `optimizeLCP` | boolean | `false` | Remove animations from above-the-fold content |
| `maxSpeed` | number | `850` | Max transition duration (ms) for slow scrolling |
| `minSpeed` | number | `650` | Min transition duration (ms) for fast scrolling |
| `delayMax` | number | `120` | Maximum delay between animations (ms) |
| `delayMin` | number | `0` | Minimum delay between animations (ms) |
| `delayStackTweak` | number | `0.5` | Delay multiplier (0-1) for staggered animations |
| `maxScrollSpeed` | number | `1800` | Maximum scroll speed threshold (px/s) |
| `minScrollSpeed` | number | `800` | Minimum scroll speed threshold (px/s) |
| `observerRootMargin` | string | `'0px 0px 70px 0px'` | IntersectionObserver root margin |
| `observerThreshold` | number | `0` | IntersectionObserver threshold (0-1) |
| `customStyles` | null\|string\|Function | `null` | Custom CSS injection pattern (see Custom CSS section) |
| `autoDetectTransform` | boolean | `true` | Auto-adjust translateYvalue for custom CSS |

## 🎨 Custom CSS Patterns

The `customStyles` configuration option controls how ScrollAnimator injects CSS styles into your page. It supports 5 different patterns, each optimized for specific use cases.

### Overview

**What is `customStyles`?**

The `customStyles` option determines:
- **What CSS** gets injected into the `<head>` tag
- **When** CSS injection happens (or if it's skipped)
- **How** animation styles are generated

**Key Features:**
- 🎯 **Flexible**: 5 patterns from zero-config to fully custom
- ⚡ **Automatic**: Built-in template with sensible defaults
- 🔧 **Type-Safe**: Function-based pattern prevents class name mismatches
- 🚀 **Performance**: Minimal CSS injection, no external dependencies
- 🎨 **Creative**: Full control over animation styles

---

### Pattern Comparison Table

| Pattern | Type | CSS Injection | Use Case | Complexity |
|---------|------|---------------|----------|------------|
| **null** (default) | Built-in | ✅ Auto | Quick start, default animations | ⭐ Simple |
| **'template'** | Built-in | ✅ Auto | Default animations with custom config | ⭐ Simple |
| **'external'** | External | ❌ Skip | External stylesheet, CSP compliance | ⭐⭐ Medium |
| **String** | Custom | ✅ Manual | Simple custom animations | ⭐⭐ Medium |
| **Function** | Custom | ✅ Dynamic | Complex animations, type-safety | ⭐⭐⭐ Advanced |

---

### Pattern 1: Default Template (null)

**Type**: `null` (or omit the option)

**When to Use**:
- Quick start with zero configuration
- Default fade-up animation is sufficient
- Prototyping or testing
- Learning ScrollAnimator basics

**What It Does**:
- Uses built-in CSS template
- Injects fade-in + slide-up animation
- Applies `translateYvalue` from config (default: 100px)
- Automatically adjusts timing based on scroll speed

**Example**:

```javascript
// Simplest usage - just create instance
const animator = new ScrollAnimator()

// Or explicitly set to null
const animator = new ScrollAnimator({
    customStyles: null
})

// Customize config values (template uses them)
const animator = new ScrollAnimator({
    customStyles: null,
    translateYvalue: 80,  // Slide up 80px instead of 100px
    maxSpeed: 1000        // Slower animations
})
```

**Generated CSS** (example):
```css
.animate-on-scroll {
    opacity: 0;
    transform: translateY(100px);
    transition: opacity 850ms ease-out, transform 850ms ease-out;
}
.animate-on-scroll.aos-visible {
    opacity: 1;
    transform: translateY(0);
}
```

**Best For**: Beginners, quick prototypes, default animations

---

### Pattern 2: Template with Custom Config ('template')

**Type**: `'template'` (string keyword)

**When to Use**:
- You want the default animation style
- But need to customize timing/distance values
- Explicit about using the template
- Same as `null` but more explicit in code

**What It Does**:
- Identical to `null` pattern
- Uses built-in CSS template
- Respects all config values (`translateYvalue`, `maxSpeed`, etc.)
- More explicit in code intent

**Example**:

```javascript
// Explicitly use template with custom values
const animator = new ScrollAnimator({
    customStyles: 'template',
    translateYvalue: 50,   // Shorter slide distance
    maxSpeed: 1200,        // Slower animations
    minSpeed: 800
})

// Good for team projects - clear intent
const animator = new ScrollAnimator({
    customStyles: 'template', // Explicit: "I want the default template"
    mainClassName: 'slide-up',
    translateYvalue: 60
})
```

**Best For**: Teams, explicit code intent, customizing default animation timing

---

### Pattern 3: External CSS ('external')

**Type**: `'external'` (string keyword)

**When to Use**:
- You have animation CSS in external stylesheet
- Content Security Policy (CSP) restrictions prevent inline styles
- You want full control over CSS loading
- Script must be at bottom of `<body>` (not in `<head>`)
- Build process handles CSS bundling

**What It Does**:
- **Skips CSS injection entirely**
- No `<style>` element created
- Automatically sets `translateYvalue: 0` (unless explicitly set)
- Relies on your external CSS file

**Example**:

```javascript
// JavaScript
const animator = new ScrollAnimator({
    customStyles: 'external',
    mainClassName: 'fade-in'
})
```

```css
/* Your external stylesheet (styles.css) */
.fade-in {
    opacity: 0;
    transition: opacity 0.6s ease;
}
.fade-in.aos-visible {
    opacity: 1;
}
```

```html
<!-- HTML -->
<head>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="fade-in">Content</div>

    <!-- Script can be at bottom when using external CSS -->
    <script src="scroll-animator.js"></script>
    <script>
        const animator = new ScrollAnimator({
            customStyles: 'external'
        })
    </script>
</body>
```

**Important Notes**:
- ⚠️ **Script placement**: Can be in `<body>` (not required in `<head>`)
- ⚠️ **translateYvalue**: Auto-set to `0` (set explicitly if using transforms)
- ⚠️ **Your responsibility**: Ensure CSS is loaded before elements render

**Best For**: CSP compliance, external stylesheets, build processes, script at bottom

---

### Pattern 4: Custom CSS String

**Type**: `string` (CSS as template literal)

**When to Use**:
- Simple custom animations
- One-off animation styles
- Quick customization without external files
- Prototyping different animation styles

**What It Does**:
- Injects your custom CSS string into `<head>`
- No template processing
- Automatically sets `translateYvalue: 0` (unless explicitly set)
- Full control over CSS content

**Examples**:

```javascript
// Simple fade-in only
const animator = new ScrollAnimator({
    mainClassName: 'fade-in',
    customStyles: `
        .fade-in {
            opacity: 0;
            transition: opacity 0.6s ease;
        }
        .fade-in.aos-visible {
            opacity: 1;
        }
    `
})

// Slide from left
const animator = new ScrollAnimator({
    mainClassName: 'slide-left',
    customStyles: `
        .slide-left {
            opacity: 0;
            transform: translateX(-50px);
            transition: all 0.8s ease-out;
        }
        .slide-left.aos-visible {
            opacity: 1;
            transform: translateX(0);
        }
    `
})

// Zoom in with rotation
const animator = new ScrollAnimator({
    mainClassName: 'zoom-rotate',
    customStyles: `
        .zoom-rotate {
            opacity: 0;
            transform: scale(0.8) rotate(-5deg);
            transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .zoom-rotate.aos-visible {
            opacity: 1;
            transform: scale(1) rotate(0);
        }
    `
})
```

**Limitations**:
- ⚠️ **No type-safety**: Class names are hardcoded strings
- ⚠️ **No config integration**: Can't use `translateYvalue` or other config values
- ⚠️ **Typo risk**: Mismatched class names won't be caught

**Best For**: Simple animations, prototyping, one-off styles

---

### Pattern 5: Function-Based CSS (Recommended)

**Type**: `function` (receives config object, returns CSS string)

**When to Use**:
- **Recommended for production use**
- Type-safe class name matching
- Dynamic CSS generation based on config
- Multiple instances with different class names
- Complex animations requiring config values
- Team projects requiring maintainability

**What It Does**:
- Calls your function with config parameters
- Injects returned CSS string into `<head>`
- Automatically sets `translateYvalue: 0` (unless explicitly set)
- Prevents class name mismatches

**Function Signature**:
```javascript
customStyles: (config) => string
```

**Config Object Parameters**:
- `mainClassName` - Main animation class (e.g., 'animate-on-scroll')
- `visibleClassName` - Visible state class (e.g., 'aos-visible')
- `translateYvalue` - Slide distance in pixels
- `maxSpeed` - Maximum animation duration in ms
- `minSpeed` - Minimum animation duration in ms

**Examples**:

```javascript
// Basic function-based CSS (recommended)
const animator = new ScrollAnimator({
    mainClassName: 'zoom-in',
    customStyles: ({ mainClassName, visibleClassName }) => `
        .${mainClassName} {
            opacity: 0;
            transform: scale(0.8);
            transition: all 0.6s ease;
        }
        .${mainClassName}.${visibleClassName} {
            opacity: 1;
            transform: scale(1);
        }
    `
})

// Using all config parameters
const animator = new ScrollAnimator({
    mainClassName: 'slide-up',
    translateYvalue: 60,
    maxSpeed: 1000,
    customStyles: ({ mainClassName, visibleClassName, translateYvalue, maxSpeed }) => `
        .${mainClassName} {
            opacity: 0;
            transform: translateY(${translateYvalue}px);
            transition: all ${maxSpeed}ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        .${mainClassName}.${visibleClassName} {
            opacity: 1;
            transform: translateY(0);
        }
    `
})

// Complex animation with multiple properties
const animator = new ScrollAnimator({
    mainClassName: 'fancy-entrance',
    customStyles: ({ mainClassName, visibleClassName, translateYvalue }) => `
        .${mainClassName} {
            opacity: 0;
            transform: translateY(${translateYvalue}px) scale(0.95) rotate(-2deg);
            filter: blur(4px);
            transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .${mainClassName}.${visibleClassName} {
            opacity: 1;
            transform: translateY(0) scale(1) rotate(0);
            filter: blur(0);
        }
    `
})

// Reusable animation factory
const createSlideAnimation = (direction) => ({ mainClassName, visibleClassName }) => {
    const transforms = {
        up: 'translateY(50px)',
        down: 'translateY(-50px)',
        left: 'translateX(50px)',
        right: 'translateX(-50px)'
    }

    return `
        .${mainClassName} {
            opacity: 0;
            transform: ${transforms[direction]};
            transition: all 0.6s ease-out;
        }
        .${mainClassName}.${visibleClassName} {
            opacity: 1;
            transform: translate(0, 0);
        }
    `
}

const animator = new ScrollAnimator({
    mainClassName: 'slide-left',
    customStyles: createSlideAnimation('left')
})
```

**Advantages**:
- ✅ **Type-safe**: Class names always match
- ✅ **Dynamic**: Uses config values automatically
- ✅ **Maintainable**: Change class name in one place
- ✅ **Reusable**: Create animation factories
- ✅ **Flexible**: Full JavaScript power for CSS generation

**Best For**: Production code, teams, complex animations, multiple instances

---

### 🎯 Choosing the Right Pattern

Use this decision guide to select the best `customStyles` pattern for your needs:

```
START HERE
    ↓
Do you need custom animations?
    ├─ NO → Use Pattern 1 (null) or Pattern 2 ('template')
    │        ✅ Quick start, zero config
    │
    └─ YES → Do you have external CSS file?
            ├─ YES → Use Pattern 3 ('external')
            │        ✅ CSP compliance, external stylesheets
            │
            └─ NO → Is it a simple one-off animation?
                    ├─ YES → Use Pattern 4 (string)
                    │        ✅ Quick prototyping
                    │
                    └─ NO → Use Pattern 5 (function) ⭐ RECOMMENDED
                             ✅ Production-ready, type-safe, maintainable
```

**Quick Recommendations**:

| Scenario | Recommended Pattern | Why |
|----------|-------------------|-----|
| Just getting started | Pattern 1 (null) | Zero config, works immediately |
| Default animation, custom timing | Pattern 2 ('template') | Explicit intent, custom values |
| CSP restrictions | Pattern 3 ('external') | No inline styles |
| Quick prototype | Pattern 4 (string) | Fast iteration |
| Production code | Pattern 5 (function) ⭐ | Type-safe, maintainable |
| Multiple instances | Pattern 5 (function) ⭐ | Dynamic class names |
| Team project | Pattern 5 (function) ⭐ | Best practices |

---

### 🔗 Relationship with Other Config Options

#### `autoDetectTransform` Option

The `autoDetectTransform` option (default: `true`) automatically adjusts `translateYvalue` based on your `customStyles` pattern:

| Pattern | Auto-Adjustment | Reason |
|---------|----------------|--------|
| null / 'template' | No change | Template uses `translateYvalue` |
| 'external' | Set to `0` | External CSS handles transforms |
| string | Set to `0` | Custom CSS handles transforms |
| function | Set to `0` | Function handles transforms |

**Example**:
```javascript
// With autoDetectTransform (default)
const animator = new ScrollAnimator({
    customStyles: 'external',
    translateYvalue: 100 // Will be ignored, auto-set to 0
})
console.log(animator._config.translateYvalue) // 0

// Disable auto-detection
const animator = new ScrollAnimator({
    customStyles: 'external',
    translateYvalue: 100,
    autoDetectTransform: false // Keep translateYvalue: 100
})
console.log(animator._config.translateYvalue) // 100
```

**When to Disable `autoDetectTransform`**:
- You explicitly set `translateYvalue` and want to keep it
- Your custom CSS uses `translateYvalue` from config
- You're debugging transform-related issues

---

### ⚠️ CSS Injection Timing

**Critical**: CSS must be injected **before** body elements render to prevent flash of unstyled content (FOUC).

**Pattern-Specific Timing**:

| Pattern | Injection Timing | Script Placement |
|---------|-----------------|------------------|
| null / 'template' / string / function | Constructor (immediate) | **Must be in `<head>`** |
| 'external' | No injection | Can be in `<body>` |

**Correct Setup**:

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Pattern 1-2, 4-5: Script MUST be in <head> -->
    <script src="scroll-animator.js"></script>
    <script>
        const animator = new ScrollAnimator({
            customStyles: null // or 'template', string, function
        })
    </script>
</head>
<body>
    <div class="animate-on-scroll">Content</div>
</body>
</html>
```

```html
<!DOCTYPE html>
<html>
<head>
    <!-- Pattern 3: External CSS loaded first -->
    <link rel="stylesheet" href="animations.css">
</head>
<body>
    <div class="animate-on-scroll">Content</div>

    <!-- Pattern 3: Script can be at bottom -->
    <script src="scroll-animator.js"></script>
    <script>
        const animator = new ScrollAnimator({
            customStyles: 'external'
        })
    </script>
</body>
</html>
```

See [Script Placement Requirements](#-critical-script-placement-requirements) for detailed explanation.

---

### 🐛 Troubleshooting `customStyles`

#### Problem: Animations not working

**Symptoms**: Elements don't animate, no visual effect

**Solutions**:

1. **Check CSS injection** (Patterns 1-2, 4-5):
   ```javascript
// Open browser console
   const styleElement = document.querySelector('head style')
   console.log(styleElement) // Should exist
   console.log(styleElement.textContent) // Should contain your CSS
```

2. **Check script placement** (Patterns 1-2, 4-5):
   - Script must be in `<head>`, not `<body>`
   - See [Script Placement Requirements](#-critical-script-placement-requirements)

3. **Check external CSS** (Pattern 3):
   ```javascript
// Verify CSS file is loaded
   const styles = getComputedStyle(document.querySelector('.animate-on-scroll'))
   console.log(styles.opacity) // Should be '0' initially
```

---

#### Problem: Class names don't match

**Symptoms**: CSS exists but elements don't animate

**Solutions**:

1. **Use function-based pattern** (Pattern 5):
   ```javascript
// ❌ BAD: Hardcoded class names (typo risk)
   const animator = new ScrollAnimator({
       mainClassName: 'fade-in',
       customStyles: `
           .fade-inn { /* TYPO! */ }
       `
   })

   // ✅ GOOD: Function-based (type-safe)
   const animator = new ScrollAnimator({
       mainClassName: 'fade-in',
       customStyles: ({ mainClassName, visibleClassName }) => `
           .${mainClassName} { /* Always correct */ }
           .${mainClassName}.${visibleClassName} { }
       `
   })
```

2. **Verify class names in HTML**:
   ```javascript
const elements = document.querySelectorAll('.animate-on-scroll')
   console.log(elements.length) // Should match expected count
```

---

#### Problem: `translateYvalue` not working with custom CSS

**Symptoms**: Custom CSS ignores `translateYvalue` config

**Solution**: Use function-based pattern to access config values:

```javascript
// ❌ BAD: String pattern can't access config
const animator = new ScrollAnimator({
    translateYvalue: 80, // This is ignored!
    customStyles: `
        .animate-on-scroll {
            transform: translateY(100px); /* Hardcoded */
        }
    `
})

// ✅ GOOD: Function pattern uses config
const animator = new ScrollAnimator({
    translateYvalue: 80, // This is used!
    customStyles: ({ mainClassName, translateYvalue }) => `
        .${mainClassName} {
            transform: translateY(${translateYvalue}px); /* Dynamic */
        }
    `
})
```

---

#### Problem: CSP (Content Security Policy) blocks inline styles

**Symptoms**: Console error about CSP violation

**Solution**: Use Pattern 3 ('external'):

```javascript
// ❌ BAD: Inline styles blocked by CSP
const animator = new ScrollAnimator({
    customStyles: null // Tries to inject <style> element
})

// ✅ GOOD: External CSS (no injection)
const animator = new ScrollAnimator({
    customStyles: 'external'
})
```

```html
<!-- Add to your CSP meta tag -->
<meta http-equiv="Content-Security-Policy"
      content="style-src 'self'">
```

---

#### Problem: Multiple instances with same class names

**Symptoms**: Animations conflict or override each other

**Solution**: Use unique class names per instance:

```javascript
// ❌ BAD: Same class names
const animator1 = new ScrollAnimator({
    mainClassName: 'animate-on-scroll' // Conflict!
})
const animator2 = new ScrollAnimator({
    mainClassName: 'animate-on-scroll' // Conflict!
})

// ✅ GOOD: Unique class names
const fadeAnimator = new ScrollAnimator({
    mainClassName: 'fade-in',
    customStyles: ({ mainClassName, visibleClassName }) => `
        .${mainClassName} { opacity: 0; }
        .${mainClassName}.${visibleClassName} { opacity: 1; }
    `
})

const slideAnimator = new ScrollAnimator({
    mainClassName: 'slide-up',
    customStyles: ({ mainClassName, visibleClassName }) => `
        .${mainClassName} { transform: translateY(50px); }
        .${mainClassName}.${visibleClassName} { transform: translateY(0); }
    `
})
```

---

### 💡 Best Practices

1. **Use Pattern 5 (function) for production** - Type-safe and maintainable
2. **Use Pattern 3 ('external') for CSP compliance** - No inline styles
3. **Use Pattern 1 (null) for quick prototypes** - Zero config
4. **Always use function pattern for multiple instances** - Prevents conflicts
5. **Keep CSS simple** - Complex animations can impact performance
6. **Test on slow devices** - Ensure animations don't cause jank
7. **Respect user preferences** - Consider `prefers-reduced-motion`

---

## 🔧 API Reference

ScrollAnimator provides a comprehensive public API for lifecycle management, element control, and state inspection. All methods support method chaining (return `this`) except `destroy()` and getters.

### 🚀 Lifecycle Methods

#### `init()`

**Description**: Initializes the animator and starts observing elements.

**Returns**: `ScrollAnimator` (for method chaining)

**When to Use**:
- Manual initialization before `window.load` (automatic initialization is default)
- SPAs where `window.load` has already fired
- Testing scenarios requiring explicit control
- Dynamic content loaded after page load

**What It Does**:
1. Queries DOM for elements with `mainClassName`
2. Applies LCP optimization if configured
3. Reveals elements above viewport if page is scrolled
4. Initializes IntersectionObserver

**Examples**:

```javascript
// Manual initialization (optional - automatic by default)
const animator = new ScrollAnimator()
animator.init()

// Method chaining
const animator = new ScrollAnimator({ debug: true }).init()

// SPA component mount (React example)
useEffect(() => {
    const animator = new ScrollAnimator()
    animator.init() // Required in SPAs
    return () => animator.destroy()
}, [])
```

---

#### `destroy()`

**Description**: Comprehensive cleanup - removes observers, listeners, styles, and classes.

**Returns**: `void`

**When to Use**:
- Component unmount in SPAs (React, Vue, Angular)
- Page navigation in single-page applications
- Cleaning up before re-initializing
- Memory leak prevention

**What It Does**:
1. Disconnects IntersectionObserver
2. Removes all event listeners
3. Removes injected `<style>` element
4. Removes animation classes from elements
5. Clears internal state

**Examples**:

```javascript
// Basic cleanup
const animator = new ScrollAnimator()
// ... later
animator.destroy()

// React component cleanup
useEffect(() => {
    const animator = new ScrollAnimator()
    animator.init()

    return () => {
        animator.destroy() // Cleanup on unmount
    }
}, [])

// Vue component cleanup
onBeforeUnmount(() => {
    if (animator) {
        animator.destroy()
    }
})

// Before page navigation (SPA)
router.beforeEach((to, from, next) => {
    animator.destroy()
    next()
})
```

---

#### `refresh()`

**Description**: Re-queries DOM for elements and restarts observation.

**Returns**: `ScrollAnimator` (for method chaining)

**When to Use**:
- After loading content via AJAX/fetch
- After search/filter updates that change DOM
- After infinite scroll adds new content
- When you don't know which specific elements were added

**What It Does**:
1. Disconnects current observer
2. Re-queries DOM for elements with `mainClassName`
3. Restarts observation with new element list

**Examples**:

```javascript
// After AJAX content load
const animator = new ScrollAnimator()

async function loadMoreContent() {
    const response = await fetch('/api/more-content')
    const html = await response.text()
    document.getElementById('content').innerHTML += html
    animator.refresh() // Re-scan for new elements
}

// After search/filter updates
searchInput.addEventListener('input', async (e) => {
    const results = await searchProducts(e.target.value)
    resultsContainer.innerHTML = renderResults(results)
    animator.refresh() // Observe new results
})

// Infinite scroll
window.addEventListener('scroll', () => {
    if (isNearBottom()) {
        loadMoreItems().then(() => {
            animator.refresh()
        })
    }
})
```

---

#### `pause()`

**Description**: Temporarily stops observing new elements.

**Returns**: `ScrollAnimator` (for method chaining)

**When to Use**:
- User preference to disable animations
- Performance optimization during heavy operations
- Temporarily disable animations during modal/overlay display
- Accessibility: respect user's motion preferences

**What It Does**:
- Disconnects IntersectionObserver
- Sets internal paused state
- Existing animations continue, but no new ones trigger

**Examples**:

```javascript
// User preference toggle
const animator = new ScrollAnimator()
const toggleBtn = document.getElementById('animationsToggle')

toggleBtn.addEventListener('click', () => {
    if (animator.isPaused) {
        animator.resume()
        toggleBtn.textContent = 'Disable Animations'
    } else {
        animator.pause()
        toggleBtn.textContent = 'Enable Animations'
    }
})

// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
if (prefersReducedMotion.matches) {
    animator.pause()
}

// Pause during modal display
modal.addEventListener('open', () => animator.pause())
modal.addEventListener('close', () => animator.resume())
```

---

#### `resume()`

**Description**: Resumes observation after pause.

**Returns**: `ScrollAnimator` (for method chaining)

**When to Use**:
- Re-enable animations after user preference change
- Resume after performance-critical operation completes
- Re-enable after modal/overlay closes

**What It Does**:
- Re-initializes IntersectionObserver
- Clears paused state
- Resumes detecting elements entering viewport

**Examples**:

```javascript
// Resume after pause
animator.pause()
// ... later
animator.resume()

// Conditional resume based on user preference
if (userPreferences.enableAnimations) {
    animator.resume()
}

// Resume after heavy operation
async function processData() {
    animator.pause() // Pause during processing
    await heavyDataProcessing()
    animator.resume() // Resume after completion
}
```

---

### 📦 Element Management Methods

#### `addElements(elements)`

**Description**: Adds new elements to observe without re-querying entire DOM.

**Parameters**:
- `elements` - Single Element, Array of Elements, or NodeList

**Returns**: `ScrollAnimator` (for method chaining)

**When to Use**:
- Adding specific elements dynamically
- More efficient than `refresh()` when you know exact elements
- Real-time content updates (notifications, chat messages)
- User-generated content

**Examples**:

```javascript
// Add single element
const animator = new ScrollAnimator()
const newElement = document.createElement('div')
newElement.classList.add('animate-on-scroll')
document.body.appendChild(newElement)
animator.addElements(newElement)

// Add multiple elements
const newElements = document.querySelectorAll('.dynamic-content')
animator.addElements(newElements)

// Real-time notification
socket.on('notification', (data) => {
    const notif = createNotification(data)
    notif.classList.add('animate-on-scroll')
    container.appendChild(notif)
    animator.addElements(notif) // More efficient than refresh()
})

// User adds comment
commentForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const comment = await postComment(formData)
    const commentEl = createCommentElement(comment)
    commentsContainer.appendChild(commentEl)
    animator.addElements(commentEl)
})
```

---

#### `removeElements(elements)`

**Description**: Stops observing specific elements.

**Parameters**:
- `elements` - Single Element, Array of Elements, or NodeList

**Returns**: `ScrollAnimator` (for method chaining)

**When to Use**:
- Removing elements from observation (elements stay in DOM)
- User deletes content
- Filtering/hiding content
- Performance optimization for off-screen content

**Examples**:

```javascript
// Remove single element
const oldElement = document.querySelector('.old-content')
animator.removeElements(oldElement)

// Remove multiple elements
const hiddenElements = document.querySelectorAll('.hidden')
animator.removeElements(hiddenElements)

// User deletes item
deleteBtn.addEventListener('click', () => {
    animator.removeElements(itemElement)
    itemElement.remove() // Remove from DOM
})

// Filter results
filterBtn.addEventListener('click', () => {
    const filtered = items.filter(item => !item.matches(filterCriteria))
    animator.removeElements(filtered) // Stop observing
    filtered.forEach(item => item.style.display = 'none')
})
```

---

### 📊 Getters (State Inspection)

#### `isInitialized`

**Description**: Returns whether the animator is initialized.

**Returns**: `boolean`

**When to Use**:
- Check initialization state before calling methods
- Conditional logic based on animator state
- Debugging

**Examples**:

```javascript
const animator = new ScrollAnimator()
console.log(animator.isInitialized) // false

animator.init()
console.log(animator.isInitialized) // true

// Conditional initialization
if (!animator.isInitialized) {
    animator.init()
}

// Safe method calls
if (animator.isInitialized) {
    animator.refresh()
}
```

---

#### `isPaused`

**Description**: Returns whether the animator is paused.

**Returns**: `boolean`

**When to Use**:
- Check pause state before toggling
- Conditional UI updates
- State-dependent logic

**Examples**:

```javascript
const animator = new ScrollAnimator()
console.log(animator.isPaused) // false

animator.pause()
console.log(animator.isPaused) // true

// Toggle pause/resume
if (animator.isPaused) {
    animator.resume()
} else {
    animator.pause()
}

// Update UI based on state
const statusText = animator.isPaused ? 'Paused' : 'Active'
statusElement.textContent = statusText
```

---

#### `currentSpeed`

**Description**: Returns the current transition speed in milliseconds.

**Returns**: `number`

**When to Use**:
- Debugging animation timing
- Displaying current speed to users
- Performance monitoring

**Examples**:

```javascript
const animator = new ScrollAnimator()
console.log(`Current speed: ${animator.currentSpeed}ms`)

// Display in debug panel
debugPanel.innerHTML = `
    <div>Speed: ${animator.currentSpeed}ms</div>
    <div>Elements: ${animator.observedElements.length}</div>
`

// Performance monitoring
setInterval(() => {
    console.log('Animation speed:', animator.currentSpeed)
}, 1000)
```

---

#### `observedElements`

**Description**: Returns array of currently observed elements.

**Returns**: `Element[]` (copy to prevent mutation)

**When to Use**:
- Check how many elements are being observed
- Iterate over observed elements
- Debugging
- Display statistics

**Examples**:

```javascript
const animator = new ScrollAnimator()
console.log(`Observing ${animator.observedElements.length} elements`)

// Check if specific element is observed
const myElement = document.querySelector('.my-element')
const isObserved = animator.observedElements.includes(myElement)

// Display statistics
statsElement.textContent = `
    Total elements: ${animator.observedElements.length}
    Paused: ${animator.isPaused}
    Initialized: ${animator.isInitialized}
`

// Iterate over observed elements
animator.observedElements.forEach(element => {
    console.log('Observing:', element.className)
})
```

## 📖 Examples

See comprehensive usage examples in:
- **Interactive Demo**: `examples/usage-examples.html`
- **Code Examples**: `examples/usage-examples.js`

Examples include:
- Basic usage patterns
- Lifecycle management
- Element management
- Custom CSS animations
- Multiple instances
- SPA integration (React, Vue)
- Advanced configurations

## 🧪 Testing

ScrollAnimator includes comprehensive test suites to ensure reliability and correctness. The tests use a custom framework-agnostic testing framework that works in both Node.js and browsers without external dependencies.

---

### 📦 Unit Tests (Static Utility Methods)

**What's Tested**: Static utility methods (`clamp`, `lerp`, `invLerp`)

**Test Coverage**: 26 tests, 100% coverage of utility methods

#### Running Unit Tests in Node.js

```bash
node tests/scroll-animator.test.js
```

#### Running Unit Tests in Browser

1. Create an HTML file:
```html
<!DOCTYPE html>
<html>
<head>
    <title>ScrollAnimator Unit Tests</title>
</head>
<body>
    <h1>ScrollAnimator Unit Tests</h1>
    <div id="test-results"></div>

    <script src="../scroll-animator.js"></script>
    <script src="scroll-animator.test.js"></script>
</body>
</html>
```

2. Open the HTML file in your browser
3. Check the console (F12 or Cmd+Option+I) for test results

#### Expected Output

**Success Output**:
```
✓ clamp() should clamp values within range
✓ clamp() should handle min > max
✓ clamp() should handle equal min and max
...
✓ invLerp() should handle edge cases

26/26 tests passed (100%)
All tests completed successfully!
```

**Failure Output** (if any test fails):
```
✓ clamp() should clamp values within range
✗ clamp() should handle min > max
  Expected: 5, Got: 10
...

25/26 tests passed (96%)
1 test(s) failed
```

#### Test Framework Information

- **Framework**: Custom framework-agnostic test framework
- **No Dependencies**: Works without Jest, Mocha, or other test libraries
- **Assertion Methods**:
  - `toBe(expected)` - Strict equality check
  - `toBeGreaterThan(value)` - Greater than comparison
  - `toBeLessThan(value)` - Less than comparison
  - `toBeTruthy()` - Truthy check
  - `toBeFalsy()` - Falsy check
  - `.not` - Negation modifier

#### What's Tested

**1. `clamp(value, min, max)` - 9 tests**
- Basic clamping within range
- Clamping below minimum
- Clamping above maximum
- Edge cases (min > max, min === max)
- Negative numbers
- Zero values
- Decimal values

**2. `lerp(start, end, t)` - 9 tests**
- Linear interpolation at various points
- Start point (t = 0)
- End point (t = 1)
- Midpoint (t = 0.5)
- Negative ranges
- Reverse ranges
- Edge cases

**3. `invLerp(start, end, value)` - 8 tests**
- Inverse linear interpolation
- Start point
- End point
- Midpoint
- Values outside range
- Negative ranges
- Edge cases (start === end)

---

### 🔄 Integration Tests (Lifecycle & Features)

**What's Tested**: Complete ScrollAnimator lifecycle, custom CSS patterns, and feature integration

**Test Coverage**: 81 integration tests covering constructor, init, destroy, and advanced features

**Important**: Integration tests require a browser environment (cannot run in Node.js)

#### Running Integration Tests

**Method 1: Direct Browser Open**
1. Open `tests/scroll-animator-lifecycle-test.html` in your browser
2. Click the "Run Tests" button
3. View results in the browser UI and console

**Method 2: Local Server** (recommended for accurate testing)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open: http://localhost:8000/tests/scroll-animator-lifecycle-test.html
```

#### Test Suite Overview

The lifecycle integration tests validate the complete lifecycle of ScrollAnimator instances and ensure all features work correctly together.

**Test Categories**:

**1. Constructor Tests (5 tests)**
- Default options initialization
- Custom options merging
- Property initialization
- Style injection on construction
- Event listener attachment

**2. `init()` Method Tests (6 tests)**
- DOM querying for elements
- Already initialized check (prevents double init)
- No elements warning
- IntersectionObserver creation
- State flags (`_isInitialized`)
- Method chaining support

**3. `destroy()` Method Tests (5 tests)**
- IntersectionObserver disconnection
- Style element removal from DOM
- State reset (`_isInitialized`, `_isPaused`)
- NodeList clearing
- Animation class cleanup from elements

**4. Lifecycle Flow Tests (7 tests)**
- Complete lifecycle (constructor → init → destroy)
- Pause and resume functionality
- Refresh after DOM changes
- Multiple instances coexistence
- Method chaining patterns
- `addElements()` dynamic element addition
- `removeElements()` element removal

**5. Event Listener Cleanup Tests (8 tests)**
- Scroll event listener removal on destroy
- ReadyStateChange event listener removal
- Load event listener removal
- Proper cleanup verification
- Bound handler reference clearing
- Event listener isolation between instances
- Memory leak prevention
- Complete event cleanup validation

**6. Multiple Instances Tests (8 tests)**
- Independent operation
- Unique class names
- Different configurations
- Isolated state management
- Separate style elements
- Independent destroy
- No interference between instances
- Concurrent instance coexistence

**7. customStyles Validation Tests (9 tests)**
- Null value acceptance (default template)
- String value acceptance (custom CSS)
- Function value acceptance (dynamic CSS)
- 'template' keyword validation
- 'external' keyword validation
- Invalid type rejection (number, object, array)
- Empty string handling
- Console warning logging for invalid types
- Type safety enforcement

**8. Function-Based customStyles Tests (6 tests)**
- Function receives correct config parameters
- Config object structure validation
- Return value injection as CSS
- Template literals with config values
- Multiple instances with different functions
- Function error handling

**9. 'external' Keyword customStyles Tests (7 tests)**
- CSS injection skipping
- styleElement set to null
- No DOM style element creation
- destroy() method null handling
- Multiple instances with 'external'
- Console.info logging
- Initialization correctness with external CSS

**10. translateYvalue Auto-Adjustment Tests (7 tests)**
- Auto-adjust to 0 with string customStyles
- Auto-adjust to 0 with function customStyles
- No adjustment when explicitly set by user
- No adjustment with null (default template)
- No adjustment with 'template' keyword
- No adjustment with 'external' keyword
- Console.info logging on auto-adjustment

**11. autoDetectTransform Option Tests (6 tests)**
- Auto-adjust translateYvalue when true (default)
- No adjustment when false
- User-provided translateYvalue preservation
- Explicit user value handling
- Constructor option setting
- Boolean validation

**12. Multiple Instances with Different customStyles Tests (7 tests)**
- Null + string pattern independence
- Function + external pattern independence
- Template + function pattern independence
- Three instances with different patterns
- Correct styleElement for each instance
- Independent destroy operations
- Correct translateYvalue per instance (auto-adjusted or user-provided)

#### Expected Output

**Browser UI**:
```
ScrollAnimator Lifecycle Integration Tests
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Constructor: should initialize with default options
✓ Constructor: should merge custom options with defaults
✓ Constructor: should initialize all properties
...
✓ Multiple Instances: should work independently
✓ Element Management: should add elements dynamically

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
81/81 tests passed (100%)
All tests completed successfully!
```

**Console Output**:
```
Note: This is an illustrative example showing test categories.
Actual console output uses a simpler summary format.

[ScrollAnimator Tests] Starting test suite...
✓ Constructor Tests (5/5 passed)
✓ init() Tests (6/6 passed)
✓ destroy() Tests (5/5 passed)
✓ Lifecycle Flow Tests (7/7 passed)
✓ Event Listener Cleanup Tests (8/8 passed)
✓ Multiple Instances Tests (8/8 passed)
✓ customStyles Validation Tests (9/9 passed)
✓ Function-Based customStyles Tests (6/6 passed)
✓ 'external' Keyword Tests (7/7 passed)
✓ translateYvalue Auto-Adjustment Tests (7/7 passed)
✓ autoDetectTransform Option Tests (6/6 passed)
✓ Multiple Instances with Different customStyles Tests (7/7 passed)

Test Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 81 tests
Passed: 81 (100%)
Failed: 0
Duration: 456ms
```

#### Test Framework Information

**Framework**: Custom framework-agnostic test framework

**Assertion Methods Available**:
- `toBe(expected)` - Strict equality (===)
- `toBeGreaterThan(value)` - Greater than comparison
- `toBeLessThan(value)` - Less than comparison
- `toBeTruthy()` - Truthy check
- `toBeFalsy()` - Falsy check
- `toContain(item)` - Array/string contains check
- `toBeInstanceOf(class)` - Instance type check
- `.not` - Negation modifier for all assertions

**Test Helpers**:
- `setupTestDOM()` - Creates test DOM structure
- `teardownTestDOM()` - Cleans up test DOM
- `waitForNextFrame()` - Async frame waiting
- `simulateScroll()` - Scroll event simulation

**Example Test Structure**:
```javascript
test('should initialize with default options', () => {
    const animator = new ScrollAnimator()

    expect(animator._config.debug).toBe(false)
    expect(animator._config.mainClassName).toBe('animate-on-scroll')
    expect(animator._isInitialized).toBeFalsy()
})
```

---

### 📊 Complete Test Coverage Summary

| Test Suite | Tests | Coverage | Environment |
|------------|-------|----------|-------------|
| **Unit Tests** | 26 | 100% of utility methods | Node.js or Browser |
| **Integration Tests** | 81 | Complete lifecycle & features | Browser only |
| **Total** | **107** | **100% of public API** | Both |

**What's Covered**:
- ✅ All static utility methods (clamp, lerp, invLerp)
- ✅ Complete lifecycle (constructor, init, destroy)
- ✅ All public API methods (pause, resume, refresh, addElements, removeElements)
- ✅ All getter methods (isInitialized, isPaused, currentSpeed, observedElements)
- ✅ All 5 custom CSS patterns (null, 'template', 'external', string, function)
- ✅ Auto-detection features (autoDetectTransform, translateYvalue adjustment)
- ✅ Multiple instances and isolation
- ✅ Dynamic element management
- ✅ Event listener cleanup
- ✅ Memory leak prevention

---

### 🐛 Troubleshooting Tests

#### Tests fail in Node.js

**Problem**: Integration tests fail when run in Node.js

**Solution**: Integration tests require a browser environment (DOM, IntersectionObserver). Run them in a browser instead:
```bash
# Open in browser
open tests/scroll-animator-lifecycle-test.html
```

#### Tests fail due to missing DOM

**Problem**: `document is not defined` error

**Solution**: Ensure you're running integration tests in a browser, not Node.js. Unit tests work in both environments.

#### Tests pass but animations don't work

**Problem**: Tests pass but animations don't work in your application

**Solution**:
1. Check script placement (must be in `<head>` for CSS injection)
2. Verify class names match between HTML and config
3. Check browser console for warnings
4. Enable debug mode: `new ScrollAnimator({ debug: true })`

#### Browser console shows errors

**Problem**: Console errors during test execution

**Solution**:
1. Clear browser cache and reload
2. Check for conflicting CSS or JavaScript
3. Ensure test file paths are correct
4. Try running tests in incognito/private mode

---

### ✅ Running All Tests

**Quick Test Command** (for CI/CD):
```bash
# Run unit tests
node tests/scroll-animator.test.js

# For integration tests, use a headless browser
# Example with Puppeteer:
npx puppeteer tests/scroll-animator-lifecycle-test.html
```

**Manual Testing Checklist**:
1. ✅ Run unit tests in Node.js: `node tests/scroll-animator.test.js`
2. ✅ Open integration tests in browser: `tests/scroll-animator-lifecycle-test.html`
3. ✅ Verify 26/26 unit tests pass
4. ✅ Verify 81/81 integration tests pass
5. ✅ Check console for any warnings
6. ✅ Test in multiple browsers (Chrome, Firefox, Safari)

**Expected Results**:
- ✅ 107/107 tests passing (100%)
- ✅ No console errors
- ✅ All assertions pass
- ✅ Clean test output

## 🌐 Browser Support

- Chrome/Edge 58+
- Firefox 55+
- Safari 12.1+
- Opera 45+

**Note**: IE11 requires IntersectionObserver polyfill

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 👤 Author

**Jensen SIU**
- Website: [https://www.jensen-siu.net](https://www.jensen-siu.net)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📞 Support

For questions, issues, or feature requests, please open an issue on the project repository.

---

**Made with ❤️ for smooth scrolling experiences**

