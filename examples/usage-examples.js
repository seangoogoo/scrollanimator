/**
 * ScrollAnimator Usage Examples
 *
 * This file contains comprehensive examples demonstrating how to use the
 * ScrollAnimator class in various real-world scenarios.
 *
 * IMPORTANT: INITIALIZATION PATTERNS
 * ===================================
 * ScrollAnimator supports TWO initialization patterns:
 *
 * 1. AUTOMATIC INITIALIZATION (Recommended for most cases)
 *    - Simply create an instance: const animator = new ScrollAnimator()
 *    - init() is called automatically on window.load event
 *    - Best for standard websites and landing pages
 *    - No manual init() call needed
 *
 * 2. MANUAL INITIALIZATION (Optional - for specific scenarios)
 *    - Create instance and call init() explicitly
 *    - Useful for: SPAs, dynamic content, testing, early initialization
 *    - Gives you explicit control over initialization timing
 *    - Required in SPAs where window.load has already fired
 *
 * Most examples in this file demonstrate AUTOMATIC initialization as the
 * recommended approach. Manual init() examples are clearly marked and
 * explain when manual initialization is beneficial.
 *
 * Table of Contents:
 * 1. Basic Usage Examples (automatic & manual patterns)
 * 2. Lifecycle Management Examples
 * 3. Element Management Examples
 * 4. Custom CSS Examples
 * 5. Multiple Instances Examples
 * 6. SPA Integration Examples (manual init() for SPAs)
 * 7. Advanced Configuration Examples
 * 8. Getter Methods Examples
 */

// ============================================================================
// 1. BASIC USAGE EXAMPLES
// ============================================================================

/**
 * Example 1.1: Automatic initialization with default options (RECOMMENDED)
 *
 * This is the simplest way to use ScrollAnimator. It will:
 * - Look for elements with class "animate-on-scroll"
 * - Apply default fade-in and slide-up animation
 * - Use default speed and delay settings
 * - Initialize automatically on window.load event
 *
 * NOTE: You don't need to call init() manually - it happens automatically!
 */
const example1_1 = () => {
	// HTML structure:
	// <div class="animate-on-scroll">Content to animate</div>
	// <div class="animate-on-scroll">More content</div>

	// Create instance - initialization happens automatically on window.load
	const animator = new ScrollAnimator()

	// That's it! No need to call init() - it will be called automatically
	// Elements will animate when they enter the viewport after page loads
}

/**
 * Example 1.2: Manual initialization with custom configuration
 *
 * Demonstrates manual init() for scenarios requiring explicit control:
 * - Immediate initialization before window.load
 * - Dynamic content loaded via AJAX
 * - SPA route changes
 * - Testing scenarios
 */
const example1_2 = () => {
	// HTML structure:
	// <div class="my-animated-element">Content to animate</div>

	const animator = new ScrollAnimator({
		mainClassName: 'my-animated-element',
		visibleClassName: 'is-visible',
		translateYvalue: 80,
		maxSpeed: 1000,
		minSpeed: 700,
		delayMax: 150,
		delayMin: 50
	})

	// Manual init() for immediate control
	animator.init()

	// Useful when you need animations to start before window.load
	// or when working with dynamically loaded content
}

/**
 * Example 1.3: Using destroy() method for cleanup
 *
 * Always call destroy() when you're done with the animator to prevent
 * memory leaks and clean up event listeners.
 *
 * NOTE: This example uses automatic initialization (no init() call)
 */
const example1_3 = () => {
	// Create instance - will initialize automatically on window.load
	const animator = new ScrollAnimator()

	// Later, when you want to clean up (e.g., component unmount in SPA):
	animator.destroy()

	// The animator is now completely cleaned up:
	// - IntersectionObserver disconnected
	// - Event listeners removed
	// - Style element removed from DOM
	// - Animation classes removed from elements
}

/**
 * Example 1.4: Automatic initialization for standard websites (NEW)
 *
 * This example demonstrates the recommended pattern for standard websites.
 * No manual init() call is needed - ScrollAnimator handles everything automatically.
 */
