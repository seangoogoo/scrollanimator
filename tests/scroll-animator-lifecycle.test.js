/**
 * Integration Tests for ScrollAnimator Lifecycle Methods
 *
 * Tests the complete lifecycle of the ScrollAnimator class:
 * - Constructor initialization
 * - init() method
 * - destroy() method
 * - Complete lifecycle flows
 *
 * Note: These tests require a browser environment with DOM support.
 * Run in browser: Open scroll-animator-lifecycle-test.html
 */

// Import ScrollAnimator (assumes browser environment)
if (typeof ScrollAnimator === 'undefined') {
	console.error('ScrollAnimator not found. Make sure scroll-animator.js is loaded first.')
}

// Simple test framework (same as utility tests)
const testResults = {
	passed: 0,
	failed: 0,
	total: 0,
	failures: []
}

const describe = (suiteName, fn) => {
	console.log(`\n${'='.repeat(60)}`)
	console.log(`📦 ${suiteName}`)
	console.log('='.repeat(60))
	fn()
}

const test = (testName, fn) => {
	testResults.total++
	try {
		fn()
		testResults.passed++
		console.log(`  ✅ ${testName}`)
	} catch (error) {
		testResults.failed++
		testResults.failures.push({ test: testName, error: error.message })
		console.log(`  ❌ ${testName}`)
		console.log(`     Error: ${error.message}`)
	}
}

const expect = (actual) => {
	const matchers = {
		toBe: (expected) => {
			if (actual !== expected) {
				throw new Error(`Expected ${expected}, but got ${actual}`)
			}
		},
		toBeGreaterThan: (expected) => {
			if (actual <= expected) {
				throw new Error(`Expected ${actual} to be greater than ${expected}`)
			}
		},
		toBeTruthy: () => {
			if (!actual) {
				throw new Error(`Expected truthy value, but got ${actual}`)
			}
		},
		toBeFalsy: () => {
			if (actual) {
				throw new Error(`Expected falsy value, but got ${actual}`)
			}
		},
		toContain: (expected) => {
			if (!actual || !actual.includes(expected)) {
				throw new Error(`Expected to contain ${expected}`)
			}
		},
		toBeInstanceOf: (expectedClass) => {
			if (!(actual instanceof expectedClass)) {
				throw new Error(`Expected instance of ${expectedClass.name}`)
			}
		}
	}

	// Add .not support for negative assertions
	matchers.not = {
		toBe: (expected) => {
			if (actual === expected) {
				throw new Error(`Expected not to be ${expected}`)
			}
		},
		toContain: (expected) => {
			if (actual && actual.includes(expected)) {
				throw new Error(`Expected not to contain ${expected}`)
			}
		},
		toBeInstanceOf: (expectedClass) => {
			if (actual instanceof expectedClass) {
				throw new Error(`Expected not to be instance of ${expectedClass.name}`)
			}
		},
		toBeTruthy: () => {
			if (actual) {
				throw new Error(`Expected falsy value, but got ${actual}`)
			}
		},
		toBeFalsy: () => {
			if (!actual) {
				throw new Error(`Expected truthy value, but got ${actual}`)
			}
		}
	}

	return matchers
}

// ============================================================================
// TEST HELPERS
// ============================================================================

/**
 * Creates test DOM elements for testing
 * @param {string} className - CSS class name for elements (default: 'animate-on-scroll')
 * @returns {HTMLElement} Container element with test elements
 */
