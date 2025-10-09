/**
 * Unit Tests for ScrollAnimator Static Utility Methods
 *
 * Tests the three static utility methods:
 * - clamp(x, min, max)
 * - lerp(a, b, t)
 * - invLerp(a, b, v)
 *
 * Run in Node.js: node tests/scroll-animator.test.js
 * Run in browser: Include in HTML and open console
 */

// Import ScrollAnimator (Node.js)
let ScrollAnimator
if (typeof require !== 'undefined') {
	try {
		ScrollAnimator = require('../scroll-animator.js')
	} catch (e) {
		console.log('Running in browser mode')
	}
}

// Simple test framework
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

const expect = (actual) => ({
	toBe: (expected) => {
		if (actual !== expected) {
			throw new Error(`Expected ${expected}, but got ${actual}`)
		}
	},
	toBeCloseTo: (expected, precision = 2) => {
		const diff = Math.abs(actual - expected)
		const tolerance = Math.pow(10, -precision)
		if (diff > tolerance) {
			throw new Error(`Expected ${expected} (±${tolerance}), but got ${actual}`)
		}
	}
})

// ============================================================================
// TEST SUITE: ScrollAnimator.clamp()
// ============================================================================

describe('ScrollAnimator.clamp(x, min, max)', () => {

	test('should return value when within range', () => {
		// Value is within min and max bounds
		expect(ScrollAnimator.clamp(50, 0, 100)).toBe(50)
		expect(ScrollAnimator.clamp(25, 0, 100)).toBe(25)
		expect(ScrollAnimator.clamp(75, 0, 100)).toBe(75)
	})

	test('should return max when value exceeds upper bound', () => {
		// Value is greater than max, should be clamped to max
		expect(ScrollAnimator.clamp(150, 0, 100)).toBe(100)
		expect(ScrollAnimator.clamp(200, 0, 100)).toBe(100)
		expect(ScrollAnimator.clamp(9999, 0, 100)).toBe(100)
	})

	test('should return min when value is below lower bound', () => {
		// Value is less than min, should be clamped to min
		expect(ScrollAnimator.clamp(-10, 0, 100)).toBe(0)
		expect(ScrollAnimator.clamp(-50, 0, 100)).toBe(0)
		expect(ScrollAnimator.clamp(-9999, 0, 100)).toBe(0)
	})

	test('should return min when value equals min (edge case)', () => {
		// Value exactly equals minimum bound
		expect(ScrollAnimator.clamp(0, 0, 100)).toBe(0)
		expect(ScrollAnimator.clamp(10, 10, 50)).toBe(10)
		expect(ScrollAnimator.clamp(-100, -100, 0)).toBe(-100)
	})

	test('should return max when value equals max (edge case)', () => {
		// Value exactly equals maximum bound
		expect(ScrollAnimator.clamp(100, 0, 100)).toBe(100)
		expect(ScrollAnimator.clamp(50, 10, 50)).toBe(50)
		expect(ScrollAnimator.clamp(0, -100, 0)).toBe(0)
	})

	test('should work with negative ranges', () => {
		// Both min and max are negative
		expect(ScrollAnimator.clamp(-5, -10, -1)).toBe(-5)
		expect(ScrollAnimator.clamp(-15, -10, -1)).toBe(-10)
		expect(ScrollAnimator.clamp(0, -10, -1)).toBe(-1)
	})

	test('should work with decimal values', () => {
		// Test with floating point numbers
		expect(ScrollAnimator.clamp(0.5, 0, 1)).toBe(0.5)
		expect(ScrollAnimator.clamp(0.75, 0, 1)).toBe(0.75)
		expect(ScrollAnimator.clamp(1.5, 0, 1)).toBe(1)
		expect(ScrollAnimator.clamp(-0.5, 0, 1)).toBe(0)
	})

	test('should work with same min and max (degenerate case)', () => {
		// When min equals max, should always return that value
		expect(ScrollAnimator.clamp(50, 100, 100)).toBe(100)
		expect(ScrollAnimator.clamp(150, 100, 100)).toBe(100)
		expect(ScrollAnimator.clamp(0, 100, 100)).toBe(100)
	})
})

// ============================================================================
// TEST SUITE: ScrollAnimator.lerp()
// ============================================================================

