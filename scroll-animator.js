'use strict'

/**
 * ScrollAnimator - Speed Adaptive Scroll Animation
 *
 * A class-based scroll animation system that dynamically adjusts animation
 * timing based on scroll speed, providing a natural and responsive user experience.
 *
 * @class ScrollAnimator
 * @version 1.0.0
 *
 * @example
 * // Basic usage with defaults
 * const animator = new ScrollAnimator()
 *
 * @example
 * // Custom configuration
 * const animator = new ScrollAnimator({
 *   debug: true,
 *   mainClassName: 'fade-in',
 *   maxScrollSpeed: 2000,
 *   optimizeLCP: true
 * })
 */
class ScrollAnimator {
	/**
	 * Creates a new ScrollAnimator instance
	 *
	 * @param {Object} options - Configuration options
	 * @param {boolean} [options.debug=false] - Enable debug mode with console logs and visual indicators
	 * @param {string} [options.mainClassName='animate-on-scroll'] - CSS class for elements to animate
	 * @param {string} [options.visibleClassName='aos-visible'] - CSS class added when element is visible
	 * @param {number} [options.translateYvalue=100] - Y-axis translation value in pixels. Auto-adjusted to 0 when using custom CSS (unless explicitly set)
	 * @param {boolean} [options.optimizeLCP=false] - Optimize for Largest Contentful Paint by removing animations from above-the-fold content
	 * @param {number} [options.maxSpeed=850] - Maximum transition duration in milliseconds (for slow scrolling)
	 * @param {number} [options.minSpeed=650] - Minimum transition duration in milliseconds (for fast scrolling)
	 * @param {number} [options.delayMax=120] - Maximum delay between animations in milliseconds
	 * @param {number} [options.delayMin=0] - Minimum delay between animations in milliseconds
	 * @param {number} [options.delayStackTweak=0.5] - Delay stack multiplier (0-1) for staggered animations
	 * @param {number} [options.maxScrollSpeed=1800] - Maximum scroll speed threshold in px/s
	 * @param {number} [options.minScrollSpeed=800] - Minimum scroll speed threshold in px/s
	 * @param {string} [options.observerRootMargin='0px 0px 70px 0px'] - IntersectionObserver root margin for early/late triggering
	 * @param {number} [options.observerThreshold=0] - IntersectionObserver threshold (0-1) for visibility detection
	 * @param {null|string|Function} [options.customStyles=null] - Custom CSS injection pattern. Supports:
	 *   - `null`: Use default fade-up animation template (backward compatible)
	 *   - `'template'`: Use default template with custom config values
	 *   - `'external'`: Skip CSS injection, use external stylesheet
	 *   - `string`: Inject custom CSS string directly
	 *   - `Function`: Call function with config object to generate CSS dynamically
	 * @param {boolean} [options.autoDetectTransform=true] - Auto-adjust translateYvalue to 0 when using custom CSS (prevents viewport detection issues)
	 *
	 * @example
	 * // Basic usage with default animation
	 * const animator = new ScrollAnimator()
	 *
	 * @example
	 * // Custom configuration with debug mode
	 * const animator = new ScrollAnimator({
	 *   debug: true,
	 *   mainClassName: 'fade-in',
	 *   maxScrollSpeed: 2000,
	 *   optimizeLCP: true
	 * })
	 *
	 * @example
	 * // Function-based custom CSS (type-safe, recommended)
	 * const zoomAnimator = new ScrollAnimator({
	 *   mainClassName: 'zoom-in',
	 *   customStyles: ({ mainClassName, visibleClassName }) => `
	 *     .${mainClassName} {
	 *       opacity: 0;
	 *       transform: scale(0.8);
	 *       transition: all 0.6s ease;
	 *     }
	 *     .${mainClassName}.${visibleClassName} {
	 *       opacity: 1;
	 *       transform: scale(1);
	 *     }
	 *   `
	 * })
	 * // translateYvalue auto-set to 0
	 *
	 * @example
	 * // String-based custom CSS
	 * const fadeAnimator = new ScrollAnimator({
	 *   mainClassName: 'fade-in',
	 *   customStyles: `
	 *     .fade-in {
	 *       opacity: 0;
	 *       transition: opacity 0.5s ease;
	 *     }
	 *     .fade-in.aos-visible {
	 *       opacity: 1;
	 *     }
	 *   `
	 * })
	 * // translateYvalue auto-set to 0
	 *
	 * @example
	 * // External CSS (no injection)
	 * const externalAnimator = new ScrollAnimator({
	 *   mainClassName: 'my-animation',
	 *   visibleClassName: 'visible',
	 *   customStyles: 'external'
	 * })
	 * // Assumes .my-animation and .my-animation.visible exist in your CSS
	 * // translateYvalue auto-set to 0
	 *
	 * @example
	 * // Override auto-adjustment with explicit translateYvalue
	 * const slideAnimator = new ScrollAnimator({
	 *   mainClassName: 'slide-up',
	 *   translateYvalue: 50, // Explicitly set (not auto-adjusted)
	 *   customStyles: ({ mainClassName, visibleClassName, translateYvalue }) => `
	 *     .${mainClassName} {
	 *       opacity: 0;
	 *       transform: translateY(${translateYvalue}px);
	 *       transition: all 0.6s ease;
	 *     }
	 *     .${mainClassName}.${visibleClassName} {
	 *       opacity: 1;
	 *       transform: translateY(0);
	 *     }
	 *   `
	 * })
	 * // translateYvalue stays 50 (user explicitly set it)
	 *
	 * @example
	 * // Disable auto-adjustment
	 * const customAnimator = new ScrollAnimator({
	 *   mainClassName: 'custom',
	 *   autoDetectTransform: false, // Disable auto-adjustment
	 *   customStyles: `...`
	 * })
	 * // translateYvalue stays 100 (default)
	 *
	 * @example
	 * // Multiple instances with different animations
	 * const fadeAnimator = new ScrollAnimator({
	 *   mainClassName: 'fade-in',
	 *   customStyles: ({ mainClassName, visibleClassName }) => `
	 *     .${mainClassName} {
	 *       opacity: 0;
	 *       transition: opacity 0.5s ease;
	 *     }
	 *     .${mainClassName}.${visibleClassName} {
	 *       opacity: 1;
	 *     }
	 *   `
	 * })
	 *
	 * const zoomAnimator = new ScrollAnimator({
	 *   mainClassName: 'zoom-in',
	 *   customStyles: ({ mainClassName, visibleClassName }) => `
	 *     .${mainClassName} {
	 *       opacity: 0;
	 *       transform: scale(0.8);
	 *       transition: all 0.6s ease;
	 *     }
	 *     .${mainClassName}.${visibleClassName} {
	 *       opacity: 1;
	 *       transform: scale(1);
	 *     }
	 *   `
	 * })
	 *
	 * const defaultAnimator = new ScrollAnimator({
	 *   mainClassName: 'slide-up'
	 * })
	 * // Each instance injects different CSS independently
	 */
	constructor(options = {}) {
		// Store original user options to detect explicit values
		this._userOptions = options

		// Define default configuration
		const defaults = {
			debug: false,
			mainClassName: 'animate-on-scroll',
			visibleClassName: 'aos-visible',
			translateYvalue: 100,
			optimizeLCP: false,
			maxSpeed: 850,
			minSpeed: 650,
			delayMax: 120,
			delayMin: 0,
			delayStackTweak: 0.5,
			maxScrollSpeed: 1800,
			minScrollSpeed: 800,
			observerRootMargin: '0px 0px 70px 0px',
			observerThreshold: 0,
			customStyles: null,
			autoDetectTransform: true
		}

		// Merge user options with defaults
		this._config = { ...defaults, ...options }

		// Validate configuration
		this._validateConfig()

		// Initialize element management properties
		this._elements = {
			nodeList: [],
			styleElement: null,
			debugWindow: null
		}

		// Initialize transition state properties
		this._transition = {
			optimizeLCP: this._config.optimizeLCP,
			currentSpeed: this._config.maxSpeed,
			maxSpeed: this._config.maxSpeed,
			minSpeed: this._config.minSpeed,
			currentDelay: this._config.delayMax,
			delayMax: this._config.delayMax,
			delayMin: this._config.delayMin,
			delayStack: 0,
			delayStackTweak: this._config.delayStackTweak,
			maxScrollSpeed: this._config.maxScrollSpeed,
			minScrollSpeed: this._config.minScrollSpeed,
			batchItemNb: 0,
			minDelayReported: null
		}

		// Initialize scroll tracking properties
		this._scroll = {
			lastTopPos: this._getScrollY(),
			lastTime: performance.now(),
			currentSpeed: 0,
			maxSpeed: 0
		}

		// Initialize scroll listener state
		this._scrollListener = {
			ticking: false,
			endTimer: null
		}

		// Initialize observer and timer references
		this._observer = null
		this._intersectionObserverEndTimer = null

		// Initialize bound event handlers storage
		this._boundHandlers = {}

		// Initialize state flags
		this._isInitialized = false
		this._isPaused = false

		// Start performance timer if debug mode
		if (this._config.debug) {
			console.time('ScrollAnimator')
			console.timeLog('ScrollAnimator', 'Instance created')
		}

		// Initialize the animator
		this._initialize()
	}