const setupTestDOM = (className = 'animate-on-scroll') => {
	const container = document.createElement('div')
	// Use unique ID to prevent conflicts between tests
	container.id = `test-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
	container.innerHTML = `
		<div class="${className}" data-test="1">Element 1</div>
		<div class="${className}" data-test="2">Element 2</div>
		<div class="${className}" data-test="3">Element 3</div>
	`
	document.body.appendChild(container)
	return container
}

/**
 * Removes test DOM elements
 * @param {HTMLElement} container - Container to remove
 */
const teardownTestDOM = (container) => {
	if (container && container.parentNode) {
		container.parentNode.removeChild(container)
	}
}

/**
 * Waits for a condition to be true
 * @param {Function} condition - Function that returns boolean
 * @param {number} timeout - Max wait time in ms
 * @returns {Promise<void>}
 */
const waitFor = (condition, timeout = 1000) => {
	return new Promise((resolve, reject) => {
		const startTime = Date.now()
		const checkCondition = () => {
			if (condition()) {
				resolve()
			} else if (Date.now() - startTime > timeout) {
				reject(new Error('Timeout waiting for condition'))
			} else {
				setTimeout(checkCondition, 10)
			}
		}
		checkCondition()
	})
}

// ============================================================================
// TEST SUITE: ScrollAnimator Constructor
// ============================================================================

describe('ScrollAnimator Constructor', () => {

	test('should create instance with default options', () => {
		const animator = new ScrollAnimator()

		// Verify instance is created
		expect(animator).toBeInstanceOf(ScrollAnimator)

		// Verify default config values
		expect(animator._config.debug).toBe(false)
		expect(animator._config.mainClassName).toBe('animate-on-scroll')
		expect(animator._config.visibleClassName).toBe('aos-visible')
		expect(animator._config.translateYvalue).toBe(100)

		// Cleanup
		animator.destroy()
	})

	test('should accept and merge custom options', () => {
		const customOptions = {
			debug: true,
			mainClassName: 'custom-animate',
			maxSpeed: 1000
		}
		const animator = new ScrollAnimator(customOptions)

		// Verify custom options are applied
		expect(animator._config.debug).toBe(true)
		expect(animator._config.mainClassName).toBe('custom-animate')
		expect(animator._config.maxSpeed).toBe(1000)

		// Verify defaults are still present for non-specified options
		expect(animator._config.visibleClassName).toBe('aos-visible')

		// Cleanup
		animator.destroy()
	})

	test('should initialize all internal properties', () => {
		const animator = new ScrollAnimator()

		// Verify _config object exists
		expect(animator._config).toBeTruthy()

		// Verify _elements object exists
		expect(animator._elements).toBeTruthy()
		expect(Array.isArray(animator._elements.nodeList)).toBe(true)

		// Verify _transition object exists
		expect(animator._transition).toBeTruthy()

		// Verify _scroll object exists
		expect(animator._scroll).toBeTruthy()

		// Verify _scrollListener object exists
		expect(animator._scrollListener).toBeTruthy()

		// Verify _boundHandlers object exists
		expect(animator._boundHandlers).toBeTruthy()

		// Verify state flags
		expect(animator._isInitialized).toBe(false)
		expect(animator._isPaused).toBe(false)

		// Cleanup
		animator.destroy()
	})

	test('should inject styles into document head', () => {
		const animator = new ScrollAnimator()

		// Verify style element was created and added to head
		expect(animator._elements.styleElement).toBeTruthy()
		expect(animator._elements.styleElement.parentNode).toBe(document.head)

		// Verify style content includes animation classes
		expect(animator._elements.styleElement.textContent).toContain('animate-on-scroll')
		expect(animator._elements.styleElement.textContent).toContain('aos-visible')

		// Cleanup
		animator.destroy()
	})

	test('should attach event listeners', () => {
		const animator = new ScrollAnimator()

		// Verify bound handlers were created
		expect(animator._boundHandlers.scroll).toBeTruthy()
		expect(animator._boundHandlers.readyStateChange).toBeTruthy()
		expect(animator._boundHandlers.load).toBeTruthy()

		// Cleanup
		animator.destroy()
	})
})

// ============================================================================
// TEST SUITE: ScrollAnimator.init()
// ============================================================================

describe('ScrollAnimator.init()', () => {
	let container

	test('should query DOM for elements with mainClassName', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()

		// Call init
		animator.init()

		// Verify elements were found
		expect(animator._elements.nodeList.length).toBe(3)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})

	test('should return early with warning if already initialized', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()

		// Initialize once
		animator.init()
		expect(animator._isInitialized).toBe(true)

		// Try to initialize again
		const result = animator.init()

		// Should return this for chaining
		expect(result).toBe(animator)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})

	test('should return early with warning if no elements found', () => {
		// No test DOM elements created
		const animator = new ScrollAnimator()

		// Call init with no elements in DOM
		const result = animator.init()

		// Should return this for chaining
		expect(result).toBe(animator)

		// Should not be initialized
		expect(animator._isInitialized).toBe(false)

		// Cleanup
		animator.destroy()
	})

	test('should create IntersectionObserver', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()

		// Call init
		animator.init()

		// Verify observer was created
		expect(animator._observer).toBeTruthy()
		expect(animator._observer).toBeInstanceOf(IntersectionObserver)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})

	test('should set _isInitialized flag to true', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()

		// Before init
		expect(animator._isInitialized).toBe(false)

		// Call init
		animator.init()

		// After init
		expect(animator._isInitialized).toBe(true)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})

	test('should return this for method chaining', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()

		// Call init and verify return value
		const result = animator.init()
		expect(result).toBe(animator)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})
})

// ============================================================================
// TEST SUITE: ScrollAnimator.destroy()
// ============================================================================

describe('ScrollAnimator.destroy()', () => {
	let container

	test('should disconnect IntersectionObserver', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Verify observer exists
		expect(animator._observer).toBeTruthy()

		// Call destroy
		animator.destroy()

		// Verify observer is null
		expect(animator._observer).toBe(null)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should remove injected style element from DOM', () => {
		const animator = new ScrollAnimator()

		// Verify style element exists in DOM
		const styleElement = animator._elements.styleElement
		expect(styleElement).toBeTruthy()
		expect(styleElement.parentNode).toBe(document.head)

		// Call destroy
		animator.destroy()

		// Verify style element is removed from DOM
		expect(styleElement.parentNode).toBe(null)
		expect(animator._elements.styleElement).toBe(null)
	})

	test('should reset state flags', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Verify initialized
		expect(animator._isInitialized).toBe(true)

		// Call destroy
		animator.destroy()

		// Verify state is reset
		expect(animator._isInitialized).toBe(false)
		expect(animator._isPaused).toBe(false)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should clear elements nodeList array', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Verify elements were found
		expect(animator._elements.nodeList.length).toBeGreaterThan(0)

		// Call destroy
		animator.destroy()

		// Verify nodeList is cleared
		expect(animator._elements.nodeList.length).toBe(0)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should remove animation classes from elements', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Get test elements
		const elements = animator._elements.nodeList

		// Manually add visible class to simulate animation
		elements.forEach(el => {
			el.classList.add(animator._config.visibleClassName)
			el.style.transitionDuration = '500ms'
			el.style.transitionDelay = '100ms'
		})

		// Verify classes and styles are present
		expect(elements[0].classList.contains(animator._config.visibleClassName)).toBe(true)
		expect(elements[0].style.transitionDuration).toBe('500ms')

		// Call destroy
		animator.destroy()

		// Verify classes and styles are removed
		elements.forEach(el => {
			expect(el.classList.contains(animator._config.visibleClassName)).toBe(false)
			expect(el.style.transitionDuration).toBe('')
			expect(el.style.transitionDelay).toBe('')
		})

		// Cleanup
		teardownTestDOM(container)
	})
})

// ============================================================================
// TEST SUITE: ScrollAnimator Lifecycle Flow
// ============================================================================

describe('ScrollAnimator Lifecycle Flow', () => {
	let container

	test('should handle complete lifecycle: constructor → init → destroy', () => {
		container = setupTestDOM()

		// Step 1: Constructor
		const animator = new ScrollAnimator()
		expect(animator).toBeInstanceOf(ScrollAnimator)
		expect(animator._isInitialized).toBe(false)

		// Step 2: Init
		animator.init()
		expect(animator._isInitialized).toBe(true)
		expect(animator._observer).toBeTruthy()
		expect(animator._elements.nodeList.length).toBe(3)

		// Step 3: Destroy
		animator.destroy()
		expect(animator._isInitialized).toBe(false)
		expect(animator._observer).toBe(null)
		expect(animator._elements.nodeList.length).toBe(0)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should handle lifecycle: constructor → init → pause → resume → destroy', () => {
		container = setupTestDOM()

		// Constructor
		const animator = new ScrollAnimator()

		// Init
		animator.init()
		expect(animator._isInitialized).toBe(true)
		expect(animator._isPaused).toBe(false)

		// Pause
		animator.pause()
		expect(animator._isPaused).toBe(true)

		// Resume
		animator.resume()
		expect(animator._isPaused).toBe(false)
		expect(animator._observer).toBeTruthy()

		// Destroy
		animator.destroy()
		expect(animator._isInitialized).toBe(false)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should handle lifecycle: constructor → init → refresh → destroy', () => {
		container = setupTestDOM()

		// Constructor
		const animator = new ScrollAnimator()

		// Init
		animator.init()
		const initialElementCount = animator._elements.nodeList.length
		expect(initialElementCount).toBe(3)

		// Add more elements to DOM
		const newElement = document.createElement('div')
		newElement.className = 'animate-on-scroll'
		newElement.textContent = 'Element 4'
		container.appendChild(newElement)

		// Refresh
		animator.refresh()
		expect(animator._elements.nodeList.length).toBe(4)

		// Destroy
		animator.destroy()
		expect(animator._isInitialized).toBe(false)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should allow creating new instance after destroy', () => {
		container = setupTestDOM()

		// First instance
		const animator1 = new ScrollAnimator()
		animator1.init()
		expect(animator1._isInitialized).toBe(true)

		// Destroy first instance
		animator1.destroy()
		expect(animator1._isInitialized).toBe(false)

		// Create second instance
		const animator2 = new ScrollAnimator()
		animator2.init()
		expect(animator2._isInitialized).toBe(true)
		expect(animator2._elements.nodeList.length).toBe(3)

		// Cleanup
		animator2.destroy()
		teardownTestDOM(container)
	})

	test('should handle method chaining', () => {
		container = setupTestDOM()

		// Test method chaining
		const animator = new ScrollAnimator()
		const result = animator.init().pause().resume()

		// Verify chaining returns the instance
		expect(result).toBe(animator)
		expect(animator._isInitialized).toBe(true)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})

	test('should handle addElements after init', () => {
		container = setupTestDOM()

		// Constructor and init
		const animator = new ScrollAnimator()
		animator.init()
		const initialCount = animator._elements.nodeList.length

		// Create new element
		const newElement = document.createElement('div')
		newElement.className = 'animate-on-scroll'
		newElement.textContent = 'Dynamic Element'
		container.appendChild(newElement)

		// Add element to animator
		animator.addElements(newElement)

		// Verify element was added
		expect(animator._elements.nodeList.length).toBe(initialCount + 1)
		expect(animator._elements.nodeList).toContain(newElement)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})

	test('should handle removeElements after init', () => {
		container = setupTestDOM()

		// Constructor and init
		const animator = new ScrollAnimator()
		animator.init()
		const initialCount = animator._elements.nodeList.length

		// Get first element
		const firstElement = animator._elements.nodeList[0]

		// Remove element from animator
		animator.removeElements(firstElement)

		// Verify element was removed
		expect(animator._elements.nodeList.length).toBe(initialCount - 1)
		expect(animator._elements.nodeList).not.toContain(firstElement)

		// Cleanup
		animator.destroy()
		teardownTestDOM(container)
	})
})

// ============================================================================
// TEST SUITE: Event Listener Cleanup
// ============================================================================

describe('ScrollAnimator Event Listener Cleanup', () => {
	let container

	test('should remove scroll event listener on destroy', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Verify scroll listener is attached (bound handler exists)
		expect(animator._boundHandlers.scroll).toBeTruthy()

		// Store initial scroll position for comparison
		const initialScrollSpeed = animator._scroll.currentSpeed

		// Call destroy
		animator.destroy()

		// Verify bound handler reference is cleared
		expect(animator._boundHandlers.scroll).toBeFalsy()

		// Trigger a scroll event manually
		window.scrollTo(0, 100)
		window.dispatchEvent(new Event('scroll'))

		// Wait a bit for any potential handler execution
		setTimeout(() => {
			// Verify scroll speed wasn't updated (handler didn't execute)
			expect(animator._scroll.currentSpeed).toBe(initialScrollSpeed)
		}, 50)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should remove readystatechange event listener on destroy', () => {
		const animator = new ScrollAnimator()

		// Verify readystatechange listener is attached (bound handler exists)
		expect(animator._boundHandlers.readyStateChange).toBeTruthy()

		// Call destroy
		animator.destroy()

		// Verify bound handler reference is cleared
		expect(animator._boundHandlers.readyStateChange).toBeFalsy()

		// Verify _boundHandlers object is empty or cleared
		expect(Object.keys(animator._boundHandlers).length).toBe(0)
	})

	test('should remove load event listener on destroy', () => {
		const animator = new ScrollAnimator()

		// Verify load listener is attached (bound handler exists)
		expect(animator._boundHandlers.load).toBeTruthy()

		// Call destroy
		animator.destroy()

		// Verify bound handler reference is cleared
		expect(animator._boundHandlers.load).toBeFalsy()

		// Verify _boundHandlers object is empty or cleared
		expect(Object.keys(animator._boundHandlers).length).toBe(0)
	})

	test('should clear all bound handlers on destroy', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Verify all bound handlers exist before destroy
		expect(animator._boundHandlers.scroll).toBeTruthy()
		expect(animator._boundHandlers.readyStateChange).toBeTruthy()
		expect(animator._boundHandlers.load).toBeTruthy()
		expect(Object.keys(animator._boundHandlers).length).toBe(3)

		// Call destroy
		animator.destroy()

		// Verify all bound handlers are cleared
		expect(animator._boundHandlers.scroll).toBeFalsy()
		expect(animator._boundHandlers.readyStateChange).toBeFalsy()
		expect(animator._boundHandlers.load).toBeFalsy()
		expect(Object.keys(animator._boundHandlers).length).toBe(0)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should not respond to scroll events after destroy', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// Store initial state
		const initialIsInitialized = animator._isInitialized

		// Destroy the animator
		animator.destroy()

		// Verify destroyed state
		expect(animator._isInitialized).toBe(false)

		// Trigger scroll event
		window.scrollTo(0, 200)
		window.dispatchEvent(new Event('scroll'))

		// Wait for potential handler execution
		setTimeout(() => {
			// Verify state hasn't changed (handler didn't execute)
			expect(animator._isInitialized).toBe(false)

			// Verify scroll measurement wasn't updated
			expect(animator._scroll.currentSpeed).toBe(0)
		}, 50)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should not respond to readystatechange events after destroy', () => {
		const animator = new ScrollAnimator()

		// Store initial nodeList length
		const initialNodeListLength = animator._elements.nodeList.length

		// Destroy the animator
		animator.destroy()

		// Create test elements in DOM
		container = setupTestDOM()

		// Manually trigger readystatechange event
		document.dispatchEvent(new Event('readystatechange'))

		// Wait for potential handler execution
		setTimeout(() => {
			// Verify nodeList wasn't updated (handler didn't execute)
			expect(animator._elements.nodeList.length).toBe(0)
			expect(animator._elements.nodeList.length).toBe(initialNodeListLength)
		}, 50)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should not auto-initialize on load event after destroy', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()

		// Destroy before load event
		animator.destroy()

		// Verify not initialized
		expect(animator._isInitialized).toBe(false)

		// Manually trigger load event
		window.dispatchEvent(new Event('load'))

		// Wait for potential handler execution
		setTimeout(() => {
			// Verify still not initialized (handler didn't execute)
			expect(animator._isInitialized).toBe(false)
			expect(animator._observer).toBe(null)
		}, 50)

		// Cleanup
		teardownTestDOM(container)
	})

	test('should handle multiple destroy calls without errors', () => {
		container = setupTestDOM()
		const animator = new ScrollAnimator()
		animator.init()

		// First destroy
		animator.destroy()
		expect(Object.keys(animator._boundHandlers).length).toBe(0)

		// Second destroy (should not throw error)
		animator.destroy()
		expect(Object.keys(animator._boundHandlers).length).toBe(0)

		// Third destroy (should not throw error)
		animator.destroy()
		expect(Object.keys(animator._boundHandlers).length).toBe(0)

		// Cleanup
		teardownTestDOM(container)
	})
})

// ============================================================================
// TEST SUITE: Multiple Instances
// ============================================================================

describe('ScrollAnimator Multiple Instances', () => {
	let container1, container2, container3

	test('should support two instances with different configurations', () => {
		// Create containers with different class names
		container1 = setupTestDOM('animate-1')
		container2 = setupTestDOM('animate-2')

		// Create two instances with different configurations
		const animator1 = new ScrollAnimator({
			debug: true,
			mainClassName: 'animate-1',
			maxSpeed: 1000
		})

		const animator2 = new ScrollAnimator({
			debug: false,
			mainClassName: 'animate-2',
			maxSpeed: 2000
		})

		// Initialize both instances
		animator1.init()
		animator2.init()

		// Verify each instance maintains its own configuration
		expect(animator1._config.debug).toBe(true)
		expect(animator2._config.debug).toBe(false)
		expect(animator1._config.mainClassName).toBe('animate-1')
		expect(animator2._config.mainClassName).toBe('animate-2')
		expect(animator1._config.maxSpeed).toBe(1000)
		expect(animator2._config.maxSpeed).toBe(2000)

		// Verify each instance observes only its own elements
		expect(animator1._elements.nodeList.length).toBe(3)
		expect(animator2._elements.nodeList.length).toBe(3)

		// Verify elements are different
		const elements1 = animator1._elements.nodeList
		const elements2 = animator2._elements.nodeList
		expect(elements1[0]).not.toBe(elements2[0])

		// Verify both instances are initialized
		expect(animator1._isInitialized).toBe(true)
		expect(animator2._isInitialized).toBe(true)

		// Destroy both instances independently
		animator1.destroy()
		expect(animator1._isInitialized).toBe(false)
		expect(animator2._isInitialized).toBe(true) // Still initialized

		animator2.destroy()
		expect(animator2._isInitialized).toBe(false)

		// Cleanup
		teardownTestDOM(container1)
		teardownTestDOM(container2)
	})

	test('should handle instances with overlapping elements', () => {
		// Create container with elements that both instances will observe
		container1 = setupTestDOM('shared-animate')

		// Create two instances observing the same elements
		const animator1 = new ScrollAnimator({
			mainClassName: 'shared-animate'
		})

		const animator2 = new ScrollAnimator({
			mainClassName: 'shared-animate'
		})

		// Initialize both instances
		animator1.init()
		animator2.init()

		// Verify both observers are created and active
		expect(animator1._observer).toBeTruthy()
		expect(animator2._observer).toBeTruthy()
		expect(animator1._observer).not.toBe(animator2._observer)

		// Verify both instances found the same elements
		expect(animator1._elements.nodeList.length).toBe(3)
		expect(animator2._elements.nodeList.length).toBe(3)

		// Destroy one instance
		animator1.destroy()
		expect(animator1._isInitialized).toBe(false)
		expect(animator1._observer).toBe(null)

		// Verify the other instance continues working
		expect(animator2._isInitialized).toBe(true)
		expect(animator2._observer).toBeTruthy()
		expect(animator2._elements.nodeList.length).toBe(3)

		// Cleanup
		animator2.destroy()
		teardownTestDOM(container1)
	})

	test('should handle sequential instance creation and destruction', () => {
		// Create and destroy instance A
		container1 = setupTestDOM('sequential-test')
		const animatorA = new ScrollAnimator({
			mainClassName: 'sequential-test',
			debug: true
		})
		animatorA.init()
		expect(animatorA._isInitialized).toBe(true)
		expect(animatorA._elements.nodeList.length).toBe(3)

		animatorA.destroy()
		expect(animatorA._isInitialized).toBe(false)

		// Create instance B with same configuration
		const animatorB = new ScrollAnimator({
			mainClassName: 'sequential-test',
			debug: true
		})

		// Verify instance B works correctly (no leftover state from A)
		animatorB.init()
		expect(animatorB._isInitialized).toBe(true)
		expect(animatorB._elements.nodeList.length).toBe(3)
		expect(animatorB._observer).toBeTruthy()

		// Verify instance B is independent
		expect(animatorB).not.toBe(animatorA)
		expect(animatorB._observer).not.toBe(animatorA._observer)

		// Cleanup
		animatorB.destroy()
		teardownTestDOM(container1)
	})

	test('should handle simultaneous operations on multiple instances', () => {
		// Create three instances with different element sets
		container1 = setupTestDOM('instance-1')
		container2 = setupTestDOM('instance-2')
		container3 = setupTestDOM('instance-3')

		const animator1 = new ScrollAnimator({ mainClassName: 'instance-1' })
		const animator2 = new ScrollAnimator({ mainClassName: 'instance-2' })
		const animator3 = new ScrollAnimator({ mainClassName: 'instance-3' })

		// Initialize all three
		animator1.init()
		animator2.init()
		animator3.init()

		// Verify all initialized
		expect(animator1._isInitialized).toBe(true)
		expect(animator2._isInitialized).toBe(true)
		expect(animator3._isInitialized).toBe(true)

		// Perform different operations on each instance
		animator1.pause()
		animator2.refresh()
		// animator3 left running (no operation)

		// Verify each instance maintains its own state
		expect(animator1._isPaused).toBe(true)
		expect(animator2._isPaused).toBe(false)
		expect(animator3._isPaused).toBe(false)

		expect(animator1._isInitialized).toBe(true)
		expect(animator2._isInitialized).toBe(true)
		expect(animator3._isInitialized).toBe(true)

		// Verify operations on one instance don't affect others
		expect(animator1._observer).toBe(null) // Paused (observer disconnected)
		expect(animator2._observer).toBeTruthy() // Refreshed (observer active)
		expect(animator3._observer).toBeTruthy() // Running (observer active)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
		teardownTestDOM(container1)
		teardownTestDOM(container2)
		teardownTestDOM(container3)
	})

	test('should create separate style elements for each instance', () => {
		// Create three instances
		const animator1 = new ScrollAnimator()
		const animator2 = new ScrollAnimator()
		const animator3 = new ScrollAnimator()

		// Get style elements
		const style1 = animator1._elements.styleElement
		const style2 = animator2._elements.styleElement
		const style3 = animator3._elements.styleElement

		// Verify each instance has its own style element
		expect(style1).toBeTruthy()
		expect(style2).toBeTruthy()
		expect(style3).toBeTruthy()

		// Verify they are different elements
		expect(style1).not.toBe(style2)
		expect(style2).not.toBe(style3)
		expect(style1).not.toBe(style3)

		// Verify all are in document head
		expect(document.head.contains(style1)).toBe(true)
		expect(document.head.contains(style2)).toBe(true)
		expect(document.head.contains(style3)).toBe(true)

		// Destroy instances one by one and verify cleanup
		animator1.destroy()
		expect(document.head.contains(style1)).toBe(false) // Removed
		expect(document.head.contains(style2)).toBe(true)  // Still there
		expect(document.head.contains(style3)).toBe(true)  // Still there

		animator2.destroy()
		expect(document.head.contains(style2)).toBe(false) // Removed
		expect(document.head.contains(style3)).toBe(true)  // Still there

		animator3.destroy()
		expect(document.head.contains(style3)).toBe(false) // Removed
	})

	test('should maintain separate event listeners for each instance', () => {
		container1 = setupTestDOM('event-test-1')
		container2 = setupTestDOM('event-test-2')

		// Create two instances
		const animator1 = new ScrollAnimator({ mainClassName: 'event-test-1' })
		const animator2 = new ScrollAnimator({ mainClassName: 'event-test-2' })

		animator1.init()
		animator2.init()

		// Verify each instance has its own bound handlers
		expect(animator1._boundHandlers.scroll).toBeTruthy()
		expect(animator2._boundHandlers.scroll).toBeTruthy()
		expect(animator1._boundHandlers.scroll).not.toBe(animator2._boundHandlers.scroll)

		expect(animator1._boundHandlers.readyStateChange).toBeTruthy()
		expect(animator2._boundHandlers.readyStateChange).toBeTruthy()
		expect(animator1._boundHandlers.readyStateChange).not.toBe(animator2._boundHandlers.readyStateChange)

		expect(animator1._boundHandlers.load).toBeTruthy()
		expect(animator2._boundHandlers.load).toBeTruthy()
		expect(animator1._boundHandlers.load).not.toBe(animator2._boundHandlers.load)

		// Destroy one instance
		animator1.destroy()
		expect(Object.keys(animator1._boundHandlers).length).toBe(0)

		// Verify other instance's event listeners still exist
		expect(animator2._boundHandlers.scroll).toBeTruthy()
		expect(animator2._boundHandlers.readyStateChange).toBeTruthy()
		expect(animator2._boundHandlers.load).toBeTruthy()
		expect(Object.keys(animator2._boundHandlers).length).toBe(3)

		// Trigger scroll event and verify only animator2 responds
		const initialSpeed2 = animator2._scroll.currentSpeed
		window.scrollTo(0, 100)
		window.dispatchEvent(new Event('scroll'))

		// Wait for potential handler execution
		setTimeout(() => {
			// animator1 should not respond (destroyed)
			expect(animator1._isInitialized).toBe(false)

			// animator2 should still be active
			expect(animator2._isInitialized).toBe(true)
		}, 50)

		// Cleanup
		animator2.destroy()
		teardownTestDOM(container1)
		teardownTestDOM(container2)
	})

	test('should handle many instances simultaneously', () => {
		const instances = []
		const containers = []
		const instanceCount = 5

		// Create 5 instances
		for (let i = 0; i < instanceCount; i++) {
			const className = `multi-instance-${i}`
			const container = setupTestDOM(className)
			containers.push(container)

			const animator = new ScrollAnimator({
				mainClassName: className,
				maxSpeed: 1000 + (i * 100)
			})
			animator.init()
			instances.push(animator)
		}

		// Verify all instances are initialized
		instances.forEach((animator, index) => {
			expect(animator._isInitialized).toBe(true)
			expect(animator._elements.nodeList.length).toBe(3)
			expect(animator._config.maxSpeed).toBe(1000 + (index * 100))
		})

		// Verify all instances have unique observers
		for (let i = 0; i < instanceCount; i++) {
			for (let j = i + 1; j < instanceCount; j++) {
				expect(instances[i]._observer).not.toBe(instances[j]._observer)
			}
		}

		// Destroy instances in reverse order
		for (let i = instanceCount - 1; i >= 0; i--) {
			instances[i].destroy()
			expect(instances[i]._isInitialized).toBe(false)

			// Verify other instances still active
			for (let j = 0; j < i; j++) {
				expect(instances[j]._isInitialized).toBe(true)
			}
		}

		// Cleanup
		containers.forEach(container => teardownTestDOM(container))
	})

	test('should maintain independent state across instances', () => {
		container1 = setupTestDOM('state-test-1')
		container2 = setupTestDOM('state-test-2')

		const animator1 = new ScrollAnimator({ mainClassName: 'state-test-1' })
		const animator2 = new ScrollAnimator({ mainClassName: 'state-test-2' })

		animator1.init()
		animator2.init()

		// Modify state of animator1
		animator1.pause()
		animator1._scroll.currentSpeed = 500
		animator1._transition.currentSpeed = 300

		// Verify animator2 state is unaffected
		expect(animator2._isPaused).toBe(false)
		expect(animator2._scroll.currentSpeed).toBe(0)
		expect(animator2._transition.currentSpeed).toBe(animator2._config.maxSpeed)

		// Resume animator1 and pause animator2
		animator1.resume()
		animator2.pause()

		// Verify states are independent
		expect(animator1._isPaused).toBe(false)
		expect(animator2._isPaused).toBe(true)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		teardownTestDOM(container1)
		teardownTestDOM(container2)
	})
})

// ============================================================================
// TEST SUITE 7: customStyles Validation
// ============================================================================

describe('ScrollAnimator customStyles Validation', () => {
	let container
	let originalWarn

	// Helper to capture console.warn messages
	const captureWarnings = () => {
		const warnings = []
		originalWarn = console.warn
		console.warn = (...args) => {
			warnings.push(args.join(' '))
		}
		return warnings
	}

	// Helper to restore console.warn
	const restoreWarnings = () => {
		if (originalWarn) {
			console.warn = originalWarn
		}
	}

	test('should accept null value without warnings', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: null
		})

		expect(animator._config.customStyles).toBe(null)
		expect(warnings.length).toBe(0)

		restoreWarnings()
		animator.destroy()
	})

	test('should accept non-empty string value without warnings', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: '.my-class { opacity: 0; }'
		})

		expect(animator._config.customStyles).toBe('.my-class { opacity: 0; }')
		expect(warnings.length).toBe(0)

		restoreWarnings()
		animator.destroy()
	})

	test('should accept function value without warnings', () => {
		const warnings = captureWarnings()

		const customStylesFn = () => '.my-class { opacity: 0; }'
		const animator = new ScrollAnimator({
			customStyles: customStylesFn
		})

		expect(animator._config.customStyles).toBe(customStylesFn)
		expect(warnings.length).toBe(0)

		restoreWarnings()
		animator.destroy()
	})

	test('should accept "template" keyword without warnings', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: 'template'
		})

		expect(animator._config.customStyles).toBe('template')
		expect(warnings.length).toBe(0)

		restoreWarnings()
		animator.destroy()
	})

	test('should accept "external" keyword without warnings', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: 'external'
		})

		expect(animator._config.customStyles).toBe('external')
		expect(warnings.length).toBe(0)

		restoreWarnings()
		animator.destroy()
	})

	test('should reject number value with warning and set to null', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: 123
		})

		expect(animator._config.customStyles).toBe(null)
		expect(warnings.length).toBeGreaterThan(0)
		expect(warnings[0]).toContain('customStyles must be a string, function, or null')

		restoreWarnings()
		animator.destroy()
	})

	test('should reject object value with warning and set to null', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: { opacity: 0 }
		})

		expect(animator._config.customStyles).toBe(null)
		expect(warnings.length).toBeGreaterThan(0)
		expect(warnings[0]).toContain('customStyles must be a string, function, or null')

		restoreWarnings()
		animator.destroy()
	})

	test('should reject array value with warning and set to null', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: ['.class1', '.class2']
		})

		expect(animator._config.customStyles).toBe(null)
		expect(warnings.length).toBeGreaterThan(0)
		expect(warnings[0]).toContain('customStyles must be a string, function, or null')

		restoreWarnings()
		animator.destroy()
	})

	test('should reject empty string with warning and set to null', () => {
		const warnings = captureWarnings()

		const animator = new ScrollAnimator({
			customStyles: ''
		})

		expect(animator._config.customStyles).toBe(null)
		expect(warnings.length).toBeGreaterThan(0)
		expect(warnings[0]).toContain('customStyles is empty')

		restoreWarnings()
		animator.destroy()
	})
})

// ============================================================================
// TEST SUITE 8: Function-Based customStyles
// ============================================================================

describe('ScrollAnimator Function-Based customStyles', () => {
	test('should call function with correct config parameters', () => {
		let receivedConfig = null

		const customStylesFn = (config) => {
			receivedConfig = config
			return '.test { opacity: 0; }'
		}

		const animator = new ScrollAnimator({
			mainClassName: 'test-class',
			visibleClassName: 'test-visible',
			translateYvalue: 50,
			maxSpeed: 1000,
			minSpeed: 500,
			customStyles: customStylesFn
		})

		// Verify function was called
		expect(receivedConfig).toBeTruthy()

		// Verify all required parameters are present
		expect(receivedConfig.mainClassName).toBe('test-class')
		expect(receivedConfig.visibleClassName).toBe('test-visible')
		expect(receivedConfig.translateYvalue).toBe(50)
		expect(receivedConfig.maxSpeed).toBe(1000)
		expect(receivedConfig.minSpeed).toBe(500)

		// Cleanup
		animator.destroy()
	})

	test('should inject function return value as CSS', () => {
		const customCSS = `
			.my-custom-class {
				opacity: 0;
				transform: scale(0.8);
				transition: all 0.6s ease;
			}
			.my-custom-class.visible {
				opacity: 1;
				transform: scale(1);
			}
		`

		const customStylesFn = () => customCSS

		const animator = new ScrollAnimator({
			mainClassName: 'my-custom-class',
			visibleClassName: 'visible',
			customStyles: customStylesFn
		})

		// Verify style element exists
		expect(animator._elements.styleElement).toBeTruthy()

		// Verify CSS content matches function return value
		expect(animator._elements.styleElement.textContent).toBe(customCSS)

		// Verify style element is in document head
		expect(document.head.contains(animator._elements.styleElement)).toBe(true)

		// Cleanup
		animator.destroy()
	})

	test('should work with template literals using config values', () => {
		const customStylesFn = ({ mainClassName, visibleClassName, translateYvalue }) => `
			.${mainClassName} {
				opacity: 0;
				transform: translateY(${translateYvalue}px);
				transition: all 0.5s ease;
			}
			.${mainClassName}.${visibleClassName} {
				opacity: 1;
				transform: translateY(0);
			}
		`

		const animator = new ScrollAnimator({
			mainClassName: 'slide-up',
			visibleClassName: 'is-visible',
			translateYvalue: 75,
			customStyles: customStylesFn
		})

		const css = animator._elements.styleElement.textContent

		// Verify template literals were interpolated correctly
		expect(css).toContain('.slide-up')
		expect(css).toContain('.slide-up.is-visible')
		expect(css).toContain('translateY(75px)')
		expect(css).toContain('translateY(0)')

		// Cleanup
		animator.destroy()
	})

	test('should create different style elements for multiple instances with different functions', () => {
		const fadeStylesFn = ({ mainClassName, visibleClassName }) => `
			.${mainClassName} {
				opacity: 0;
				transition: opacity 0.5s ease;
			}
			.${mainClassName}.${visibleClassName} {
				opacity: 1;
			}
		`

		const zoomStylesFn = ({ mainClassName, visibleClassName }) => `
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

		const slideStylesFn = ({ mainClassName, visibleClassName, translateYvalue }) => `
			.${mainClassName} {
				opacity: 0;
				transform: translateY(${translateYvalue}px);
				transition: all 0.7s ease;
			}
			.${mainClassName}.${visibleClassName} {
				opacity: 1;
				transform: translateY(0);
			}
		`

		const animator1 = new ScrollAnimator({
			mainClassName: 'fade-in',
			customStyles: fadeStylesFn
		})

		const animator2 = new ScrollAnimator({
			mainClassName: 'zoom-in',
			customStyles: zoomStylesFn
		})

		const animator3 = new ScrollAnimator({
			mainClassName: 'slide-up',
			translateYvalue: 100,
			customStyles: slideStylesFn
		})

		// Verify each has its own style element
		expect(animator1._elements.styleElement).toBeTruthy()
		expect(animator2._elements.styleElement).toBeTruthy()
		expect(animator3._elements.styleElement).toBeTruthy()

		// Verify they are different elements
		expect(animator1._elements.styleElement).not.toBe(animator2._elements.styleElement)
		expect(animator2._elements.styleElement).not.toBe(animator3._elements.styleElement)
		expect(animator1._elements.styleElement).not.toBe(animator3._elements.styleElement)

		// Verify each has unique CSS content
		const css1 = animator1._elements.styleElement.textContent
		const css2 = animator2._elements.styleElement.textContent
		const css3 = animator3._elements.styleElement.textContent

		expect(css1).toContain('.fade-in')
		expect(css1).toContain('opacity 0.5s')
		expect(css1).not.toContain('scale')
		expect(css1).not.toContain('translateY')

		expect(css2).toContain('.zoom-in')
		expect(css2).toContain('scale(0.8)')
		expect(css2).toContain('scale(1)')

		expect(css3).toContain('.slide-up')
		expect(css3).toContain('translateY(100px)')
		expect(css3).toContain('translateY(0)')

		// Verify all are in document head
		expect(document.head.contains(animator1._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator2._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator3._elements.styleElement)).toBe(true)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should allow function to access all config values', () => {
		let capturedConfig = null

		const customStylesFn = (config) => {
			capturedConfig = config
			return `
				.test {
					opacity: 0;
					transition: opacity ${config.maxSpeed}ms ease;
				}
				.test.visible {
					opacity: 1;
					transition: opacity ${config.minSpeed}ms ease;
				}
			`
		}

		const animator = new ScrollAnimator({
			mainClassName: 'test-all-params',
			visibleClassName: 'test-visible',
			translateYvalue: 120,
			maxSpeed: 900,
			minSpeed: 600,
			customStyles: customStylesFn
		})

		// Verify function received all parameters
		expect(capturedConfig).toBeTruthy()
		expect(capturedConfig.mainClassName).toBe('test-all-params')
		expect(capturedConfig.visibleClassName).toBe('test-visible')
		expect(capturedConfig.translateYvalue).toBe(120)
		expect(capturedConfig.maxSpeed).toBe(900)
		expect(capturedConfig.minSpeed).toBe(600)

		// Verify CSS uses the config values
		const css = animator._elements.styleElement.textContent
		expect(css).toContain('900ms')
		expect(css).toContain('600ms')

		// Cleanup
		animator.destroy()
	})

	test('should handle function errors gracefully', () => {
		// Test 1: Function that throws an error
		const errorThrowingFn = () => {
			throw new Error('Intentional error for testing')
		}

		// This should not crash the application
		let animator1
		try {
			animator1 = new ScrollAnimator({
				mainClassName: 'error-test',
				customStyles: errorThrowingFn
			})
			// If it doesn't throw, the error was caught internally
			// The animator should still be created
			expect(animator1).toBeTruthy()
		} catch (error) {
			// If error is thrown, it should be caught and handled
			// The test passes either way as long as it doesn't crash
		}

		if (animator1) {
			animator1.destroy()
		}

		// Test 2: Function that returns non-string value
		const invalidReturnFn = () => {
			return { invalid: 'object' }
		}

		const animator2 = new ScrollAnimator({
			mainClassName: 'invalid-return',
			customStyles: invalidReturnFn
		})

		// Should still create animator (may have null or default styles)
		expect(animator2).toBeTruthy()
		expect(animator2._isInitialized).toBe(false) // Not initialized yet

		// Cleanup
		animator2.destroy()

		// Test 3: Function that returns undefined
		const undefinedReturnFn = () => {
			return undefined
		}

		const animator3 = new ScrollAnimator({
			mainClassName: 'undefined-return',
			customStyles: undefinedReturnFn
		})

		// Should still create animator
		expect(animator3).toBeTruthy()

		// Cleanup
		animator3.destroy()
	})
})