describe('ScrollAnimator.lerp(a, b, t)', () => {

	test('should return start value when t=0', () => {
		// t=0 means 0% interpolation, should return start value
		expect(ScrollAnimator.lerp(0, 100, 0)).toBe(0)
		expect(ScrollAnimator.lerp(50, 150, 0)).toBe(50)
		expect(ScrollAnimator.lerp(-100, 100, 0)).toBe(-100)
	})

	test('should return end value when t=1', () => {
		// t=1 means 100% interpolation, should return end value
		expect(ScrollAnimator.lerp(0, 100, 1)).toBe(100)
		expect(ScrollAnimator.lerp(50, 150, 1)).toBe(150)
		expect(ScrollAnimator.lerp(-100, 100, 1)).toBe(100)
	})

	test('should return midpoint when t=0.5', () => {
		// t=0.5 means 50% interpolation, should return midpoint
		expect(ScrollAnimator.lerp(0, 100, 0.5)).toBe(50)
		expect(ScrollAnimator.lerp(50, 150, 0.5)).toBe(100)
		expect(ScrollAnimator.lerp(-100, 100, 0.5)).toBe(0)
	})

	test('should return quarter point when t=0.25', () => {
		// t=0.25 means 25% interpolation
		expect(ScrollAnimator.lerp(0, 100, 0.25)).toBe(25)
		expect(ScrollAnimator.lerp(0, 200, 0.25)).toBe(50)
		expect(ScrollAnimator.lerp(-100, 100, 0.25)).toBe(-50)
	})

	test('should return three-quarter point when t=0.75', () => {
		// t=0.75 means 75% interpolation
		expect(ScrollAnimator.lerp(0, 100, 0.75)).toBe(75)
		expect(ScrollAnimator.lerp(0, 200, 0.75)).toBe(150)
		expect(ScrollAnimator.lerp(-100, 100, 0.75)).toBe(50)
	})

	test('should work with negative ranges', () => {
		// Start and end values are both negative
		expect(ScrollAnimator.lerp(-100, 0, 0.5)).toBe(-50)
		expect(ScrollAnimator.lerp(-200, -100, 0.5)).toBe(-150)
		expect(ScrollAnimator.lerp(-100, -50, 0.25)).toBe(-87.5)
	})

	test('should work with reverse ranges (b < a)', () => {
		// End value is less than start value (interpolating backwards)
		expect(ScrollAnimator.lerp(100, 0, 0.5)).toBe(50)
		expect(ScrollAnimator.lerp(200, 100, 0.5)).toBe(150)
		expect(ScrollAnimator.lerp(100, -100, 0.5)).toBe(0)
	})

	test('should work with decimal values', () => {
		// Test with floating point numbers
		expect(ScrollAnimator.lerp(0, 1, 0.333)).toBeCloseTo(0.333, 3)
		expect(ScrollAnimator.lerp(0, 1, 0.666)).toBeCloseTo(0.666, 3)
		expect(ScrollAnimator.lerp(0.5, 1.5, 0.5)).toBe(1)
	})

	test('should work with t values outside 0-1 range (extrapolation)', () => {
		// t < 0 or t > 1 extrapolates beyond the range
		expect(ScrollAnimator.lerp(0, 100, 1.5)).toBe(150)
		expect(ScrollAnimator.lerp(0, 100, -0.5)).toBe(-50)
		expect(ScrollAnimator.lerp(0, 100, 2)).toBe(200)
	})
})

// ============================================================================
// TEST SUITE: ScrollAnimator.invLerp()
// ============================================================================

describe('ScrollAnimator.invLerp(a, b, v)', () => {

	test('should return 0 when v equals start value', () => {
		// v = a means value is at start, progression is 0%
		expect(ScrollAnimator.invLerp(0, 100, 0)).toBe(0)
		expect(ScrollAnimator.invLerp(50, 150, 50)).toBe(0)
		expect(ScrollAnimator.invLerp(-100, 100, -100)).toBe(0)
	})

	test('should return 1 when v equals end value', () => {
		// v = b means value is at end, progression is 100%
		expect(ScrollAnimator.invLerp(0, 100, 100)).toBe(1)
		expect(ScrollAnimator.invLerp(50, 150, 150)).toBe(1)
		expect(ScrollAnimator.invLerp(-100, 100, 100)).toBe(1)
	})

	test('should return 0.5 when v is at midpoint', () => {
		// v is halfway between a and b, progression is 50%
		expect(ScrollAnimator.invLerp(0, 100, 50)).toBe(0.5)
		expect(ScrollAnimator.invLerp(50, 150, 100)).toBe(0.5)
		expect(ScrollAnimator.invLerp(-100, 100, 0)).toBe(0.5)
	})

	test('should return 0.25 when v is at quarter point', () => {
		// v is 25% of the way from a to b
		expect(ScrollAnimator.invLerp(0, 100, 25)).toBe(0.25)
		expect(ScrollAnimator.invLerp(0, 200, 50)).toBe(0.25)
		expect(ScrollAnimator.invLerp(-100, 100, -50)).toBe(0.25)
	})

	test('should return 0.75 when v is at three-quarter point', () => {
		// v is 75% of the way from a to b
		expect(ScrollAnimator.invLerp(0, 100, 75)).toBe(0.75)
		expect(ScrollAnimator.invLerp(0, 200, 150)).toBe(0.75)
		expect(ScrollAnimator.invLerp(-100, 100, 50)).toBe(0.75)
	})

	test('should work with negative ranges', () => {
		// Start and end values are both negative
		expect(ScrollAnimator.invLerp(-100, 0, -50)).toBe(0.5)
		expect(ScrollAnimator.invLerp(-200, -100, -150)).toBe(0.5)
		expect(ScrollAnimator.invLerp(-100, -50, -87.5)).toBe(0.25)
	})

	test('should work with reverse ranges (b < a)', () => {
		// End value is less than start value
		expect(ScrollAnimator.invLerp(100, 0, 50)).toBe(0.5)
		expect(ScrollAnimator.invLerp(200, 100, 150)).toBe(0.5)
		expect(ScrollAnimator.invLerp(100, -100, 0)).toBe(0.5)
	})

	test('should work with decimal values', () => {
		// Test with floating point numbers
		expect(ScrollAnimator.invLerp(0, 1, 0.333)).toBeCloseTo(0.333, 3)
		expect(ScrollAnimator.invLerp(0, 1, 0.666)).toBeCloseTo(0.666, 3)
		expect(ScrollAnimator.invLerp(0.5, 1.5, 1)).toBe(0.5)
	})

	test('should work with values outside range (extrapolation)', () => {
		// v < a or v > b extrapolates beyond 0-1 range
		expect(ScrollAnimator.invLerp(0, 100, 150)).toBe(1.5)
		expect(ScrollAnimator.invLerp(0, 100, -50)).toBe(-0.5)
		expect(ScrollAnimator.invLerp(0, 100, 200)).toBe(2)
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

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
	module.exports = { testResults }
}

