import { describe, expect, test, vitest } from 'vitest'

import { MixInputValue } from '../MixInputType'
import {
  findPossibleCaretSetNodeAndIndex,
  nodesToArray,
  removeZeroWidthSpace,
  tagValueArrToString,
} from '../utils'

describe('find node by caret index', () => {
  // setup div
  const div = document.createElement('div')
  div.innerHTML = 'Hello, <span>span</span>&ZeroWidthSpace;World!<b>b</b>&ZeroWidthSpace;111'
  //              |---7---|    |-4-|       |-----1--------|---6--|--1-|  |------1-------|-3-| = total length = 23

  const div2 = document.createElement('div')
  div2.innerHTML = '&ZeroWidthSpace;<span>span</span>&ZeroWidthSpace;World!<b>b</b>&ZeroWidthSpace;111'

  test('div2 try caret place first index before zerowidthspace, caret should be after zerowidthspace ', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div2, 0)
    expect(possibleCaretIndex).toBe(1)
    expect(removeZeroWidthSpace(node?.textContent || '')).toBe('')
  })

  test('try caret inside div but possible caret pos will be next text node', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div, 9)
    expect(possibleCaretIndex).toBe(1)
    expect(removeZeroWidthSpace(node?.textContent || '')).toBe('World!')
  })

  test('try caret on zero width space but possible caret pos will be after zeroWidthSpace', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div, 11)
    expect(possibleCaretIndex).toBe(1)
    expect(removeZeroWidthSpace(node?.textContent || '')).toBe('World!')
  })

  test('try caret on third text nodes middle position', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div, 14)
    expect(possibleCaretIndex).toBe(3)
    expect(removeZeroWidthSpace(node?.textContent || '')).toBe('World!')
  })

  test('try caret on valid text node and index should be exact', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div, 4)
    expect(possibleCaretIndex).toBe(4)
    expect(removeZeroWidthSpace(node?.textContent || '')).toBe('Hello, ')
  })

  test('try caret overflow but possible caret will max length', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div, 114)
    expect(possibleCaretIndex).toBe(4)
    expect(removeZeroWidthSpace(node?.textContent || '')).toBe('111')
  })

  test('try negative position, possible will be zero', () => {
    const { node, possibleCaretIndex } = findPossibleCaretSetNodeAndIndex(div, -1)
    expect(possibleCaretIndex).toBe(0)
    expect(node?.textContent).toBe('Hello, ')
  })
})

describe('test nodesToArray function', () => {
  // Test case: When nodes parameter is undefined
  test('nodesToArray handles undefined nodes', () => {
    const result = nodesToArray(undefined)
    expect(result).toEqual([])
  })

  // Test case: When nodes parameter is an empty NodeList
  test('nodesToArray handles empty nodes', () => {
    const nodes = document.createDocumentFragment().childNodes
    const result = nodesToArray(nodes)
    expect(result).toEqual([])
  })

  // Test case: When nodes parameter contains text nodes and line breaks
  test('nodesToArray handles text nodes and line breaks', () => {
    const div = document.createElement('div')
    div.appendChild(document.createTextNode('Hello'))
    div.appendChild(document.createElement('br'))
    div.appendChild(document.createTextNode('World'))
    const nodes = div.childNodes
    const result = nodesToArray(nodes)
    expect(result).toEqual(['Hello', { type: 'line-break' }, 'World'])
  })

  // Test case: When nodes parameter contains span elements with classes
  test('nodesToArray handles span elements with classes', () => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    span.className = 'test-class'
    span.innerHTML = 'Test Content'
    div.appendChild(span)
    const nodes = div.childNodes
    const result = nodesToArray(nodes, 'test-class')
    expect(result).toEqual([{ type: 'tag', label: 'Test Content' }])
  })

  // Test case: When nodes parameter contains span elements without classes
  test('nodesToArray handles span elements without classes', () => {
    const div = document.createElement('div')
    const span = document.createElement('span')
    span.innerHTML = 'Test Content'
    div.appendChild(span)
    const nodes = div.childNodes
    const result = nodesToArray(nodes, 'test-class')
    expect(result).toEqual([{ label: 'Test Content', type: 'tag' }])
  })

  // Test case: When nodes parameter contains elements with various node types and attributes
  test('nodesToArray handles elements with various node types and attributes', () => {
    const div = document.createElement('div')
    const textNode = document.createTextNode('Hello')
    const span = document.createElement('span')
    span.className = 'test-class another-class'
    span.setAttribute('data-id', '123')
    span.innerHTML = 'World'
    const br = document.createElement('br')
    div.appendChild(textNode)
    div.appendChild(span)
    div.appendChild(br)
    const nodes = div.childNodes
    const result = nodesToArray(nodes, 'test-class')
    expect(result).toEqual([
      'Hello',
      { type: 'tag', label: 'World', 'data-id': '123', class: 'another-class' },
      { type: 'line-break' },
    ])
  })
})

describe('test tagValueArrToString', () => {
  // Test case: Empty valueArr
  test('tagValueArrToString handles empty valueArr', () => {
    const result = tagValueArrToString({ tagClassName: 'test-class', valueArr: [] })
    expect(result).toBe('')
  })

  // Test case: Non-array value provided
  test('tagValueArrToString handles non-array valueArr', () => {
    console.error = vitest.fn() // Mock console.error to suppress error output
    const result = tagValueArrToString({ tagClassName: 'test-class', valueArr: 'invalid-value' })
    expect(result).toBe('')
    expect(console.error).toHaveBeenCalledWith('[MixTagInput] Wrong value provided')
  })

  // Test case: ValueArr with a single string item
  test('tagValueArrToString handles valueArr with a single string item', () => {
    const result = tagValueArrToString({ tagClassName: 'test-class', valueArr: ['Hello'] })
    expect(result).toBe('Hello')
  })

  // Test case: ValueArr with multiple string items
  test('tagValueArrToString handles valueArr with multiple string items', () => {
    const result = tagValueArrToString({ tagClassName: 'test-class', valueArr: ['Hello', 'World'] })
    expect(result).toBe('HelloWorld')
  })

  // Test case: ValueArr with Tag objects
  test('tagValueArrToString handles valueArr with Tag objects', () => {
    const valueArr = [
      'Text Before Tag',
      { type: 'tag', label: 'Tag Content', class: 'other-class', 'data-id': '123' },
      'Text After Tag',
    ]
    const result = tagValueArrToString({ tagClassName: 'tag-class', valueArr })
    const expectedOutput =
      'Text Before Tag<span class="tag-class other-class" data-id="123" contenteditable="false">Tag Content</span>Text After Tag'
    expect(result).toBe(expectedOutput)
  })

  // Test case: ValueArr with LineBreak object
  test('tagValueArrToString handles valueArr with LineBreak object', () => {
    const valueArr: MixInputValue[] = [
      'Text Before Line Break',
      { type: 'line-break' },
      'Text After Line Break',
    ]
    const result = tagValueArrToString({ tagClassName: 'test-class', valueArr })
    const expectedOutput = 'Text Before Line Break<br>Text After Line Break'
    expect(result).toBe(expectedOutput)
  })
})