// ============================================================================
// TEST SUITE 9: 'external' Keyword customStyles
// ============================================================================

describe('ScrollAnimator \'external\' Keyword customStyles', () => {
	let originalInfo

	// Helper to capture console.info messages
	const captureInfo = () => {
		const messages = []
		originalInfo = console.info
		console.info = (...args) => {
			messages.push(args.join(' '))
		}
		return messages
	}

	// Helper to restore console.info
	const restoreInfo = () => {
		if (originalInfo) {
			console.info = originalInfo
		}
	}

	test('should skip CSS injection when using \'external\' keyword', () => {
		// Count style elements before
		const styleCountBefore = document.head.querySelectorAll('style').length

		const animator = new ScrollAnimator({
			mainClassName: 'external-test',
			customStyles: 'external'
		})

		// Count style elements after
		const styleCountAfter = document.head.querySelectorAll('style').length

		// Verify no new style elements were added
		expect(styleCountAfter).toBe(styleCountBefore)

		// Cleanup
		animator.destroy()
	})

	test('should set styleElement to null when using \'external\'', () => {
		const animator = new ScrollAnimator({
			mainClassName: 'external-null-test',
			customStyles: 'external'
		})

		// Verify styleElement is explicitly null (not undefined)
		expect(animator._elements.styleElement).toBe(null)
		expect(animator._elements.styleElement).not.toBe(undefined)

		// Cleanup
		animator.destroy()
	})

	test('should not add any style element to document.head', () => {
		// Get all existing style elements
		const existingStyles = Array.from(document.head.querySelectorAll('style'))

		const animator = new ScrollAnimator({
			mainClassName: 'no-style-test',
			customStyles: 'external'
		})

		// Get all style elements after creating animator
		const currentStyles = Array.from(document.head.querySelectorAll('style'))

		// Verify no new style elements were added
		expect(currentStyles.length).toBe(existingStyles.length)

		// Verify all current styles existed before
		currentStyles.forEach(style => {
			expect(existingStyles.includes(style)).toBe(true)
		})

		// Cleanup
		animator.destroy()
	})

	test('should handle destroy() without errors when styleElement is null', () => {
		const animator = new ScrollAnimator({
			mainClassName: 'destroy-null-test',
			customStyles: 'external'
		})

		// Verify styleElement is null
		expect(animator._elements.styleElement).toBe(null)

		// This should not throw any errors
		let errorThrown = false
		try {
			animator.destroy()
		} catch (error) {
			errorThrown = true
		}

		// Verify no error was thrown
		expect(errorThrown).toBe(false)
	})

	test('should support multiple instances with \'external\' simultaneously', () => {
		const animator1 = new ScrollAnimator({
			mainClassName: 'external-multi-1',
			customStyles: 'external'
		})

		const animator2 = new ScrollAnimator({
			mainClassName: 'external-multi-2',
			customStyles: 'external'
		})

		const animator3 = new ScrollAnimator({
			mainClassName: 'external-multi-3',
			customStyles: 'external'
		})

		// Verify all have null styleElement
		expect(animator1._elements.styleElement).toBe(null)
		expect(animator2._elements.styleElement).toBe(null)
		expect(animator3._elements.styleElement).toBe(null)

		// Verify they are independent instances
		expect(animator1).not.toBe(animator2)
		expect(animator2).not.toBe(animator3)
		expect(animator1).not.toBe(animator3)

		// Verify each has its own config
		expect(animator1._config.mainClassName).toBe('external-multi-1')
		expect(animator2._config.mainClassName).toBe('external-multi-2')
		expect(animator3._config.mainClassName).toBe('external-multi-3')

		// Verify all can be destroyed without errors
		let errorsThrown = 0
		try {
			animator1.destroy()
		} catch (error) {
			errorsThrown++
		}
		try {
			animator2.destroy()
		} catch (error) {
			errorsThrown++
		}
		try {
			animator3.destroy()
		} catch (error) {
			errorsThrown++
		}

		expect(errorsThrown).toBe(0)
	})

	test('should log console.info message when using \'external\'', () => {
		const messages = captureInfo()

		const animator = new ScrollAnimator({
			mainClassName: 'info-test',
			customStyles: 'external'
		})

		// Verify the expected info message was logged
		const externalMessage = messages.find(msg =>
			msg.includes('Using external CSS') && msg.includes('No styles injected')
		)
		expect(externalMessage).toBeTruthy()

		// Verify the message contains the expected text
		expect(externalMessage).toContain('ScrollAnimator:')
		expect(externalMessage).toContain('Using external CSS')
		expect(externalMessage).toContain('No styles injected')

		restoreInfo()
		animator.destroy()
	})

	test('should still initialize and observe elements correctly', () => {
		// Create test DOM elements
		const container = document.createElement('div')
		container.innerHTML = `
			<div class="external-observe-test">Element 1</div>
			<div class="external-observe-test">Element 2</div>
			<div class="external-observe-test">Element 3</div>
		`
		document.body.appendChild(container)

		const animator = new ScrollAnimator({
			mainClassName: 'external-observe-test',
			customStyles: 'external'
		})

		// Verify styleElement is null
		expect(animator._elements.styleElement).toBe(null)

		// Verify instance is not initialized yet
		expect(animator._isInitialized).toBe(false)

		// Initialize the animator
		animator.init()

		// Verify initialization succeeded
		expect(animator._isInitialized).toBe(true)

		// Verify elements were found and stored
		expect(animator._elements.nodeList).toBeTruthy()
		expect(animator._elements.nodeList.length).toBe(3)

		// Verify observer was created
		expect(animator._observer).toBeTruthy()
		expect(animator._observer).not.toBe(null)

		// Verify observer is an IntersectionObserver
		expect(animator._observer instanceof IntersectionObserver).toBe(true)

		// Cleanup
		animator.destroy()
		document.body.removeChild(container)
	})
})