	/**
	 * Validates the configuration options
	 * @private
	 */
	_validateConfig() {
		// Validate numeric values are positive
		const numericFields = [
			'translateYvalue', 'maxSpeed', 'minSpeed', 'delayMax', 'delayMin',
			'maxScrollSpeed', 'minScrollSpeed', 'observerThreshold'
		]

		numericFields.forEach(field => {
			if (typeof this._config[field] === 'number' && this._config[field] < 0) {
				console.warn(`ScrollAnimator: ${field} should be a positive number. Using absolute value.`)
				this._config[field] = Math.abs(this._config[field])
			}
		})

		// Validate delayStackTweak is between 0 and 1
		if (this._config.delayStackTweak < 0 || this._config.delayStackTweak > 1) {
			console.warn('ScrollAnimator: delayStackTweak should be between 0 and 1. Clamping to valid range.')
			this._config.delayStackTweak = ScrollAnimator.clamp(this._config.delayStackTweak, 0, 1)
		}

		// Validate min/max relationships
		if (this._config.minSpeed > this._config.maxSpeed) {
			console.warn('ScrollAnimator: minSpeed should be less than maxSpeed. Swapping values.')
			;[this._config.minSpeed, this._config.maxSpeed] = [this._config.maxSpeed, this._config.minSpeed]
		}

		if (this._config.minScrollSpeed > this._config.maxScrollSpeed) {
			console.warn('ScrollAnimator: minScrollSpeed should be less than maxScrollSpeed. Swapping values.')
			;[this._config.minScrollSpeed, this._config.maxScrollSpeed] = [this._config.maxScrollSpeed, this._config.minScrollSpeed]
		}

		// Validate class names are non-empty strings
		if (!this._config.mainClassName || typeof this._config.mainClassName !== 'string') {
			throw new Error('ScrollAnimator: mainClassName must be a non-empty string')
		}

		if (!this._config.visibleClassName || typeof this._config.visibleClassName !== 'string') {
			throw new Error('ScrollAnimator: visibleClassName must be a non-empty string')
		}

		// Validate customStyles if provided
		if (this._config.customStyles !== null) {
			const type = typeof this._config.customStyles
			if (type !== 'string' && type !== 'function') {
				console.warn('ScrollAnimator: customStyles must be a string, function, or null. Ignoring custom styles.')
				this._config.customStyles = null
			} else if (type === 'string' && this._config.customStyles.trim() === '') {
				console.warn('ScrollAnimator: customStyles is empty. Using default styles.')
				this._config.customStyles = null
			}
		}

		// Validate autoDetectTransform is boolean
		if (typeof this._config.autoDetectTransform !== 'boolean') {
			console.warn('ScrollAnimator: autoDetectTransform must be a boolean. Using default value (true).')
			this._config.autoDetectTransform = true
		}
	}

	/**
	 * Initializes the ScrollAnimator
	 * @private
	 */
	_initialize() {
		// Inject styles into document head
		this._injectStyles()

		// Create debug window if debug mode enabled
		if (this._config.debug) {
			this._createDebugWindow()
		}

		// Attach event listeners
		this._attachEventListeners()
	}

	/**
	 * Gets the current scroll position
	 * @private
	 * @returns {number} Current scroll position in pixels
	 */
	_getScrollY() {
		return (document.scrollingElement || document.documentElement).scrollTop
	}

	// ============================================================================
	// CORE FUNCTIONALITY METHODS
	// ============================================================================

