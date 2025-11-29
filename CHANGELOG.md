# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.2] - 2025-11-27

 ### Added
 - **Event Callbacks**: New `onTransitionStart` and `onTransitionEnd` configuration options
   - `onTransitionStart(element)`: Fired when the element enters the viewport and the transition begins
   - `onTransitionEnd(element)`: Fired when the CSS transition completes
   - Supports all animation types including instant reveals and LCP optimization
   - Provides access to the animated DOM element for custom logic (analytics, state updates, chaining)
 - Updated documentation with "Event Callbacks" section and usage examples
 - Updated JSDoc comments to include new callback parameters

 ## [1.0.1] - 2025-11-07

### Added
- **Self-Removal Feature**: New `modifierClassName` configuration option for automatic cleanup of animation classes and inline styles after animations complete
  - Opt-in functionality (default: `null`) - completely backward compatible
  - When an element has both `mainClassName` and `modifierClassName`, all animation-related classes and inline styles are automatically removed after animation completes
  - Removes: `mainClassName`, `visibleClassName`, `modifierClassName`, inline `transitionDuration`, and inline `transitionDelay`
  - Perfect for one-time entrance animations, landing page hero sections, modal/dialog entrances
- New helper method `_performSelfRemovalCleanup()` for centralized cleanup logic
  - Handles all edge cases: normal animations, instant reveals, LCP optimization, above-viewport elements
  - Context-aware debug logging with distinct messages for different cleanup scenarios
  - Reusable across all code paths for DRY implementation
- Comprehensive documentation section in README.md (183 lines)
  - Overview of self-removal feature with before/after examples
  - Configuration instructions and usage examples
  - Use cases: landing pages, mixed usage, modal entrances
  - Edge cases documentation: instant reveals, multiple transitions, method interactions
  - Debug mode examples with console output
  - Best practices and backward compatibility notes
- Manual test file `tests/self-removal-test.html` for comprehensive feature testing
  - Tests self-removing elements, persistent elements, and mixed usage
  - Visual verification of cleanup behavior
  - Debug console output verification

### Changed
- Updated version from 1.0.0 to 1.0.1 in source file headers and JSDoc comments
- Enhanced `_aosSelectorsManager()` method to support self-removal cleanup on `transitionend` events
- Enhanced `_revealElementsAboveViewport()` to perform cleanup for above-viewport elements with `modifierClassName`
- Enhanced `_optimizeAosForLcp()` to perform cleanup for LCP-optimized elements with `modifierClassName`
- Updated README.md features list to include self-removal feature
- Updated README.md configuration table to include `modifierClassName` option
- Enhanced JSDoc comments with comprehensive documentation for new feature
  - Added `modifierClassName` parameter documentation to constructor
  - Added usage examples for self-removal feature
  - Added detailed documentation for `_performSelfRemovalCleanup()` helper method
- Updated debug logging to distinguish between self-removal cleanup and instant reveal cleanup
  - `🗑️ Self-removal` message for normal animation cleanup
  - `⚡ Instant reveal` message for instant reveal cleanup

### Technical Details
- **Implementation**: DRY approach with reusable helper method called from three code paths
- **Edge Cases Handled**: Multiple `transitionend` events, instant reveals, LCP optimization, above-viewport elements, method interactions (refresh, addElements, destroy, pause/resume)
- **Testing**: All 107 existing tests pass (100% backward compatibility verified)
- **Performance**: No performance impact - cleanup only occurs when `modifierClassName` is configured and present on elements
- **Memory**: Improved memory efficiency for one-time animations by removing all references after completion

### Backward Compatibility
- ✅ **100% Backward Compatible**: Feature is completely opt-in
- ✅ **No Breaking Changes**: Default behavior unchanged (`modifierClassName: null`)
- ✅ **Existing Tests Pass**: All 107 existing tests pass without modification
- ✅ **Safe Upgrade**: Existing implementations continue to work exactly as before

## [1.0.0] - 2024-10-09

### Added
- Initial release of ScrollAnimator
- Speed-adaptive scroll animations
- LCP (Largest Contentful Paint) optimization
- Flexible CSS injection patterns
- IntersectionObserver-based viewport detection
- Debug mode with visual indicators
- Comprehensive configuration options
- Memory-safe cleanup with `destroy()` method
- Zero dependencies - pure vanilla JavaScript

[1.0.2]: https://github.com/seangoogoo/scrollanimator/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/seangoogoo/scrollanimator/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/seangoogoo/scrollanimator/releases/tag/v1.0.0