// ============================================================================
// TEST SUITE 10: translateYvalue Auto-Adjustment
// ============================================================================

describe('ScrollAnimator translateYvalue Auto-Adjustment', () => {
	let originalInfo

	// Helper to capture console.info messages
	const captureInfo = () => {
		const messages = []
		originalInfo = console.info
		console.info = (...args) => {
			messages.push(args.join(' '))
		}
		return messages
	}

	// Helper to restore console.info
	const restoreInfo = () => {
		if (originalInfo) {
			console.info = originalInfo
		}
	}

	test('should auto-adjust to 0 when customStyles is string and translateYvalue not explicitly set', () => {
		const messages = captureInfo()

		const animator = new ScrollAnimator({
			mainClassName: 'string-auto-adjust',
			customStyles: '.string-auto-adjust { opacity: 0; }'
		})

		// Verify translateYvalue was auto-adjusted to 0
		expect(animator._config.translateYvalue).toBe(0)

		// Verify console.info message was logged
		const autoAdjustMessage = messages.find(msg =>
			msg.includes('translateYvalue auto-set to 0 for custom CSS')
		)
		expect(autoAdjustMessage).toBeTruthy()

		restoreInfo()
		animator.destroy()
	})

	test('should auto-adjust to 0 when customStyles is function and translateYvalue not explicitly set', () => {
		const messages = captureInfo()

		const customStylesFn = ({ mainClassName }) => `
			.${mainClassName} {
				opacity: 0;
				transform: scale(0.8);
			}
		`

		const animator = new ScrollAnimator({
			mainClassName: 'function-auto-adjust',
			customStyles: customStylesFn
		})

		// Verify translateYvalue was auto-adjusted to 0
		expect(animator._config.translateYvalue).toBe(0)

		// Verify console.info message was logged
		const autoAdjustMessage = messages.find(msg =>
			msg.includes('translateYvalue auto-set to 0 for custom CSS')
		)
		expect(autoAdjustMessage).toBeTruthy()

		restoreInfo()
		animator.destroy()
	})

	test('should NOT auto-adjust when translateYvalue is explicitly set by user', () => {
		const messages = captureInfo()

		// Test with string customStyles
		const animator1 = new ScrollAnimator({
			mainClassName: 'explicit-string',
			translateYvalue: 150,
			customStyles: '.explicit-string { opacity: 0; }'
		})

		// Verify translateYvalue was NOT auto-adjusted (preserved user value)
		expect(animator1._config.translateYvalue).toBe(150)

		// Test with function customStyles
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator2 = new ScrollAnimator({
			mainClassName: 'explicit-function',
			translateYvalue: 200,
			customStyles: customStylesFn
		})

		// Verify translateYvalue was NOT auto-adjusted (preserved user value)
		expect(animator2._config.translateYvalue).toBe(200)

		// Test with 'external' customStyles
		const animator3 = new ScrollAnimator({
			mainClassName: 'explicit-external',
			translateYvalue: 75,
			customStyles: 'external'
		})

		// Verify translateYvalue was NOT auto-adjusted (preserved user value)
		expect(animator3._config.translateYvalue).toBe(75)

		// Verify no auto-adjustment messages were logged
		const autoAdjustMessages = messages.filter(msg =>
			msg.includes('translateYvalue auto-set to 0')
		)
		expect(autoAdjustMessages.length).toBe(0)

		restoreInfo()
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should NOT auto-adjust when customStyles is null (default template)', () => {
		const messages = captureInfo()

		const animator = new ScrollAnimator({
			mainClassName: 'null-no-adjust',
			customStyles: null
		})

		// Verify translateYvalue is the default value (100), not auto-adjusted to 0
		expect(animator._config.translateYvalue).toBe(100)

		// Verify no auto-adjustment message was logged
		const autoAdjustMessage = messages.find(msg =>
			msg.includes('translateYvalue auto-set to 0')
		)
		expect(autoAdjustMessage).toBeFalsy()

		restoreInfo()
		animator.destroy()
	})

	test('should NOT auto-adjust when customStyles is \'template\'', () => {
		const messages = captureInfo()

		const animator = new ScrollAnimator({
			mainClassName: 'template-no-adjust',
			customStyles: 'template'
		})

		// Verify translateYvalue is the default value (100), not auto-adjusted to 0
		expect(animator._config.translateYvalue).toBe(100)

		// Verify no auto-adjustment message was logged
		const autoAdjustMessage = messages.find(msg =>
			msg.includes('translateYvalue auto-set to 0')
		)
		expect(autoAdjustMessage).toBeFalsy()

		restoreInfo()
		animator.destroy()
	})

	test('should auto-adjust to 0 when customStyles is \'external\' and translateYvalue not explicitly set', () => {
		const messages = captureInfo()

		const animator = new ScrollAnimator({
			mainClassName: 'external-auto-adjust',
			customStyles: 'external'
		})

		// Verify translateYvalue was auto-adjusted to 0
		expect(animator._config.translateYvalue).toBe(0)

		// Verify console.info message was logged (specific to external CSS)
		const autoAdjustMessage = messages.find(msg =>
			msg.includes('translateYvalue auto-set to 0 for external CSS')
		)
		expect(autoAdjustMessage).toBeTruthy()

		restoreInfo()
		animator.destroy()
	})

	test('should log console.info message when auto-adjustment occurs', () => {
		const messages = captureInfo()

		// Test with string customStyles
		const animator1 = new ScrollAnimator({
			mainClassName: 'log-test-string',
			customStyles: '.log-test-string { opacity: 0; }'
		})

		// Verify message for custom CSS
		const customCssMessage = messages.find(msg =>
			msg.includes('ScrollAnimator:') &&
			msg.includes('translateYvalue auto-set to 0 for custom CSS') &&
			msg.includes('Set explicitly to override')
		)
		expect(customCssMessage).toBeTruthy()

		// Clear messages
		messages.length = 0

		// Test with 'external' customStyles
		const animator2 = new ScrollAnimator({
			mainClassName: 'log-test-external',
			customStyles: 'external'
		})

		// Verify message for external CSS
		const externalCssMessage = messages.find(msg =>
			msg.includes('ScrollAnimator:') &&
			msg.includes('translateYvalue auto-set to 0 for external CSS') &&
			msg.includes('Set explicitly to override')
		)
		expect(externalCssMessage).toBeTruthy()

		// Clear messages
		messages.length = 0

		// Test with function customStyles
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator3 = new ScrollAnimator({
			mainClassName: 'log-test-function',
			customStyles: customStylesFn
		})

		// Verify message for custom CSS (function)
		const functionCssMessage = messages.find(msg =>
			msg.includes('ScrollAnimator:') &&
			msg.includes('translateYvalue auto-set to 0 for custom CSS') &&
			msg.includes('Set explicitly to override')
		)
		expect(functionCssMessage).toBeTruthy()

		restoreInfo()
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})
})