	/**
	 * Calculates transition duration or delay based on scroll speed
	 *
	 * @private
	 * @param {number} speedPxPerSec - Scroll speed in pixels per second
	 * @param {string} [type='duration'] - Type of value to calculate ('duration' or 'delay')
	 * @returns {number} Calculated transition value in milliseconds
	 *
	 * @description
	 * Uses inverse linear interpolation to map scroll speed to transition values:
	 * - Slow scroll (minScrollSpeed) → longer duration/delay (maxVal)
	 * - Fast scroll (maxScrollSpeed) → shorter duration/delay (minVal)
	 */
	_transitionValueCalculator(speedPxPerSec, type = 'duration') {
		const minScroll = this._transition.minScrollSpeed
		const maxScroll = this._transition.maxScrollSpeed

		const minVal = type === 'duration' ? this._transition.minSpeed : this._transition.delayMin
		const maxVal = type === 'duration' ? this._transition.maxSpeed : this._transition.delayMax

		// Bound the speed within the interval
		const v = ScrollAnimator.clamp(speedPxPerSec, minScroll, maxScroll)

		// Calculate the factor [0,1] corresponding to the progression between minScroll and maxScroll
		const t = ScrollAnimator.invLerp(minScroll, maxScroll, v)

		// Interpolate from maxVal (slow) to minVal (fast)
		return Math.round(ScrollAnimator.lerp(maxVal, minVal, t))
	}

	/**
	 * Measures and reports scroll speed, updating transition values accordingly
	 *
	 * @private
	 * @param {number} currentScrollTop - Current scroll position in pixels
	 * @param {boolean} [isFinalCall=false] - Whether this is the final call after scroll ends
	 *
	 * @description
	 * Triggers during scrolling AND after the end of scroll.
	 * Calculates scroll speed (px/s) and updates transition duration and delay values.
	 * In debug mode, logs detailed speed information and updates debug window.
	 */
	_scrollMeasurementReporter(currentScrollTop, isFinalCall = false) {
		const now = performance.now()
		const deltaTime = now - this._scroll.lastTime
		const deltaY = Math.abs(currentScrollTop - this._scroll.lastTopPos)

		if ((deltaTime > 0 && deltaY > 0) || isFinalCall) {

			this._scroll.currentSpeed = Math.round(deltaY / deltaTime * 1000) // px/s

			const scrollTransitionDuration = this._transitionValueCalculator(this._scroll.currentSpeed, 'duration')
			this._transition.currentSpeed = scrollTransitionDuration

			const scrollTransitionDelay = this._transitionValueCalculator(this._scroll.currentSpeed, 'delay')
			this._transition.currentDelay = scrollTransitionDelay

			if (this._config.debug && this._scroll.currentSpeed > this._scroll.maxSpeed) {
				this._scroll.maxSpeed = this._scroll.currentSpeed
			}

			if (this._config.debug && (this._transition.minDelayReported === null || this._transition.minDelayReported > scrollTransitionDelay)) {
				this._transition.minDelayReported = scrollTransitionDelay
			}

			if (this._config.debug) {

				const speedReport = `Distance traveled in pixels: ${deltaY}\nsince ${deltaTime.toFixed(2)}ms (Previous RAF differential)\nSpeed: ${this._scroll.currentSpeed}px/s\nMax speed: ${this._scroll.maxSpeed}px/s\nTransition duration: ${scrollTransitionDuration}ms\nDelay duration: ${scrollTransitionDelay}ms\nMin delay duration: ${this._transition.minDelayReported}ms`

				console.log(`${deltaY}px - currentScrollTop: ${currentScrollTop} - lastTopPos: ${this._scroll.lastTopPos}`)
				if (isFinalCall) {
					console.log("✅ Final speed after scroll:", this._scroll.currentSpeed, "px/s - transition duration:", scrollTransitionDuration, "ms - transition delay:", scrollTransitionDelay, "ms")
				} else {
					console.log("🔄 Speed during scroll:", this._scroll.currentSpeed, "px/s - transition duration:", scrollTransitionDuration, "ms - transition delay:", scrollTransitionDelay, "ms")
				}
				console.log("speedReport:", speedReport)

				if (this._elements.debugWindow) {
					this._elements.debugWindow.innerHTML = speedReport.replace(/\n/g, "<br>")
				}
			}

			// Update time and position reference values
			this._scroll.lastTopPos = currentScrollTop
			this._scroll.lastTime = now
		}
	}

	/**
	 * Instantly reveals elements that are above the viewport
	 *
	 * @private
	 * @param {Array<HTMLElement>} aosSelectors - Array of elements to check
	 * @returns {Promise<Array<HTMLElement>>} Promise resolving to filtered array of elements still needing animation
	 *
	 * @description
	 * Elements with bottom edge above viewport top (elementRect.bottom < 0) are immediately
	 * revealed with zero transition duration/delay. This prevents animations from triggering
	 * on elements the user has already scrolled past.
	 */
	async _revealElementsAboveViewport(aosSelectors) {

		if (this._config.debug) {
			console.timeLog('ScrollAnimator', 'revealElementsAboveViewport function')
		}

		const aosSelectorsArray = []

		aosSelectors.forEach(element => {
			// Get the element's position relative to the viewport
			const elementRect = element.getBoundingClientRect()

			if (elementRect.bottom < 0) {

				element.style.transitionDuration = `0ms`
				element.style.transitionDelay = `0ms`
				element.classList.add(this._config.visibleClassName)

				if (this._config.debug) {
					element.style.outline = '1px solid red'
				}

			} else {
				aosSelectorsArray.push(element)
			}
		})

		return aosSelectorsArray
	}

	/**
	 * Optimizes animations for Largest Contentful Paint (LCP)
	 *
	 * @private
	 * @param {Array<HTMLElement>} aosSelectors - Array of elements to check
	 * @returns {Array<HTMLElement>} Filtered array of elements still needing animation
	 *
	 * @description
	 * Elements visible in the viewport on page load are immediately revealed with zero
	 * transition duration/delay. This improves LCP by preventing animation delays on
	 * above-the-fold content. The translateYvalue is factored in to account for the
	 * element's pre-transition position.
	 */
	_optimizeAosForLcp(aosSelectors) {
		const viewportHeight = window.visualViewport?.height ?? window.innerHeight

		if (this._config.debug) {
			console.log("🚀 ~ optimizeAosForLcp ~ viewportHeight:", viewportHeight)
		}

		const aosSelectorsArray = []

		aosSelectors.forEach(element => {

			// Get the element's position relative to the viewport
			const elementRect = element.getBoundingClientRect()

			// Add the adjustment value translateYvalue which corresponds to the element's
			// position before the element undergoes the transition
			if (elementRect.top - this._config.translateYvalue < viewportHeight) {

				element.style.transitionDuration = `0ms`
				element.style.transitionDelay = `0ms`
				element.classList.add(this._config.visibleClassName)

				if (this._config.debug) {
					element.style.outline = '1px solid green'
				}

			} else {
				aosSelectorsArray.push(element)
			}
		})

		if (this._config.debug) {
			console.log("🚀 ~ optimizeAosForLcp ~ aosSelectorsArray:", aosSelectorsArray)
		}

		return aosSelectorsArray
	}