const example1_4 = () => {
	// HTML structure:
	// <div class="animate-on-scroll">Hero section</div>
	// <div class="animate-on-scroll">Features section</div>
	// <div class="animate-on-scroll">Testimonials section</div>

	// Simply create the instance
	const animator = new ScrollAnimator({
		debug: false,
		optimizeLCP: true // Optimize for performance
	})

	// That's it! The animator will:
	// 1. Inject CSS styles immediately (in <head>)
	// 2. Attach event listeners
	// 3. Query DOM for elements when document is interactive
	// 4. Initialize automatically on window.load
	// 5. Start animating elements as they enter the viewport

	// No manual init() needed - perfect for standard websites!
}

// ============================================================================
// 2. LIFECYCLE MANAGEMENT EXAMPLES
// ============================================================================

/**
 * Example 2.1: Complete lifecycle pattern
 *
 * Demonstrates the full lifecycle: create → init → use → destroy
 */
const example2_1 = () => {
	// Create instance
	const animator = new ScrollAnimator({
		mainClassName: 'fade-in',
		debug: true // Enable debug mode to see console logs
	})

	// Initialize and start observing
	animator.init()

	// Use the animator...
	// Elements will animate as user scrolls

	// Clean up when done
	window.addEventListener('beforeunload', () => {
		animator.destroy()
	})
}

/**
 * Example 2.2: Pausing and resuming animations
 *
 * Useful for temporarily disabling animations (e.g., when a modal is open)
 */
const example2_2 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Pause animations (e.g., when modal opens)
	const modal = document.querySelector('.modal')
	modal.addEventListener('open', () => {
		animator.pause()
		console.log('Animations paused')
	})

	// Resume animations (e.g., when modal closes)
	modal.addEventListener('close', () => {
		animator.resume()
		console.log('Animations resumed')
	})
}

/**
 * Example 2.3: Refreshing elements after DOM changes
 *
 * Use refresh() when you add/remove elements from the DOM dynamically
 */
const example2_3 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Later, after adding new elements to the DOM:
	const container = document.querySelector('.content')
	container.innerHTML += '<div class="animate-on-scroll">New content</div>'

	// Refresh to observe the new elements
	animator.refresh()
}

/**
 * Example 2.4: Method chaining pattern
 *
 * All public methods return 'this' for fluent API usage
 */
const example2_4 = () => {
	const animator = new ScrollAnimator({ debug: true })
		.init()
		.pause()
		.resume()
		.refresh()

	// Later:
	animator.destroy()
}

// ============================================================================
// 3. ELEMENT MANAGEMENT EXAMPLES
// ============================================================================

/**
 * Example 3.1: Adding new elements dynamically
 *
 * Use addElements() to add specific elements without re-querying the entire DOM
 */
const example3_1 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Create new element
	const newElement = document.createElement('div')
	newElement.className = 'animate-on-scroll'
	newElement.textContent = 'Dynamically added content'
	document.body.appendChild(newElement)

	// Add it to the animator
	animator.addElements([newElement])
}

/**
 * Example 3.2: Removing specific elements
 *
 * Use removeElements() to stop observing specific elements
 */
const example3_2 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Later, remove specific elements
	const elementToRemove = document.querySelector('.animate-on-scroll:first-child')
	animator.removeElements([elementToRemove])

	// The element is no longer observed, but remains in the DOM
}

/**
 * Example 3.3: Working with dynamically loaded content (AJAX/Fetch)
 *
 * Common pattern for infinite scroll or lazy-loaded content
 */
const example3_3 = async () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Load more content via AJAX
	const loadMoreButton = document.querySelector('.load-more')
	loadMoreButton.addEventListener('click', async () => {
		// Fetch new content
		const response = await fetch('/api/more-content')
		const html = await response.text()

		// Add to DOM
		const container = document.querySelector('.content')
		container.insertAdjacentHTML('beforeend', html)

		// Refresh animator to observe new elements
		animator.refresh()
	})
}

// ============================================================================
// 4. CUSTOM CSS EXAMPLES
// ============================================================================

/**
 * Example 4.1: Using default template (customStyles: null)
 *
 * The default template provides a fade-in and slide-up animation
 */
const example4_1 = () => {
	const animator = new ScrollAnimator({
		customStyles: null // This is the default
	})
	animator.init()

	// Uses built-in CSS with fade-in and translateY animation
}

/**
 * Example 4.2: Using custom CSS string
 *
 * Provide your own CSS as a string for complete control
 */