// ============================================================================
// TEST SUITE 11: autoDetectTransform Option
// ============================================================================

describe('ScrollAnimator autoDetectTransform Option', () => {
	test('should auto-adjust translateYvalue when true (default) with custom CSS', () => {
		// Test with string customStyles
		const animator1 = new ScrollAnimator({
			mainClassName: 'auto-detect-true-string',
			autoDetectTransform: true,
			customStyles: '.auto-detect-true-string { opacity: 0; }'
		})

		// Verify translateYvalue was auto-adjusted to 0
		expect(animator1._config.translateYvalue).toBe(0)
		expect(animator1._config.autoDetectTransform).toBe(true)

		// Test with function customStyles
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator2 = new ScrollAnimator({
			mainClassName: 'auto-detect-true-function',
			autoDetectTransform: true,
			customStyles: customStylesFn
		})

		// Verify translateYvalue was auto-adjusted to 0
		expect(animator2._config.translateYvalue).toBe(0)
		expect(animator2._config.autoDetectTransform).toBe(true)

		// Test with 'external' customStyles
		const animator3 = new ScrollAnimator({
			mainClassName: 'auto-detect-true-external',
			autoDetectTransform: true,
			customStyles: 'external'
		})

		// Verify translateYvalue was auto-adjusted to 0
		expect(animator3._config.translateYvalue).toBe(0)
		expect(animator3._config.autoDetectTransform).toBe(true)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should NOT auto-adjust translateYvalue when false', () => {
		// Test with string customStyles
		const animator1 = new ScrollAnimator({
			mainClassName: 'auto-detect-false-string',
			autoDetectTransform: false,
			customStyles: '.auto-detect-false-string { opacity: 0; }'
		})

		// Verify translateYvalue was NOT auto-adjusted (remains at default 100)
		expect(animator1._config.translateYvalue).toBe(100)
		expect(animator1._config.autoDetectTransform).toBe(false)

		// Test with function customStyles
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator2 = new ScrollAnimator({
			mainClassName: 'auto-detect-false-function',
			autoDetectTransform: false,
			customStyles: customStylesFn
		})

		// Verify translateYvalue was NOT auto-adjusted (remains at default 100)
		expect(animator2._config.translateYvalue).toBe(100)
		expect(animator2._config.autoDetectTransform).toBe(false)

		// Test with 'external' customStyles
		const animator3 = new ScrollAnimator({
			mainClassName: 'auto-detect-false-external',
			autoDetectTransform: false,
			customStyles: 'external'
		})

		// Verify translateYvalue was NOT auto-adjusted (remains at default 100)
		expect(animator3._config.translateYvalue).toBe(100)
		expect(animator3._config.autoDetectTransform).toBe(false)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should preserve user-provided translateYvalue when false', () => {
		// Test with string customStyles
		const animator1 = new ScrollAnimator({
			mainClassName: 'false-preserve-string',
			autoDetectTransform: false,
			translateYvalue: 150,
			customStyles: '.false-preserve-string { opacity: 0; }'
		})

		// Verify user-provided translateYvalue is preserved
		expect(animator1._config.translateYvalue).toBe(150)
		expect(animator1._config.autoDetectTransform).toBe(false)

		// Test with function customStyles
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator2 = new ScrollAnimator({
			mainClassName: 'false-preserve-function',
			autoDetectTransform: false,
			translateYvalue: 200,
			customStyles: customStylesFn
		})

		// Verify user-provided translateYvalue is preserved
		expect(animator2._config.translateYvalue).toBe(200)
		expect(animator2._config.autoDetectTransform).toBe(false)

		// Test with 'external' customStyles
		const animator3 = new ScrollAnimator({
			mainClassName: 'false-preserve-external',
			autoDetectTransform: false,
			translateYvalue: 75,
			customStyles: 'external'
		})

		// Verify user-provided translateYvalue is preserved
		expect(animator3._config.translateYvalue).toBe(75)
		expect(animator3._config.autoDetectTransform).toBe(false)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should preserve user-provided translateYvalue when true (explicit override)', () => {
		// Test with string customStyles
		const animator1 = new ScrollAnimator({
			mainClassName: 'true-preserve-string',
			autoDetectTransform: true,
			translateYvalue: 150,
			customStyles: '.true-preserve-string { opacity: 0; }'
		})

		// Verify user-provided translateYvalue is preserved (not auto-adjusted)
		expect(animator1._config.translateYvalue).toBe(150)
		expect(animator1._config.autoDetectTransform).toBe(true)

		// Test with function customStyles
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator2 = new ScrollAnimator({
			mainClassName: 'true-preserve-function',
			autoDetectTransform: true,
			translateYvalue: 200,
			customStyles: customStylesFn
		})

		// Verify user-provided translateYvalue is preserved (not auto-adjusted)
		expect(animator2._config.translateYvalue).toBe(200)
		expect(animator2._config.autoDetectTransform).toBe(true)

		// Test with 'external' customStyles
		const animator3 = new ScrollAnimator({
			mainClassName: 'true-preserve-external',
			autoDetectTransform: true,
			translateYvalue: 75,
			customStyles: 'external'
		})

		// Verify user-provided translateYvalue is preserved (not auto-adjusted)
		expect(animator3._config.translateYvalue).toBe(75)
		expect(animator3._config.autoDetectTransform).toBe(true)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should be settable via constructor options', () => {
		// Test setting to true explicitly
		const animator1 = new ScrollAnimator({
			mainClassName: 'set-true',
			autoDetectTransform: true
		})

		expect(animator1._config.autoDetectTransform).toBe(true)

		// Test setting to false
		const animator2 = new ScrollAnimator({
			mainClassName: 'set-false',
			autoDetectTransform: false
		})

		expect(animator2._config.autoDetectTransform).toBe(false)

		// Test default value (should be true)
		const animator3 = new ScrollAnimator({
			mainClassName: 'set-default'
		})

		expect(animator3._config.autoDetectTransform).toBe(true)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should handle non-boolean values appropriately', () => {
		// Test with string value (truthy) - should be validated and set to true
		const animator1 = new ScrollAnimator({
			mainClassName: 'non-bool-string',
			autoDetectTransform: 'true'
		})

		// Verify validation converts non-boolean to default (true)
		expect(animator1._config.autoDetectTransform).toBe(true)

		// Test with number value (truthy) - should be validated and set to true
		const animator2 = new ScrollAnimator({
			mainClassName: 'non-bool-number',
			autoDetectTransform: 1
		})

		// Verify validation converts non-boolean to default (true)
		expect(animator2._config.autoDetectTransform).toBe(true)

		// Test with null value (falsy) - should be validated and set to true
		const animator3 = new ScrollAnimator({
			mainClassName: 'non-bool-null',
			autoDetectTransform: null
		})

		// Verify validation converts non-boolean to default (true)
		expect(animator3._config.autoDetectTransform).toBe(true)

		// Test with undefined value (should use default true)
		const animator4 = new ScrollAnimator({
			mainClassName: 'non-bool-undefined',
			autoDetectTransform: undefined
		})

		// undefined in options object means it will be overridden by default (true)
		expect(animator4._config.autoDetectTransform).toBe(true)

		// Test with 0 value (falsy) - should be validated and set to true
		const animator5 = new ScrollAnimator({
			mainClassName: 'non-bool-zero',
			autoDetectTransform: 0
		})

		// Verify validation converts non-boolean to default (true)
		expect(animator5._config.autoDetectTransform).toBe(true)

		// Test with object value - should be validated and set to true
		const animator6 = new ScrollAnimator({
			mainClassName: 'non-bool-object',
			autoDetectTransform: {}
		})

		// Verify validation converts non-boolean to default (true)
		expect(animator6._config.autoDetectTransform).toBe(true)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
		animator4.destroy()
		animator5.destroy()
		animator6.destroy()
	})
})