	/**
	 * IntersectionObserver callback that manages element animations
	 *
	 * @private
	 * @param {Array<IntersectionObserverEntry>} entries - Array of intersection observer entries
	 * @param {IntersectionObserver} observer - The IntersectionObserver instance
	 *
	 * @description
	 * Handles the animation triggering for elements entering the viewport:
	 * - Accumulates delays for sequential animation (delayStack)
	 * - Applies transition duration and delay based on current scroll speed
	 * - Uses willChange for performance optimization
	 * - Unobserves elements after animation starts
	 * - Resets batch counters after all elements in a batch are processed
	 */
	_aosSelectorsManager(entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {

				// Adds up successive delay durations that themselves depend on scroll speed
				// This value is reset as soon as this total duration has elapsed,
				// that is, as soon as the entire batch of selectors has finished its transitions
				// => Allows us to avoid counting occurrences
				this._transition.delayStack += this._transition.currentDelay
				this._transition.batchItemNb++

				if (this._config.debug) {
					if (this._transition.batchItemNb === 1) {
						console.timeLog('ScrollAnimator', 'aosSelectorsManager batch start')
					}

					entry.target.dataset.info = `${this._transition.batchItemNb} | transition duration: ${this._transition.currentSpeed}ms, item delay: ${this._transition.currentDelay}ms, total delay: ${this._transition.delayStack}ms`

					// Adaptive delay based on event frequency
					console.log(`${this._transition.batchItemNb} | aosSelectorsManager ~ delayStack: `, this._transition.delayStack, "adjusted delayStack: ", Math.round(this._transition.delayStack * this._transition.delayStackTweak))
				}

				entry.target.style.transitionDuration = `${this._transition.currentSpeed}ms`
				entry.target.style.transitionDelay = `${this._transition.delayStack}ms`

				// Prepare the transition a bit beforehand
				entry.target.style.willChange = 'transform, opacity'

				// Force the browser to prepare the rendering
				requestAnimationFrame(() => {
					// Add the configured visible class to trigger the CSS transition/animation
					entry.target.classList.add(this._config.visibleClassName)

					// Clean up after the transition
					entry.target.addEventListener('transitionend', () => {
						entry.target.style.willChange = ''
					}, { once: true })
				})

				observer.unobserve(entry.target)

				// Debouncer to detect the last element of the batch processed by the intersectionObserver
				clearTimeout(this._intersectionObserverEndTimer)
				this._intersectionObserverEndTimer = setTimeout(() => {
					if (this._config.debug) {
						console.log(`🏁 Intersection observation finished - Resetting element counter - observed Item(s): ${this._transition.batchItemNb}`)
						console.timeLog('ScrollAnimator', 'aosSelectorsManager batch ended')
					}
					this._transition.batchItemNb = 0
					this._transition.delayStack = 0
				}, Math.round(this._transition.delayStack * this._transition.delayStackTweak))

			}
		})
	}

	// ============================================================================
	// STATIC UTILITY METHODS
	// ============================================================================

	/**
	 * Constrains a value within a specified range
	 *
	 * @static
	 * @param {number} x - The value to constrain
	 * @param {number} min - The minimum allowed value
	 * @param {number} max - The maximum allowed value
	 * @returns {number} The constrained value
	 *
	 * @example
	 * ScrollAnimator.clamp(150, 0, 100) // Returns 100
	 * ScrollAnimator.clamp(-10, 0, 100) // Returns 0
	 * ScrollAnimator.clamp(50, 0, 100)  // Returns 50
	 */
	static clamp(x, min, max) {
		return Math.min(Math.max(x, min), max)
	}

	/**
	 * Performs linear interpolation between two values
	 *
	 * @static
	 * @param {number} a - The start value
	 * @param {number} b - The end value
	 * @param {number} t - The interpolation factor (0-1)
	 * @returns {number} The interpolated value
	 *
	 * @example
	 * ScrollAnimator.lerp(0, 100, 0)   // Returns 0
	 * ScrollAnimator.lerp(0, 100, 1)   // Returns 100
	 * ScrollAnimator.lerp(0, 100, 0.5) // Returns 50
	 */
	static lerp(a, b, t) {
		return a + (b - a) * t
	}

	/**
	 * Calculates the inverse linear interpolation (progression factor)
	 *
	 * @static
	 * @param {number} a - The start value
	 * @param {number} b - The end value
	 * @param {number} v - The current value
	 * @returns {number} The progression factor (0-1)
	 *
	 * @example
	 * ScrollAnimator.invLerp(0, 100, 0)   // Returns 0
	 * ScrollAnimator.invLerp(0, 100, 100) // Returns 1
	 * ScrollAnimator.invLerp(0, 100, 50)  // Returns 0.5
	 */
	static invLerp(a, b, v) {
		return (v - a) / (b - a)
	}

	// ============================================================================
	// INITIALIZATION METHODS
	// ============================================================================

	/**
	 * Generates default CSS styles using configuration values
	 *
	 * @private
	 * @returns {string} CSS string
	 *
	 * @description
	 * Generates the default CSS template using config values:
	 * - mainClassName, visibleClassName, translateYvalue, currentSpeed
	 * - Includes debug styles if debug mode is enabled
	 */
	_generateDefaultStyles() {
		let css = `
.${this._config.mainClassName} {
	position: relative;
	opacity: 0;
	transform: translateY(${this._config.translateYvalue}px);
	transition:
		opacity ${this._transition.currentSpeed}ms cubic-bezier(.22,.61,.36,1),
		transform ${this._transition.currentSpeed}ms cubic-bezier(.17,.84,.44,1);

	&.${this._config.visibleClassName} {
		opacity: 1;
		transform: translateY(0);
	}
`

		// Add debug styles if debug mode enabled
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

		// Close the CSS rule
		css += `
}
`

		return css
	}

	/**
	 * Injects CSS styles into the document head
	 *
	 * @private
	 *
	 * @description
	 * Dynamically creates and injects a <style> element containing animation styles.
	 * Supports multiple customStyles patterns:
	 * - 'external': Skip injection (use external CSS)
	 * - function: Call with config parameters to generate CSS
	 * - string: Inject custom CSS string
	 * - null or 'template': Use default template
	 *
	 * Implements autoDetectTransform logic to auto-adjust translateYvalue when using custom CSS.
	 */
	_injectStyles() {
		// Check for 'external' keyword - skip injection entirely
		if (this._config.customStyles === 'external') {
			console.info('ScrollAnimator: Using external CSS. No styles injected.')
			this._elements.styleElement = null

			// Auto-adjust translateYvalue if enabled and not explicitly set
			if (this._config.autoDetectTransform && !this._userOptions.hasOwnProperty('translateYvalue')) {
				this._config.translateYvalue = 0
				console.info('ScrollAnimator: translateYvalue auto-set to 0 for external CSS. Set explicitly to override.')
			}
			return
		}

		const styleElement = document.createElement('style')

		// Determine which CSS to inject
		if (this._config.customStyles !== null && this._config.customStyles !== 'template') {
			// Custom CSS provided (function or string)
			if (typeof this._config.customStyles === 'function') {
				// Call function with config parameters
				styleElement.textContent = this._config.customStyles({
					mainClassName: this._config.mainClassName,
					visibleClassName: this._config.visibleClassName,
					translateYvalue: this._config.translateYvalue,
					maxSpeed: this._config.maxSpeed,
					minSpeed: this._config.minSpeed
				})
			} else {
				// String-based custom CSS
				styleElement.textContent = this._config.customStyles
			}

			// Auto-adjust translateYvalue if enabled and not explicitly set
			if (this._config.autoDetectTransform && !this._userOptions.hasOwnProperty('translateYvalue')) {
				this._config.translateYvalue = 0
				console.info('ScrollAnimator: translateYvalue auto-set to 0 for custom CSS. Set explicitly to override.')
			}
		} else {
			// Use default template (null or 'template')
			styleElement.textContent = this._generateDefaultStyles()
		}

		// Store reference and append to document head
		this._elements.styleElement = styleElement
		document.head.appendChild(styleElement)
	}

	/**
	 * Creates the debug window UI element
	 *
	 * @private
	 *
	 * @description
	 * Creates a fixed-position debug window that displays real-time scroll speed
	 * and animation information. The window is only created if debug mode is enabled.
	 * Waits for document readystate 'interactive' before appending to body.
	 */
	_createDebugWindow() {
		if (!this._config.debug) return

		const debugWindow = document.createElement('div')
		debugWindow.id = 'scroll-animator-debug-window'
		debugWindow.style.position = 'fixed'
		debugWindow.style.top = '0'
		debugWindow.style.left = '0'
		debugWindow.style.zIndex = '9999'
		debugWindow.style.backgroundColor = 'rgba(255,255,255,0.6)'
		debugWindow.style.padding = '8px'
		debugWindow.style.fontSize = '12px'
		debugWindow.style.fontFamily = 'monospace'
		debugWindow.style.lineHeight = '1.4'

		// Store reference
		this._elements.debugWindow = debugWindow

		// Wait for body to be available before appending
		const appendDebugWindow = () => {
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				if (document.body) {
					document.body.appendChild(debugWindow)
				}
			}
		}

		// Try to append immediately if document is ready
		if (document.readyState === 'interactive' || document.readyState === 'complete') {
			appendDebugWindow()
		} else {
			// Otherwise wait for readystatechange
			document.addEventListener('readystatechange', appendDebugWindow, { once: true })
		}
	}

	/**
	 * Initializes the IntersectionObserver with the provided elements
	 *
	 * @private
	 * @param {Array<HTMLElement>} elementsArray - Array of elements to observe
	 *
	 * @description
	 * Creates an IntersectionObserver that triggers animations when elements
	 * enter the viewport. Uses the configured rootMargin and threshold values.
	 * The observer callback is bound to the instance context.
	 */
	_initObserver(elementsArray) {
		// Create IntersectionObserver with bound callback
		this._observer = new IntersectionObserver(
			this._aosSelectorsManager.bind(this),
			{
				root: null,
				rootMargin: this._config.observerRootMargin,
				threshold: this._config.observerThreshold
			}
		)

		// Observe all elements in the array
		elementsArray.forEach(element => {
			if (this._observer) {
				this._observer.observe(element)
			}
		})
	}

	// ============================================================================
	// PUBLIC API METHODS
	// ============================================================================

	/**
	 * Initializes the ScrollAnimator and starts observing elements
	 *
	 * @public
	 * @returns {ScrollAnimator} Returns this for method chaining
	 *
	 * @description
	 * Queries the DOM for elements with the configured mainClassName and sets up
	 * the IntersectionObserver to animate them on scroll. This method can be called
	 * manually or is automatically called on window load.
	 *
	 * Initialization steps:
	 * 1. Checks if already initialized (returns early if true)
	 * 2. Queries DOM for elements to animate
	 * 3. Validates elements exist
	 * 4. Applies LCP optimization if configured and page is at top
	 * 5. Reveals elements above viewport if page is scrolled
	 * 6. Initializes IntersectionObserver with filtered elements
	 *
	 * @example
	 * const animator = new ScrollAnimator()
	 * animator.init() // Manually initialize
	 *
	 * @example
	 * // With method chaining
	 * const animator = new ScrollAnimator({ debug: true }).init()
	 */
	init() {
		// Check if already initialized
		if (this._isInitialized) {
			console.warn('ScrollAnimator: Already initialized')
			return this
		}

		// Update scroll position
		this._scroll.lastTopPos = this._getScrollY()

		if (this._config.debug) {
			console.timeLog('ScrollAnimator', 'init() method called')
			console.log("🚀 ~ ScrollAnimator ~ lastTopPos:", this._scroll.lastTopPos, "px")
		}

		// Query DOM for elements only if not already queried by _handleReadyStateChange()
		if (this._elements.nodeList.length === 0) {
			this._elements.nodeList = Array.from(
				document.querySelectorAll(`.${this._config.mainClassName}`)
			)
		}

		// Validate elements exist
		if (this._elements.nodeList.length === 0) {
			console.warn(`⚠️ ScrollAnimator: No elements found with class '.${this._config.mainClassName}'`)
			return this
		}

		if (this._config.debug) {
			console.log("*****************************\nScrollAnimator Initialized\n*****************************")
			console.log(`Found ${this._elements.nodeList.length} elements to animate`)
		}

		// Apply LCP optimization if configured and page is at top
		if (this._transition.optimizeLCP && this._elements.nodeList.length > 0 && this._scroll.lastTopPos === 0) {
			if (this._config.debug) {
				console.log("Applying LCP optimization")
			}
			this._elements.nodeList = this._optimizeAosForLcp(this._elements.nodeList)
		}

		// Handle elements above viewport if page is scrolled
		if (this._scroll.lastTopPos > 0) {
			if (this._config.debug) {
				console.log("Revealing elements above viewport before initialization")
			}

			this._revealElementsAboveViewport(this._elements.nodeList).then(filteredElements => {
				this._initObserver(filteredElements)
			})
		} else {
			if (this._config.debug) {
				console.log("Direct initialization")
			}

			this._initObserver(this._elements.nodeList)
		}

		// Mark as initialized
		this._isInitialized = true

		return this
	}

	// ============================================================================
	// EVENT MANAGEMENT METHODS
	// ============================================================================

	/**
	 * Attaches all event listeners with proper binding
	 *
	 * @private
	 *
	 * @description
	 * Creates bound references for all event handlers and attaches them to their
	 * respective targets. Bound references are stored in this._boundHandlers for
	 * proper cleanup later.
	 *
	 * Event listeners attached:
	 * - window scroll (passive, for performance)
	 * - document readystatechange (for early DOM query)
	 * - window load (for automatic initialization)
	 */
	_attachEventListeners() {
		// Bind handlers to instance context and store references
		this._boundHandlers.scroll = this._handleScroll.bind(this)
		this._boundHandlers.readyStateChange = this._handleReadyStateChange.bind(this)
		this._boundHandlers.load = this._handleLoad.bind(this)

		// Attach event listeners
		window.addEventListener('scroll', this._boundHandlers.scroll, { passive: true })
		document.addEventListener('readystatechange', this._boundHandlers.readyStateChange)
		window.addEventListener('load', this._boundHandlers.load)
	}

	/**
	 * Removes all event listeners
	 *
	 * @private
	 *
	 * @description
	 * Removes all event listeners using the stored bound handler references.
	 * This ensures proper cleanup and prevents memory leaks.
	 */
	_detachEventListeners() {
		// Remove listeners using stored bound references
		if (this._boundHandlers.scroll) {
			window.removeEventListener('scroll', this._boundHandlers.scroll)
		}
		if (this._boundHandlers.readyStateChange) {
			document.removeEventListener('readystatechange', this._boundHandlers.readyStateChange)
		}
		if (this._boundHandlers.load) {
			window.removeEventListener('load', this._boundHandlers.load)
		}

		// Clear bound handlers
		this._boundHandlers = {}
	}

	/**
	 * Handles scroll events with requestAnimationFrame throttling
	 *
	 * @private
	 *
	 * @description
	 * Scroll event handler that:
	 * - Throttles scroll events using requestAnimationFrame
	 * - Measures scroll speed during scrolling
	 * - Implements debounced end-of-scroll detection
	 * - Calls scrollMeasurementReporter with final flag when scroll ends
	 *
	 * The ticking flag prevents multiple RAF calls from being queued.
	 * The dynamic delay adapts to scroll event frequency for accurate end detection.
	 */
	_handleScroll() {
		if (!this._scrollListener.ticking) {
			// Avoid recalculating too often by going through requestAnimationFrame
			// requestAnimationFrame is only triggered once per frame
			requestAnimationFrame(() => {

				// Get current scroll position
				const currentScrollTop = this._getScrollY()
				this._scrollMeasurementReporter(currentScrollTop, false) // Call during scroll

				// Debouncer to reset the measure values at each end of scroll
				// Calculate the dynamic delay to detect the end of scroll
				const now = performance.now()
				const deltaTime = now - this._scroll.lastTime
				const dynamicDelay = deltaTime + 80 // Adaptive delay based on event frequency

				clearTimeout(this._scrollListener.endTimer)
				this._scrollListener.endTimer = setTimeout(() => {
					if (this._config.debug) {
						console.log("🏁 Scroll finished, final call...")
					}
					this._scrollMeasurementReporter(this._getScrollY(), true) // Final call after scroll ends
				}, dynamicDelay)

				this._scrollListener.ticking = false
			})
			this._scrollListener.ticking = true
		}
	}

	/**
	 * Handles document readystatechange events
	 *
	 * @private
	 *
	 * @description
	 * Fires when document.readyState changes. When state reaches 'interactive',
	 * this method:
	 * - Updates scroll position
	 * - Queries DOM for elements to animate
	 * - Applies LCP optimization if configured
	 * - Does NOT call init() - only prepares elements for later initialization
	 *
	 * This runs before window.load, allowing early DOM access while resources
	 * are still loading.
	 */
	_handleReadyStateChange() {
		if (document.readyState === 'interactive') {

			// Re-evaluate scroll position (more accurate at interactive state)
			this._scroll.lastTopPos = this._getScrollY()

			if (this._config.debug) {
				console.timeLog('ScrollAnimator', 'readyState: interactive')
				console.log("🚀 ~ ScrollAnimator ~ lastTopPos:", this._scroll.lastTopPos, "px")
			}

			// Query DOM for elements to animate
			this._elements.nodeList = Array.from(
				document.querySelectorAll(`.${this._config.mainClassName}`)
			)

			if (this._elements.nodeList.length === 0) {
				console.warn(`⚠️ ScrollAnimator: No elements found with class '.${this._config.mainClassName}'`)
				// Don't return - just log warning and continue
			}

			// Apply LCP optimization if configured and page is at top
			if (this._transition.optimizeLCP &&
				this._elements.nodeList.length > 0 &&
				this._scroll.lastTopPos === 0) {

				if (this._config.debug) {
					console.log("Applying LCP optimization at readyState: interactive")
				}

				this._elements.nodeList = this._optimizeAosForLcp(this._elements.nodeList)
			}
		}
	}

	/**
	 * Handles window load events
	 *
	 * @private
	 *
	 * @description
	 * Fires when window.load event occurs (all resources loaded).
	 * Automatically calls init() if:
	 * - Not already initialized
	 * - Elements were found during readystatechange
	 *
	 * This is the automatic initialization path. Users can also call init() manually.
	 */
	_handleLoad() {
		if (this._config.debug) {
			console.timeLog('ScrollAnimator', 'window load event')
		}

		// Re-evaluate scroll position (final accurate value)
		this._scroll.lastTopPos = this._getScrollY()

		if (this._config.debug) {
			console.log("🚀 ~ ScrollAnimator ~ lastTopPos:", this._scroll.lastTopPos, "px")
		}

		// Auto-initialize if elements exist and not already initialized
		if (this._elements.nodeList.length > 0) {

			if (this._config.debug) {
				console.log("*****************************\nScrollAnimator Auto-Initializing\n*****************************")
			}

			// Only initialize if not already done
			if (!this._isInitialized) {
				this.init()
			}
		}
	}

	// ============================================================================
	// PUBLIC LIFECYCLE METHODS
	// ============================================================================

	/**
	 * Destroys the ScrollAnimator instance and cleans up all resources
	 *
	 * @public
	 * @returns {void}
	 *
	 * @description
	 * Performs comprehensive cleanup of the ScrollAnimator instance:
	 * - Disconnects IntersectionObserver
	 * - Clears all timers
	 * - Removes all event listeners
	 * - Removes injected styles from DOM
	 * - Removes debug window from DOM
	 * - Removes animation classes and inline styles from elements
	 * - Resets internal state
	 *
	 * This method is essential for preventing memory leaks, especially in
	 * Single Page Applications (SPAs) where components are mounted/unmounted.
	 *
	 * @example
	 * // React component cleanup
	 * useEffect(() => {
	 *   const animator = new ScrollAnimator()
	 *   return () => animator.destroy() // Cleanup on unmount
	 * }, [])
	 *
	 * @example
	 * // Vue component cleanup
	 * beforeUnmount() {
	 *   this.animator.destroy()
	 * }
	 *
	 * @example
	 * // Manual cleanup
	 * const animator = new ScrollAnimator()
	 * // ... use animator ...
	 * animator.destroy() // Clean up when done
	 */
	destroy() {
		// 1. Disconnect IntersectionObserver
		if (this._observer) {
			this._observer.disconnect()
			this._observer = null
		}

		// 2. Clear all timers
		clearTimeout(this._scrollListener.endTimer)
		clearTimeout(this._intersectionObserverEndTimer)

		// 3. Remove event listeners
		this._detachEventListeners()

		// 4. Remove injected styles
		if (this._elements.styleElement && this._elements.styleElement.parentNode) {
			this._elements.styleElement.parentNode.removeChild(this._elements.styleElement)
			this._elements.styleElement = null
		}

		// 5. Remove debug window
		if (this._elements.debugWindow && this._elements.debugWindow.parentNode) {
			this._elements.debugWindow.parentNode.removeChild(this._elements.debugWindow)
			this._elements.debugWindow = null
		}

		// 6. Remove animation classes and inline styles from elements
		this._elements.nodeList.forEach(element => {
			element.classList.remove(this._config.visibleClassName)
			element.style.transitionDuration = ''
			element.style.transitionDelay = ''
			element.style.willChange = ''
			if (this._config.debug) {
				element.style.outline = ''
				delete element.dataset.info
			}
		})

		// 7. Reset state
		this._elements.nodeList = []
		this._isInitialized = false
		this._isPaused = false

		// 8. End performance timer if debug
		if (this._config.debug) {
			console.timeEnd('ScrollAnimator')
			console.log('ScrollAnimator destroyed and cleaned up')
		}
	}

	/**
	 * Re-queries DOM for elements and restarts observation
	 *
	 * @public
	 * @returns {ScrollAnimator} Returns this for method chaining
	 *
	 * @description
	 * Useful when new elements are added to the DOM dynamically (e.g., via AJAX,
	 * infinite scroll, or dynamic content loading). This method will:
	 * - Disconnect current observer
	 * - Re-query DOM for elements with mainClassName
	 * - Restart observation with new element list
	 *
	 * @example
	 * // After loading more content via AJAX
	 * const animator = new ScrollAnimator()
	 *
	 * async function loadMoreContent() {
	 *   const response = await fetch('/api/more-content')
	 *   document.getElementById('content').innerHTML += await response.text()
	 *   animator.refresh() // Re-scan for new elements
	 * }
	 *
	 * @example
	 * // After search/filter updates
	 * searchInput.addEventListener('input', async (e) => {
	 *   const results = await searchProducts(e.target.value)
	 *   resultsContainer.innerHTML = renderResults(results)
	 *   animator.refresh() // Observe new results
	 * })
	 */
	refresh() {
		// Check if initialized
		if (!this._isInitialized) {
			console.warn('ScrollAnimator: Cannot refresh - not initialized. Call init() first.')
			return this
		}

		if (this._config.debug) {
			console.log('ScrollAnimator: Refreshing - re-querying DOM for elements')
		}

		// Disconnect current observer
		if (this._observer) {
			this._observer.disconnect()
		}

		// Re-query DOM for elements
		this._elements.nodeList = Array.from(
			document.querySelectorAll(`.${this._config.mainClassName}`)
		)

		// Validate elements exist
		if (this._elements.nodeList.length === 0) {
			console.warn(`⚠️ ScrollAnimator: No elements found with class '.${this._config.mainClassName}' after refresh`)
			return this
		}

		if (this._config.debug) {
			console.log(`ScrollAnimator: Found ${this._elements.nodeList.length} elements after refresh`)
		}

		// Restart observation
		this._initObserver(this._elements.nodeList)

		return this
	}

	// ============================================================================
	// PUBLIC CONTROL METHODS
	// ============================================================================

	/**
	 * Temporarily stops observing new elements
	 *
	 * @public
	 * @returns {ScrollAnimator} Returns this for method chaining
	 *
	 * @description
	 * Pauses the IntersectionObserver, stopping it from detecting new elements
	 * entering the viewport. Existing animations that have already started will
	 * continue to completion.
	 *
	 * Useful for:
	 * - Reducing CPU usage during heavy operations
	 * - Pausing animations when modals/overlays are open
	 * - Temporarily disabling animations during video playback
	 *
	 * @example
	 * // Pause during modal open
	 * const animator = new ScrollAnimator()
	 *
	 * modal.addEventListener('open', () => {
	 *   animator.pause()
	 * })
	 *
	 * modal.addEventListener('close', () => {
	 *   animator.resume()
	 * })
	 *
	 * @example
	 * // Pause during video playback
	 * video.addEventListener('play', () => animator.pause())
	 * video.addEventListener('pause', () => animator.resume())
	 */
	pause() {
		// Check if already paused
		if (this._isPaused) {
			if (this._config.debug) {
				console.log('ScrollAnimator: Already paused')
			}
			return this
		}

		if (this._config.debug) {
			console.log('ScrollAnimator: Pausing observation')
		}

		// Disconnect observer and clear reference
		if (this._observer) {
			this._observer.disconnect()
			this._observer = null
		}

		this._isPaused = true

		return this
	}

	/**
	 * Resumes observation after pause
	 *
	 * @public
	 * @returns {ScrollAnimator} Returns this for method chaining
	 *
	 * @description
	 * Resumes the IntersectionObserver after it was paused with pause().
	 * Re-initializes the observer with the current element list.
	 *
	 * @example
	 * const animator = new ScrollAnimator()
	 *
	 * // Pause and resume
	 * animator.pause()
	 * // ... do something ...
	 * animator.resume()
	 *
	 * @example
	 * // Resume after modal closes
	 * modal.addEventListener('close', () => {
	 *   animator.resume()
	 * })
	 */
	resume() {
		// Check if not paused
		if (!this._isPaused) {
			if (this._config.debug) {
				console.log('ScrollAnimator: Not paused, nothing to resume')
			}
			return this
		}

		// Check if initialized
		if (!this._isInitialized) {
			console.warn('ScrollAnimator: Cannot resume - not initialized. Call init() first.')
			return this
		}

		if (this._config.debug) {
			console.log('ScrollAnimator: Resuming observation')
		}

		// Re-initialize observer with current elements
		this._initObserver(this._elements.nodeList)

		this._isPaused = false

		return this
	}

	/**
	 * Adds new elements to observe
	 *
	 * @public
	 * @param {Element|Element[]|NodeList} elements - Element(s) to add
	 * @returns {ScrollAnimator} Returns this for method chaining
	 *
	 * @description
	 * Adds new elements to the observation list without re-querying the entire DOM.
	 * More efficient than refresh() when you know exactly which elements to add.
	 *
	 * Accepts:
	 * - Single Element
	 * - Array of Elements
	 * - NodeList
	 *
	 * @example
	 * // Add single element
	 * const animator = new ScrollAnimator()
	 * const newElement = document.createElement('div')
	 * newElement.classList.add('animate-on-scroll')
	 * document.body.appendChild(newElement)
	 * animator.addElements(newElement)
	 *
	 * @example
	 * // Add multiple elements
	 * const newElements = document.querySelectorAll('.dynamic-content')
	 * animator.addElements(newElements)
	 *
	 * @example
	 * // Real-time notification
	 * socket.on('notification', (data) => {
	 *   const notif = createNotification(data)
	 *   notif.classList.add('animate-on-scroll')
	 *   container.appendChild(notif)
	 *   animator.addElements(notif)
	 * })
	 */
	addElements(elements) {
		// Normalize input to array
		let elementsArray
		if (elements instanceof Element) {
			elementsArray = [elements]
		} else if (elements instanceof NodeList) {
			elementsArray = Array.from(elements)
		} else if (Array.isArray(elements)) {
			elementsArray = elements
		} else {
			console.warn('ScrollAnimator: addElements() requires Element, Array, or NodeList')
			return this
		}

		// Validate elements exist
		if (elementsArray.length === 0) {
			console.warn('ScrollAnimator: No elements provided to addElements()')
			return this
		}

		// Check if initialized
		if (!this._isInitialized) {
			console.warn('ScrollAnimator: Cannot add elements - not initialized. Call init() first.')
			return this
		}

		// Check if paused
		if (this._isPaused) {
			console.warn('ScrollAnimator: Cannot add elements while paused. Call resume() first.')
			return this
		}

		if (this._config.debug) {
			console.log(`ScrollAnimator: Adding ${elementsArray.length} element(s) to observation`)
		}

		// Add elements to nodeList and observe them
		elementsArray.forEach(element => {
			// Add to internal list
			this._elements.nodeList.push(element)

			// Observe the element
			if (this._observer) {
				this._observer.observe(element)
			}
		})

		return this
	}

	/**
	 * Stops observing specific elements
	 *
	 * @public
	 * @param {Element|Element[]|NodeList} elements - Element(s) to remove
	 * @returns {ScrollAnimator} Returns this for method chaining
	 *
	 * @description
	 * Removes specific elements from observation. The elements remain in the DOM
	 * but will no longer be animated when scrolling.
	 *
	 * Accepts:
	 * - Single Element
	 * - Array of Elements
	 * - NodeList
	 *
	 * @example
	 * // Remove single element
	 * const animator = new ScrollAnimator()
	 * const element = document.querySelector('.no-longer-animate')
	 * animator.removeElements(element)
	 *
	 * @example
	 * // Remove multiple elements
	 * const elements = document.querySelectorAll('.already-seen')
	 * animator.removeElements(elements)
	 *
	 * @example
	 * // Remove before deleting from DOM
	 * deleteButton.addEventListener('click', () => {
	 *   const item = deleteButton.closest('.item')
	 *   animator.removeElements(item)
	 *   item.remove()
	 * })
	 */
	removeElements(elements) {
		// Normalize input to array
		let elementsArray
		if (elements instanceof Element) {
			elementsArray = [elements]
		} else if (elements instanceof NodeList) {
			elementsArray = Array.from(elements)
		} else if (Array.isArray(elements)) {
			elementsArray = elements
		} else {
			console.warn('ScrollAnimator: removeElements() requires Element, Array, or NodeList')
			return this
		}

		// Validate elements exist
		if (elementsArray.length === 0) {
			console.warn('ScrollAnimator: No elements provided to removeElements()')
			return this
		}

		// Check if initialized
		if (!this._isInitialized) {
			console.warn('ScrollAnimator: Cannot remove elements - not initialized.')
			return this
		}

		if (this._config.debug) {
			console.log(`ScrollAnimator: Removing ${elementsArray.length} element(s) from observation`)
		}

		// Unobserve and remove from nodeList
		elementsArray.forEach(element => {
			// Unobserve the element
			if (this._observer) {
				this._observer.unobserve(element)
			}

			// Remove from internal list
			const index = this._elements.nodeList.indexOf(element)
			if (index > -1) {
				this._elements.nodeList.splice(index, 1)
			}
		})

		return this
	}

	// ============================================================================
	// PUBLIC GETTER METHODS
	// ============================================================================

	/**
	 * Returns whether the ScrollAnimator is initialized
	 *
	 * @public
	 * @returns {boolean} True if initialized, false otherwise
	 *
	 * @example
	 * const animator = new ScrollAnimator()
	 * console.log(animator.isInitialized) // false
	 * animator.init()
	 * console.log(animator.isInitialized) // true
	 */
	get isInitialized() {
		return this._isInitialized
	}

	/**
	 * Returns whether the ScrollAnimator is paused
	 *
	 * @public
	 * @returns {boolean} True if paused, false otherwise
	 *
	 * @example
	 * const animator = new ScrollAnimator()
	 * console.log(animator.isPaused) // false
	 * animator.pause()
	 * console.log(animator.isPaused) // true
	 */
	get isPaused() {
		return this._isPaused
	}

	/**
	 * Returns the current scroll speed in pixels per second
	 *
	 * @public
	 * @returns {number} Current scroll speed in px/s
	 *
	 * @example
	 * const animator = new ScrollAnimator()
	 * console.log(animator.currentSpeed) // e.g., 1250
	 *
	 * @example
	 * // Monitor scroll speed
	 * setInterval(() => {
	 *   console.log(`Speed: ${animator.currentSpeed} px/s`)
	 * }, 1000)
	 */
	get currentSpeed() {
		return this._scroll.currentSpeed
	}

	/**
	 * Returns a copy of the currently observed elements array
	 *
	 * @public
	 * @returns {Element[]} Array of observed elements (copy to prevent mutation)
	 *
	 * @example
	 * const animator = new ScrollAnimator()
	 * const elements = animator.observedElements
	 * console.log(`Observing ${elements.length} elements`)
	 *
	 * @example
	 * // Check if specific element is observed
	 * const myElement = document.querySelector('.my-element')
	 * const isObserved = animator.observedElements.includes(myElement)
	 */
	get observedElements() {
		return [...this._elements.nodeList]
	}
}

// Export for module systems (if applicable)
if (typeof module !== 'undefined' && module.exports) {
	module.exports = ScrollAnimator
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
	window.ScrollAnimator = ScrollAnimator
}