const example4_2 = () => {
	const animator = new ScrollAnimator({
		mainClassName: 'slide-in',
		visibleClassName: 'visible',
		customStyles: `
			.slide-in {
				opacity: 0;
				transform: translateX(-100px);
				transition: all 0.8s ease-out;
			}
			.slide-in.visible {
				opacity: 1;
				transform: translateX(0);
			}
		`
	})
	animator.init()
}

/**
 * Example 4.3: Using function-based CSS generator
 *
 * Generate CSS dynamically using config values for type-safe class names
 */
const example4_3 = () => {
	const animator = new ScrollAnimator({
		mainClassName: 'zoom-in',
		visibleClassName: 'active',
		translateYvalue: 50,
		maxSpeed: 900,
		minSpeed: 600,
		customStyles: ({ mainClassName, visibleClassName, translateYvalue, maxSpeed, minSpeed }) => `
			.${mainClassName} {
				opacity: 0;
				transform: scale(0.8) translateY(${translateYvalue}px);
				transition: all ${minSpeed}ms ease-out;
			}
			.${mainClassName}.${visibleClassName} {
				opacity: 1;
				transform: scale(1) translateY(0);
				transition-duration: ${maxSpeed}ms;
			}
		`
	})
	animator.init()
}

/**
 * Example 4.4: Using 'external' keyword for external stylesheets
 *
 * Use when you have CSS defined in external stylesheets or CSS-in-JS
 */
const example4_4 = () => {
	// CSS in external stylesheet:
	// .fade-in { opacity: 0; transition: opacity 0.6s; }
	// .fade-in.visible { opacity: 1; }

	const animator = new ScrollAnimator({
		mainClassName: 'fade-in',
		visibleClassName: 'visible',
		customStyles: 'external'
	})
	animator.init()

	// No CSS is injected - uses external stylesheet
}

/**
 * Example 4.5: Using 'template' keyword with custom config values
 *
 * Use the default template but with your custom configuration values
 */
const example4_5 = () => {
	const animator = new ScrollAnimator({
		mainClassName: 'my-animation',
		translateYvalue: 120,
		maxSpeed: 1200,
		customStyles: 'template' // Uses default template with custom values
	})
	animator.init()
}

// ============================================================================
// 5. MULTIPLE INSTANCES EXAMPLES
// ============================================================================

/**
 * Example 5.1: Multiple instances with different configurations
 *
 * Create separate animators for different sections of your page
 */
const example5_1 = () => {
	// Fade-in animation for hero section
	const heroAnimator = new ScrollAnimator({
		mainClassName: 'hero-fade',
		customStyles: `
			.hero-fade { opacity: 0; transition: opacity 1s; }
			.hero-fade.aos-visible { opacity: 1; }
		`
	})
	heroAnimator.init()

	// Slide-up animation for content section
	const contentAnimator = new ScrollAnimator({
		mainClassName: 'content-slide',
		customStyles: `
			.content-slide { opacity: 0; transform: translateY(50px); transition: all 0.6s; }
			.content-slide.aos-visible { opacity: 1; transform: translateY(0); }
		`
	})
	contentAnimator.init()

	// Zoom animation for gallery section
	const galleryAnimator = new ScrollAnimator({
		mainClassName: 'gallery-zoom',
		customStyles: `
			.gallery-zoom { opacity: 0; transform: scale(0.9); transition: all 0.8s; }
			.gallery-zoom.aos-visible { opacity: 1; transform: scale(1); }
		`
	})
	galleryAnimator.init()
}

/**
 * Example 5.2: Mixing default and custom CSS instances
 *
 * Use default template for some sections and custom CSS for others
 */
const example5_2 = () => {
	// Default animation for general content
	const defaultAnimator = new ScrollAnimator({
		mainClassName: 'animate-default'
	})
	defaultAnimator.init()

	// Custom animation for special sections
	const specialAnimator = new ScrollAnimator({
		mainClassName: 'animate-special',
		customStyles: ({ mainClassName }) => `
			.${mainClassName} {
				opacity: 0;
				transform: rotate(-5deg) scale(0.9);
				transition: all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
			}
			.${mainClassName}.aos-visible {
				opacity: 1;
				transform: rotate(0) scale(1);
			}
		`
	})
	specialAnimator.init()
}

