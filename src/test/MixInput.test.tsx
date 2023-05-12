import { fireEvent, render } from '@testing-library/react'
import React from 'react'
import { describe, expect, test, vi } from 'vitest'

import MixInput from '../MixInput'

describe('test Mix Input component', () => {
  test('default value', async () => {
    const { findByLabelText } = await render(<MixInput value={['test text']} />)

    expect((await findByLabelText('input')).innerHTML).toBe('test text')
  })

  test('trigger onChange', async () => {
    const onChange = vi.fn()
    const { findByLabelText } = await render(<MixInput onChange={onChange} />)

    const input = await findByLabelText('input')
    fireEvent.input(input, { target: { innerHTML: 'test text' } })
    input.blur()

    expect(onChange).toBeCalledTimes(1)
    expect((await findByLabelText('input')).innerHTML).toBe('test text')
  })
})
