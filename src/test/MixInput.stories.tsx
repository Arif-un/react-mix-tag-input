import './stories.css'

import { expect } from '@storybook/jest'
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within } from '@storybook/testing-library'
import React, { useRef, useState } from 'react'

import MixInput from '../MixInput'
import type { MixInputRef, MixInputValue } from '../MixInputType'
import { getCaretPosition } from '../utils'
import MixInputE2ETest from './MixInputE2ETest'
// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof MixInput> = {
  component: MixInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MixInput>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Test: Story = {
  args: {},
  render: () => <TestMixInput />,
}

export const MixInputTestInteraction: Story = {
  render: MixInputE2ETest,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const mixInput = canvas.getByRole('textbox')
    const insertTagBtn = canvas.getByText('insert tag')
    const resetBtn = canvas.getByText('Reset Value')
    await userEvent.type(mixInput, 'hihello')
    // caret position check after simple typing
    expect(getCaretPosition(mixInput)).toBe(7)

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}')
    // check caret position is correct after press arrowLeft
    expect(getCaretPosition(mixInput)).toBe(2)

    await userEvent.click(insertTagBtn)
    // check caret position after insert tag
    expect(getCaretPosition(mixInput)).toBe(7)

    await userEvent.click(insertTagBtn)
    // check caret position after insert tag
    expect(getCaretPosition(mixInput)).toBe(12)

    await userEvent.keyboard('{ArrowLeft}')
    // check caret position after press arrowLeft before a tag
    expect(getCaretPosition(mixInput)).toBe(7)

    // empty input start with tag then type text check caret position
    await userEvent.click(resetBtn)
    await userEvent.click(mixInput)
    await userEvent.click(insertTagBtn)
    await userEvent.type(mixInput, 'test')
    expect(getCaretPosition(mixInput)).toBe(9)

    // test only one tag inside input and check caret by arrow keys
    await userEvent.type(mixInput, '{Backspace}{Backspace}{Backspace}{Backspace}')
    await userEvent.type(mixInput, '{ArrowLeft}')
    expect(getCaretPosition(mixInput)).toBe(0)
    await userEvent.type(mixInput, '{ArrowRight}')
    expect(getCaretPosition(mixInput)).toBe(5)
    await userEvent.type(mixInput, 'test')
    expect(getCaretPosition(mixInput)).toBe(9)

    // check when input start with a tag then add text before tag and check caret
    await userEvent.type(mixInput, '{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}')
    await userEvent.keyboard('a')
    expect(getCaretPosition(mixInput)).toBe(1)

    // try free typing and check if caret in right place
    // remove content using ctrl+backspace and check caret (no test)
    // try to place caret before zerowidthspace by click and check caret moved after caret
    // try place caret at the beginning of input and check if caret is showing
    // try jump over tag by pressing left right arrow
    // check caret in last position when focused
    // start input with tag then add other content then check caret positions are ok on typing
    // press Enter and check line break and caret position are ok
    // input contain only one tag inside, after remove this tag still zerowidthspace remains
    // make focus outside and try to insert something
    // when delete content using delete button then cursor should stay still
    //  text scrollable in overflow situation
    //  got error select multiple character and remove using backspace
    //  set exact caret position in insert content method
    //  test backspace, left and right arrow functionality working with <br>
  },
}

function TestMixInput() {
  const id = Math.random().toString()
  const [val, setVal] = useState<MixInputValue[]>([
    'Hlo, ',
    { type: 'tag', label: 'an' },
    'Wld!',
    { type: 'tag', label: 'ok', id, class: 'asd' },
    '2',
  ])
  const ref = useRef<MixInputRef>(null)

  // console.log('parent', ref.current, val)

  return (
    <>
      <h3>Mix Tag Input</h3>

      <button onClick={() => console.log(ref?.current?.caretPosition)}>get caret pos</button>
      <button onClick={() => setVal(['Hlof, 234'])}>set content</button>
      <button
        onClick={() =>
          ref.current?.insertContent(['444', '5', { type: 'tag', label: 'tag' }, '66'])
        }
      >
        insert content
      </button>
      <button onClick={() => ref.current?.insertContent({ type: 'tag', label: 'tag' })}>
        insert tag
      </button>
      <button onClick={() => ref.current?.insertContent({ type: 'line-break' })}>insert br</button>
      <MixInput
        showTagDeleteBtn={false}
        placeholder="placeholder"
        value={val}
        ref={ref}
        // multiline
        onChange={(value) => {
          setVal(value)
          // console.log('value ===', value)
        }}
        multiline
        key="sddasssds"
      />
    </>
  )
}