// ============================================================================
// 6. SPA INTEGRATION EXAMPLES
// ============================================================================

/**
 * Example 6.1: React component integration
 *
 * Proper setup and cleanup in React components using useEffect
 */
const example6_1_React = () => {
	// React component example:
	/*
	import { useEffect, useRef } from 'react'
	import ScrollAnimator from './scroll-animator.js'

	function MyComponent() {
		const animatorRef = useRef(null)

		useEffect(() => {
			// Create and initialize animator
			animatorRef.current = new ScrollAnimator({
				mainClassName: 'fade-in',
				debug: false
			})
			animatorRef.current.init()

			// Cleanup on unmount
			return () => {
				if (animatorRef.current) {
					animatorRef.current.destroy()
					animatorRef.current = null
				}
			}
		}, []) // Empty dependency array = run once on mount

		return (
			<div>
				<div className="fade-in">Content 1</div>
				<div className="fade-in">Content 2</div>
				<div className="fade-in">Content 3</div>
			</div>
		)
	}
	*/
}

/**
 * Example 6.2: Vue component integration
 *
 * Proper setup and cleanup in Vue components using lifecycle hooks
 */
const example6_2_Vue = () => {
	// Vue component example:
	/*
	<template>
		<div>
			<div class="slide-up">Content 1</div>
			<div class="slide-up">Content 2</div>
			<div class="slide-up">Content 3</div>
		</div>
	</template>

	<script>
	import ScrollAnimator from './scroll-animator.js'

	export default {
		name: 'MyComponent',
		data() {
			return {
				animator: null
			}
		},
		mounted() {
			// Create and initialize animator
			this.animator = new ScrollAnimator({
				mainClassName: 'slide-up',
				customStyles: `
					.slide-up { opacity: 0; transform: translateY(30px); transition: all 0.6s; }
					.slide-up.aos-visible { opacity: 1; transform: translateY(0); }
				`
			})
			this.animator.init()
		},
		beforeUnmount() {
			// Cleanup before component is destroyed
			if (this.animator) {
				this.animator.destroy()
				this.animator = null
			}
		}
	}
	</script>
	*/
}

/**
 * Example 6.3: Handling route changes in SPAs
 *
 * Refresh animator when navigating between routes
 */
const example6_3_SPA = () => {
	// Create animator once
	const animator = new ScrollAnimator()
	animator.init()

	// Listen for route changes (example using a router)
	window.addEventListener('popstate', () => {
		// Refresh animator after route change
		setTimeout(() => {
			animator.refresh()
		}, 100) // Small delay to ensure DOM is updated
	})

	// Or with a router library:
	/*
	// React Router example:
	import { useLocation } from 'react-router-dom'

	useEffect(() => {
		animator.refresh()
	}, [location.pathname])

	// Vue Router example:
	watch(() => route.path, () => {
		animator.refresh()
	})
	*/
}

/**
 * Example 6.4: Manual init() for SPA scenarios (NEW)
 *
 * Demonstrates when and why to use manual init() in Single Page Applications.
 * Manual initialization gives you explicit control over timing, which is useful
 * when components mount/unmount dynamically.
 */
const example6_4_SPA_Manual = () => {
	// React example with manual init()
	/*
	import { useEffect, useRef } from 'react'
	import ScrollAnimator from './scroll-animator.js'

	function ProductPage() {
		const animatorRef = useRef(null)

		useEffect(() => {
			// Manual init() for immediate control on component mount
			animatorRef.current = new ScrollAnimator({
				mainClassName: 'product-card',
				debug: false
			})

			// Initialize immediately - don't wait for window.load
			// This is important because in SPAs, window.load has already fired
			animatorRef.current.init()

			// Cleanup on component unmount
			return () => {
				if (animatorRef.current) {
					animatorRef.current.destroy()
					animatorRef.current = null
				}
			}
		}, []) // Run once on mount

		return (
			<div>
				<div className="product-card">Product 1</div>
				<div className="product-card">Product 2</div>
				<div className="product-card">Product 3</div>
			</div>
		)
	}
	*/

	// Vue example with manual init()
	/*
	<script setup>
	import { onMounted, onBeforeUnmount, ref } from 'vue'
	import ScrollAnimator from './scroll-animator.js'

	const animator = ref(null)

	onMounted(() => {
		// Manual init() for immediate control
		animator.value = new ScrollAnimator({
			mainClassName: 'product-card'
		})

		// Initialize immediately - critical for SPAs
		animator.value.init()
	})

	onBeforeUnmount(() => {
		// Cleanup before component unmounts
		if (animator.value) {
			animator.value.destroy()
			animator.value = null
		}
	})
	</script>
	*/

	// Key takeaway: In SPAs, use manual init() because:
	// 1. window.load has already fired (automatic init won't work)
	// 2. You need immediate initialization when component mounts
	// 3. You need explicit cleanup when component unmounts
	// 4. You have full control over the animator lifecycle
}

