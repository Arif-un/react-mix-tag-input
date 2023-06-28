import { describe, expect, test } from 'vitest'

import { type MixInputValue } from '../MixInputType'
import { injectInArray, nodesToArray } from '../utils'

describe('nodesToArray', () => {
  const tagsDataRef = { current: { '1': { foo: 'bar' } } }

  test('returns empty array when given undefined nodes', () => {
    const result = nodesToArray(undefined, tagsDataRef)
    expect(result).toEqual([])
  })

  test('converts text node to string value', () => {
    const wrapperElm = document.createElement('div')
    const node = document.createTextNode('Hello, world!')
    wrapperElm.appendChild(node)
    const result = nodesToArray(wrapperElm.childNodes, tagsDataRef)
    expect(result).toEqual(['Hello, world!'])
  })

  test('merges consecutive text nodes into a single string value', () => {
    const wrapperElm = document.createElement('div')
    const node1 = document.createTextNode('Hello, ')
    const node2 = document.createTextNode('world!')
    wrapperElm.appendChild(node1)
    wrapperElm.appendChild(node2)
    const result = nodesToArray(wrapperElm.childNodes, tagsDataRef)
    expect(result).toEqual(['Hello, world!'])
  })

  test('converts span node to tag object', () => {
    const wrapperElm = document.createElement('div')
    const node = document.createElement('span')
    node.innerHTML = 'tag'
    node.dataset.id = '1'
    wrapperElm.appendChild(node)
    const result = nodesToArray(wrapperElm.childNodes, tagsDataRef)
    expect(result).toEqual([{ type: 'tag', label: 'tag', data: { foo: 'bar' } }])
  })

  test('merges consecutive text nodes and span node into a single array', () => {
    const wrapperElm = document.createElement('div')
    const node1 = document.createTextNode('Hello, ')
    const node2 = document.createElement('span')
    node2.innerHTML = 'world'
    node2.dataset.id = '1'
    const node3 = document.createTextNode('!')
    wrapperElm.appendChild(node1)
    wrapperElm.appendChild(node2)
    wrapperElm.appendChild(node3)

    const result = nodesToArray(wrapperElm.childNodes, tagsDataRef)
    expect(result).toEqual([
      'Hello, ',
      { type: 'tag', label: 'world', data: { foo: 'bar' } },
      '!',
    ])
  })

  test('converts br node to line break object', () => {
    const wrapperElm = document.createElement('div')
    const node = document.createElement('br')
    wrapperElm.appendChild(node)
    const result = nodesToArray(wrapperElm.childNodes, tagsDataRef)
    expect(result).toEqual([{ type: 'line-break' }])
  })
})

describe('injectInArray', () => {
  const tag1 = { type: 'tag', label: 'tag1' } satisfies MixInputValue
  const tag2 = { type: 'tag', label: 'tag2' } satisfies MixInputValue

  test('insert string in empty array', () => {
    const result = injectInArray([], 'foo', 0)
    expect(result).toEqual(['foo'])
  })

  test('insert string at the beginning of array', () => {
    const result = injectInArray(['bar'], 'foo', 0)
    expect(result).toEqual(['foobar'])
  })

  test('insert object at the beginning of array', () => {
    const result = injectInArray(['bar'], tag1, 0)
    expect(result).toEqual([tag1, 'bar'])
  })

  test('insert string at specific position of array', () => {
    const result = injectInArray(['bar'], 'foo', 2)
    expect(result).toEqual(['bafoor'])
  })

  test('insert object at specific position of array', () => {
    const result = injectInArray(['bar'], tag1, 2)
    expect(result).toEqual(['ba', tag1, 'r'])
  })
  test('insert object at specific position of array', () => {
    const tag3 = { type: 'tag', label: 'tag3' } satisfies MixInputValue
    const result = injectInArray(['123', tag1], tag3, 9)
    expect(result).toEqual(['123', tag1, tag3])
  })

  test('insert array of string  at specific position of array', () => {
    const result = injectInArray(['bar'], ['11', '44'], 2)
    expect(result).toEqual(['ba1144r'])
  })

  test('insert array of string  at beginning  of array', () => {
    const result = injectInArray(['bar'], ['11', '44'], 0)
    expect(result).toEqual(['1144bar'])
  })

  test('insert array of object at specific position of array', () => {
    const result = injectInArray(['bar'], [tag1, tag2], 2)
    expect(result).toEqual(['ba', tag1, tag2, 'r'])
  })

  test('insert array of object at beginning of array', () => {
    const result = injectInArray(['bar'], [tag1, tag2], 0)
    expect(result).toEqual([tag1, tag2, 'bar'])
  })
})