// ============================================================================
// TEST SUITE 12: Multiple Instances with Different customStyles
// ============================================================================

describe('ScrollAnimator Multiple Instances with Different customStyles', () => {
	test('should work independently with null and string customStyles', () => {
		// Instance 1: null (default template)
		const animator1 = new ScrollAnimator({
			mainClassName: 'multi-null',
			customStyles: null
		})

		// Instance 2: string (custom CSS)
		const animator2 = new ScrollAnimator({
			mainClassName: 'multi-string',
			customStyles: '.multi-string { opacity: 0; transform: scale(0.9); }'
		})

		// Verify both instances exist
		expect(animator1).toBeTruthy()
		expect(animator2).toBeTruthy()

		// Verify both have styleElements (not null)
		expect(animator1._elements.styleElement).toBeTruthy()
		expect(animator2._elements.styleElement).toBeTruthy()

		// Verify they are different styleElements
		expect(animator1._elements.styleElement).not.toBe(animator2._elements.styleElement)

		// Verify both are in document.head
		expect(document.head.contains(animator1._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator2._elements.styleElement)).toBe(true)

		// Verify translateYvalue: null uses default (100), string auto-adjusts to 0
		expect(animator1._config.translateYvalue).toBe(100)
		expect(animator2._config.translateYvalue).toBe(0)

		// Verify CSS content is different
		const css1 = animator1._elements.styleElement.textContent
		const css2 = animator2._elements.styleElement.textContent

		expect(css1).toContain('.multi-null')
		expect(css2).toContain('.multi-string')
		expect(css2).toContain('scale(0.9)')

		// Cleanup
		animator1.destroy()
		animator2.destroy()
	})

	test('should work independently with function and \'external\' customStyles', () => {
		// Instance 1: function (custom CSS generator)
		const customStylesFn = ({ mainClassName }) => `
			.${mainClassName} {
				opacity: 0;
				transform: translateX(-50px);
				transition: all 0.5s ease;
			}
			.${mainClassName}.visible {
				opacity: 1;
				transform: translateX(0);
			}
		`

		const animator1 = new ScrollAnimator({
			mainClassName: 'multi-function',
			customStyles: customStylesFn
		})

		// Instance 2: 'external' (no CSS injection)
		const animator2 = new ScrollAnimator({
			mainClassName: 'multi-external',
			customStyles: 'external'
		})

		// Verify both instances exist
		expect(animator1).toBeTruthy()
		expect(animator2).toBeTruthy()

		// Verify styleElement states
		expect(animator1._elements.styleElement).toBeTruthy() // function has styleElement
		expect(animator2._elements.styleElement).toBe(null) // external has null

		// Verify function instance styleElement is in document.head
		expect(document.head.contains(animator1._elements.styleElement)).toBe(true)

		// Verify translateYvalue: both auto-adjust to 0
		expect(animator1._config.translateYvalue).toBe(0)
		expect(animator2._config.translateYvalue).toBe(0)

		// Verify function-generated CSS content
		const css1 = animator1._elements.styleElement.textContent
		expect(css1).toContain('.multi-function')
		expect(css1).toContain('translateX(-50px)')
		expect(css1).toContain('translateX(0)')

		// Cleanup
		animator1.destroy()
		animator2.destroy()
	})

	test('should work independently with \'template\' and function customStyles', () => {
		// Instance 1: 'template' (default template)
		const animator1 = new ScrollAnimator({
			mainClassName: 'multi-template',
			customStyles: 'template'
		})

		// Instance 2: function (custom CSS generator)
		const customStylesFn = ({ mainClassName, translateYvalue }) => `
			.${mainClassName} {
				opacity: 0;
				transform: translateY(${translateYvalue}px) rotate(5deg);
			}
			.${mainClassName}.visible {
				opacity: 1;
				transform: translateY(0) rotate(0deg);
			}
		`

		const animator2 = new ScrollAnimator({
			mainClassName: 'multi-function-2',
			translateYvalue: 120,
			customStyles: customStylesFn
		})

		// Verify both instances exist
		expect(animator1).toBeTruthy()
		expect(animator2).toBeTruthy()

		// Verify both have styleElements
		expect(animator1._elements.styleElement).toBeTruthy()
		expect(animator2._elements.styleElement).toBeTruthy()

		// Verify they are different styleElements
		expect(animator1._elements.styleElement).not.toBe(animator2._elements.styleElement)

		// Verify translateYvalue: template uses default (100), function uses user value (120)
		expect(animator1._config.translateYvalue).toBe(100)
		expect(animator2._config.translateYvalue).toBe(120)

		// Verify CSS content
		const css1 = animator1._elements.styleElement.textContent
		const css2 = animator2._elements.styleElement.textContent

		expect(css1).toContain('.multi-template')
		expect(css1).toContain('translateY(100px)') // default template uses translateYvalue

		expect(css2).toContain('.multi-function-2')
		expect(css2).toContain('translateY(120px)') // function uses user-provided value
		expect(css2).toContain('rotate(5deg)')

		// Cleanup
		animator1.destroy()
		animator2.destroy()
	})

	test('should work independently with three different customStyles patterns', () => {
		// Instance 1: null (default template)
		const animator1 = new ScrollAnimator({
			mainClassName: 'multi-three-null',
			customStyles: null
		})

		// Instance 2: string (custom CSS)
		const animator2 = new ScrollAnimator({
			mainClassName: 'multi-three-string',
			customStyles: '.multi-three-string { opacity: 0; filter: blur(5px); }'
		})

		// Instance 3: function (custom CSS generator)
		const customStylesFn = ({ mainClassName }) => `
			.${mainClassName} {
				opacity: 0;
				transform: scale(0.5);
			}
		`

		const animator3 = new ScrollAnimator({
			mainClassName: 'multi-three-function',
			customStyles: customStylesFn
		})

		// Verify all instances exist
		expect(animator1).toBeTruthy()
		expect(animator2).toBeTruthy()
		expect(animator3).toBeTruthy()

		// Verify all have styleElements
		expect(animator1._elements.styleElement).toBeTruthy()
		expect(animator2._elements.styleElement).toBeTruthy()
		expect(animator3._elements.styleElement).toBeTruthy()

		// Verify all are different styleElements
		expect(animator1._elements.styleElement).not.toBe(animator2._elements.styleElement)
		expect(animator2._elements.styleElement).not.toBe(animator3._elements.styleElement)
		expect(animator1._elements.styleElement).not.toBe(animator3._elements.styleElement)

		// Verify all are in document.head
		expect(document.head.contains(animator1._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator2._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator3._elements.styleElement)).toBe(true)

		// Verify translateYvalue: null uses default (100), string/function auto-adjust to 0
		expect(animator1._config.translateYvalue).toBe(100)
		expect(animator2._config.translateYvalue).toBe(0)
		expect(animator3._config.translateYvalue).toBe(0)

		// Verify CSS content is unique for each
		const css1 = animator1._elements.styleElement.textContent
		const css2 = animator2._elements.styleElement.textContent
		const css3 = animator3._elements.styleElement.textContent

		expect(css1).toContain('.multi-three-null')
		expect(css2).toContain('.multi-three-string')
		expect(css2).toContain('blur(5px)')
		expect(css3).toContain('.multi-three-function')
		expect(css3).toContain('scale(0.5)')

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
	})

	test('should have correct styleElement for each customStyles pattern', () => {
		// Create instances with all 5 patterns
		const animator1 = new ScrollAnimator({
			mainClassName: 'style-elem-null',
			customStyles: null
		})

		const animator2 = new ScrollAnimator({
			mainClassName: 'style-elem-template',
			customStyles: 'template'
		})

		const animator3 = new ScrollAnimator({
			mainClassName: 'style-elem-external',
			customStyles: 'external'
		})

		const animator4 = new ScrollAnimator({
			mainClassName: 'style-elem-string',
			customStyles: '.style-elem-string { opacity: 0; }'
		})

		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator5 = new ScrollAnimator({
			mainClassName: 'style-elem-function',
			customStyles: customStylesFn
		})

		// Verify styleElement states
		expect(animator1._elements.styleElement).toBeTruthy() // null has styleElement
		expect(animator2._elements.styleElement).toBeTruthy() // template has styleElement
		expect(animator3._elements.styleElement).toBe(null) // external has null
		expect(animator4._elements.styleElement).toBeTruthy() // string has styleElement
		expect(animator5._elements.styleElement).toBeTruthy() // function has styleElement

		// Verify non-null styleElements are in document.head
		expect(document.head.contains(animator1._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator2._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator4._elements.styleElement)).toBe(true)
		expect(document.head.contains(animator5._elements.styleElement)).toBe(true)

		// Verify all non-null styleElements are unique
		const styleElements = [
			animator1._elements.styleElement,
			animator2._elements.styleElement,
			animator4._elements.styleElement,
			animator5._elements.styleElement
		]

		// Check uniqueness
		for (let i = 0; i < styleElements.length; i++) {
			for (let j = i + 1; j < styleElements.length; j++) {
				expect(styleElements[i]).not.toBe(styleElements[j])
			}
		}

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
		animator4.destroy()
		animator5.destroy()
	})

	test('should not affect other instances when one is destroyed', () => {
		// Create three instances
		const animator1 = new ScrollAnimator({
			mainClassName: 'destroy-test-1',
			customStyles: null
		})

		const animator2 = new ScrollAnimator({
			mainClassName: 'destroy-test-2',
			customStyles: '.destroy-test-2 { opacity: 0; }'
		})

		const animator3 = new ScrollAnimator({
			mainClassName: 'destroy-test-3',
			customStyles: 'external'
		})

		// Store references before destroy
		const style1 = animator1._elements.styleElement
		const style2 = animator2._elements.styleElement
		const style3 = animator3._elements.styleElement

		// Verify initial state
		expect(style1).toBeTruthy()
		expect(style2).toBeTruthy()
		expect(style3).toBe(null)
		expect(document.head.contains(style1)).toBe(true)
		expect(document.head.contains(style2)).toBe(true)

		// Destroy animator2 (middle instance)
		animator2.destroy()

		// Verify animator2 is destroyed
		expect(animator2._elements.styleElement).toBe(null)
		expect(document.head.contains(style2)).toBe(false)

		// Verify animator1 is unaffected
		expect(animator1._elements.styleElement).toBe(style1)
		expect(document.head.contains(style1)).toBe(true)
		expect(animator1._config.mainClassName).toBe('destroy-test-1')
		expect(animator1._config.translateYvalue).toBe(100)

		// Verify animator3 is unaffected
		expect(animator3._elements.styleElement).toBe(null)
		expect(animator3._config.mainClassName).toBe('destroy-test-3')
		expect(animator3._config.translateYvalue).toBe(0)

		// Cleanup remaining instances
		animator1.destroy()
		animator3.destroy()
	})

	test('should have correct translateYvalue for each instance', () => {
		// Instance 1: null (default template) - should be 100
		const animator1 = new ScrollAnimator({
			mainClassName: 'translatey-null',
			customStyles: null
		})

		// Instance 2: 'template' - should be 100
		const animator2 = new ScrollAnimator({
			mainClassName: 'translatey-template',
			customStyles: 'template'
		})

		// Instance 3: string (auto-adjust) - should be 0
		const animator3 = new ScrollAnimator({
			mainClassName: 'translatey-string',
			customStyles: '.translatey-string { opacity: 0; }'
		})

		// Instance 4: function (auto-adjust) - should be 0
		const customStylesFn = ({ mainClassName }) => `.${mainClassName} { opacity: 0; }`

		const animator4 = new ScrollAnimator({
			mainClassName: 'translatey-function',
			customStyles: customStylesFn
		})

		// Instance 5: 'external' (auto-adjust) - should be 0
		const animator5 = new ScrollAnimator({
			mainClassName: 'translatey-external',
			customStyles: 'external'
		})

		// Instance 6: string with explicit value - should be user value (150)
		const animator6 = new ScrollAnimator({
			mainClassName: 'translatey-explicit',
			translateYvalue: 150,
			customStyles: '.translatey-explicit { opacity: 0; }'
		})

		// Instance 7: function with autoDetectTransform false - should be default (100)
		const animator7 = new ScrollAnimator({
			mainClassName: 'translatey-no-auto',
			autoDetectTransform: false,
			customStyles: customStylesFn
		})

		// Verify translateYvalue for each instance
		expect(animator1._config.translateYvalue).toBe(100) // null uses default
		expect(animator2._config.translateYvalue).toBe(100) // template uses default
		expect(animator3._config.translateYvalue).toBe(0) // string auto-adjusts
		expect(animator4._config.translateYvalue).toBe(0) // function auto-adjusts
		expect(animator5._config.translateYvalue).toBe(0) // external auto-adjusts
		expect(animator6._config.translateYvalue).toBe(150) // explicit user value
		expect(animator7._config.translateYvalue).toBe(100) // autoDetectTransform false

		// Verify all instances are independent
		expect(animator1._config).not.toBe(animator2._config)
		expect(animator2._config).not.toBe(animator3._config)
		expect(animator3._config).not.toBe(animator4._config)

		// Cleanup
		animator1.destroy()
		animator2.destroy()
		animator3.destroy()
		animator4.destroy()
		animator5.destroy()
		animator6.destroy()
		animator7.destroy()
	})
})

// ============================================================================
// TEST RESULTS SUMMARY
// ============================================================================

console.log('\n' + '='.repeat(60))
console.log('📊 TEST RESULTS SUMMARY')
console.log('='.repeat(60))
console.log(`Total Tests:  ${testResults.total}`)
console.log(`✅ Passed:    ${testResults.passed}`)
console.log(`❌ Failed:    ${testResults.failed}`)
console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`)

if (testResults.failed > 0) {
	console.log('\n' + '='.repeat(60))
	console.log('❌ FAILED TESTS:')
	console.log('='.repeat(60))
	testResults.failures.forEach((failure, index) => {
		console.log(`${index + 1}. ${failure.test}`)
		console.log(`   ${failure.error}`)
	})
}

console.log('\n' + '='.repeat(60))
if (testResults.failed === 0) {
	console.log('🎉 ALL TESTS PASSED!')
} else {
	console.log('⚠️  SOME TESTS FAILED - Please review errors above')
}
console.log('='.repeat(60) + '\n')