// ============================================================================
// 7. ADVANCED CONFIGURATION EXAMPLES
// ============================================================================

/**
 * Example 7.1: Custom speed and delay settings
 *
 * Fine-tune animation timing for different effects
 */
const example7_1 = () => {
	const animator = new ScrollAnimator({
		// Animation speed range (in milliseconds)
		maxSpeed: 1500, // Slower animations
		minSpeed: 800,

		// Stagger delay range (in milliseconds)
		delayMax: 200, // More delay between elements
		delayMin: 100,

		// Delay stack tweak (affects stagger calculation)
		delayStackTweak: 0.7, // Higher = more aggressive stagger

		// Scroll speed thresholds (in pixels/second)
		maxScrollSpeed: 2000, // Faster scroll = shorter animations
		minScrollSpeed: 600
	})
	animator.init()
}

/**
 * Example 7.2: Custom IntersectionObserver settings
 *
 * Control when animations trigger relative to viewport
 */
const example7_2 = () => {
	const animator = new ScrollAnimator({
		// Trigger animation 100px before element enters viewport
		observerRootMargin: '0px 0px 100px 0px',

		// Trigger when 25% of element is visible
		observerThreshold: 0.25
	})
	animator.init()
}

/**
 * Example 7.3: Debug mode usage
 *
 * Enable debug mode to see detailed console logs and debug UI
 */
const example7_3 = () => {
	const animator = new ScrollAnimator({
		debug: true // Enables console logs and debug window
	})
	animator.init()

	// You'll see:
	// - Console logs for initialization, element observation, etc.
	// - Debug window showing scroll speed and animation timing
	// - Performance timing information
}

/**
 * Example 7.4: LCP optimization
 *
 * Improve Largest Contentful Paint by removing animations from above-fold content
 */
const example7_4 = () => {
	const animator = new ScrollAnimator({
		optimizeLCP: true // Removes animations from elements above viewport
	})
	animator.init()

	// Elements above the fold will have animations removed immediately
	// This improves LCP score for better Core Web Vitals
}

/**
 * Example 7.5: autoDetectTransform option
 *
 * Control automatic translateYvalue adjustment for custom CSS
 */
const example7_5 = () => {
	// Example 1: Auto-adjustment enabled (default)
	const animator1 = new ScrollAnimator({
		autoDetectTransform: true, // Default
		customStyles: '.fade { opacity: 0; transition: opacity 0.6s; }'
		// translateYvalue will be auto-set to 0 (no transform in CSS)
	})
	animator1.init()

	// Example 2: Auto-adjustment disabled
	const animator2 = new ScrollAnimator({
		autoDetectTransform: false,
		customStyles: '.fade { opacity: 0; transition: opacity 0.6s; }'
		// translateYvalue remains at default (100)
	})
	animator2.init()

	// Example 3: Explicit override (always respected)
	const animator3 = new ScrollAnimator({
		autoDetectTransform: true,
		translateYvalue: 150, // Explicit value always takes precedence
		customStyles: '.fade { opacity: 0; transition: opacity 0.6s; }'
		// translateYvalue will be 150 (user value preserved)
	})
	animator3.init()
}

// ============================================================================
// 8. GETTER METHODS EXAMPLES
// ============================================================================

/**
 * Example 8.1: Using isInitialized getter
 *
 * Check if animator has been initialized
 */
const example8_1 = () => {
	const animator = new ScrollAnimator()

	console.log(animator.isInitialized) // false

	animator.init()

	console.log(animator.isInitialized) // true

	animator.destroy()

	console.log(animator.isInitialized) // false
}

