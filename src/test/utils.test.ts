import { describe, expect, test } from 'vitest'

import { nodesToArray } from '../utils'


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