/**
 * Example 8.2: Using isPaused getter
 *
 * Check if animator is currently paused
 */
const example8_2 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	console.log(animator.isPaused) // false

	animator.pause()

	console.log(animator.isPaused) // true

	animator.resume()

	console.log(animator.isPaused) // false
}

/**
 * Example 8.3: Using currentSpeed getter
 *
 * Get the current animation speed (useful for debugging)
 */
const example8_3 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Scroll the page to trigger speed calculation
	window.addEventListener('scroll', () => {
		console.log('Current animation speed:', animator.currentSpeed, 'ms')
	})
}

/**
 * Example 8.4: Using observedElements getter
 *
 * Get array of currently observed elements
 */
const example8_4 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	console.log('Number of observed elements:', animator.observedElements.length)
	console.log('Observed elements:', animator.observedElements)

	// Add more elements
	const newElement = document.createElement('div')
	newElement.className = 'animate-on-scroll'
	document.body.appendChild(newElement)
	animator.addElements([newElement])

	console.log('Updated count:', animator.observedElements.length)
}

/**
 * Example 8.5: Conditional logic based on getters
 *
 * Use getters to make decisions in your application
 */
const example8_5 = () => {
	const animator = new ScrollAnimator()
	animator.init()

	// Example: Only refresh if initialized
	const refreshIfNeeded = () => {
		if (animator.isInitialized && !animator.isPaused) {
			animator.refresh()
			console.log('Animator refreshed')
		} else {
			console.log('Animator not ready for refresh')
		}
	}

	// Example: Show animation count in UI
	const updateUI = () => {
		const count = animator.observedElements.length
		document.querySelector('.animation-count').textContent = `${count} animations active`
	}

	// Example: Adjust UI based on animation speed
	const adjustUISpeed = () => {
		const speed = animator.currentSpeed
		if (speed > 1000) {
			console.log('Slow animations - user scrolling slowly')
		} else {
			console.log('Fast animations - user scrolling quickly')
		}
	}
}

// ============================================================================
// COMPLETE REAL-WORLD EXAMPLE
// ============================================================================

/**
 * Complete Example: Blog post page with multiple animation types
 *
 * This example demonstrates a real-world scenario with:
 * - Multiple instances for different sections
 * - Custom CSS for each animation type
 * - Proper lifecycle management
 * - Dynamic content loading
 * - SPA-style cleanup
 */
const completeExample = () => {
	// HTML structure:
	/*
	<header class="hero fade-in">
		<h1>Blog Post Title</h1>
	</header>

	<article class="content">
		<p class="slide-up">Paragraph 1</p>
		<p class="slide-up">Paragraph 2</p>
		<img class="zoom-in" src="image.jpg" alt="Image">
	</article>

	<aside class="sidebar">
		<div class="card slide-left">Related Post 1</div>
		<div class="card slide-left">Related Post 2</div>
	</aside>

	<section class="comments">
		<div class="comment fade-in">Comment 1</div>
		<div class="comment fade-in">Comment 2</div>
	</section>
	*/

	// Store all animators for cleanup
	const animators = []

	// 1. Hero section - Simple fade-in
	const heroAnimator = new ScrollAnimator({
		mainClassName: 'fade-in',
		customStyles: `
			.fade-in {
				opacity: 0;
				transition: opacity 1.2s ease-out;
			}
			.fade-in.aos-visible {
				opacity: 1;
			}
		`
	})
	heroAnimator.init()
	animators.push(heroAnimator)

	// 2. Content section - Slide up
	const contentAnimator = new ScrollAnimator({
		mainClassName: 'slide-up',
		maxSpeed: 800,
		minSpeed: 600,
		customStyles: ({ mainClassName, maxSpeed }) => `
			.${mainClassName} {
				opacity: 0;
				transform: translateY(40px);
				transition: all ${maxSpeed}ms ease-out;
			}
			.${mainClassName}.aos-visible {
				opacity: 1;
				transform: translateY(0);
			}
		`
	})
	contentAnimator.init()
	animators.push(contentAnimator)

	// 3. Images - Zoom in
	const imageAnimator = new ScrollAnimator({
		mainClassName: 'zoom-in',
		customStyles: `
			.zoom-in {
				opacity: 0;
				transform: scale(0.9);
				transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
			}
			.zoom-in.aos-visible {
				opacity: 1;
				transform: scale(1);
			}
		`
	})
	imageAnimator.init()
	animators.push(imageAnimator)

	// 4. Sidebar - Slide from left
	const sidebarAnimator = new ScrollAnimator({
		mainClassName: 'slide-left',
		customStyles: `
			.slide-left {
				opacity: 0;
				transform: translateX(-50px);
				transition: all 0.7s ease-out;
			}
			.slide-left.aos-visible {
				opacity: 1;
				transform: translateX(0);
			}
		`
	})
	sidebarAnimator.init()
	animators.push(sidebarAnimator)

	// 5. Load more comments dynamically
	const loadMoreButton = document.querySelector('.load-more-comments')
	if (loadMoreButton) {
		loadMoreButton.addEventListener('click', async () => {
			// Fetch more comments
			const response = await fetch('/api/comments')
			const html = await response.text()

			// Add to DOM
			const commentsSection = document.querySelector('.comments')
			commentsSection.insertAdjacentHTML('beforeend', html)

			// Refresh the fade-in animator to observe new comments
			heroAnimator.refresh()
		})
	}

	// 6. Cleanup on page unload (SPA navigation)
	window.addEventListener('beforeunload', () => {
		animators.forEach(animator => animator.destroy())
		animators.length = 0
	})

	// 7. Pause animations when modal is open
	const modal = document.querySelector('.modal')
	if (modal) {
		modal.addEventListener('open', () => {
			animators.forEach(animator => animator.pause())
		})

		modal.addEventListener('close', () => {
			animators.forEach(animator => animator.resume())
		})
	}

	// 8. Debug mode in development
	if (process.env.NODE_ENV === 'development') {
		animators.forEach(animator => {
			console.log('Animator initialized:', {
				isInitialized: animator.isInitialized,
				isPaused: animator.isPaused,
				observedElements: animator.observedElements.length
			})
		})
	}
}

// ============================================================================
// TROUBLESHOOTING TIPS
// ============================================================================

/**
 * Common Issues and Solutions:
 *
 * 1. Animations not triggering:
 *    - Check that elements have the correct class name (mainClassName)
 *    - Verify init() has been called
 *    - Check browser console for errors
 *    - Ensure elements are in the DOM when init() is called
 *
 * 2. Animations triggering too early/late:
 *    - Adjust observerRootMargin (e.g., '0px 0px 100px 0px')
 *    - Adjust observerThreshold (e.g., 0.25 for 25% visibility)
 *
 * 3. Custom CSS not applying:
 *    - Verify CSS syntax is correct
 *    - Check that class names match between config and CSS
 *    - Use debug mode to see what CSS is injected
 *    - For function-based CSS, check for syntax errors
 *
 * 4. Memory leaks in SPAs:
 *    - Always call destroy() when component unmounts
 *    - Use useEffect cleanup in React
 *    - Use beforeUnmount in Vue
 *
 * 5. Multiple instances interfering:
 *    - Ensure each instance uses unique mainClassName
 *    - Verify CSS selectors don't overlap
 *    - Check that styleElements are separate
 *
 * 6. Viewport detection issues:
 *    - If using custom CSS without translateY, set translateYvalue: 0
 *    - Or use autoDetectTransform: true (default)
 *    - Check console.info messages for auto-adjustment
 *
 * 7. Performance issues:
 *    - Reduce number of observed elements
 *    - Use optimizeLCP: true for above-fold content
 *    - Simplify CSS transitions
 *    - Consider using 'external' CSS for better performance
 */

// Export examples for use in other files
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		example1_1,
		example1_2,
		example1_3,
		example2_1,
		example2_2,
		example2_3,
		example2_4,
		example3_1,
		example3_2,
		example3_3,
		example4_1,
		example4_2,
		example4_3,
		example4_4,
		example4_5,
		example5_1,
		example5_2,
		example6_1_React,
		example6_2_Vue,
		example6_3_SPA,
		example7_1,
		example7_2,
		example7_3,
		example7_4,
		example7_5,
		example8_1,
		example8_2,
		example8_3,
		example8_4,
		example8_5,
		completeExample
	}
}


