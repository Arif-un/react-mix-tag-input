import './stories.css'

import type { Meta, StoryObj } from '@storybook/react'
import React, { useRef, useState } from 'react'

import MixInput from './MixInput'
import type { MixInputRef, MixInputValue } from './MixInputType'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof MixInput> = {
  component: MixInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MixInput>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    value: ['asd'],
  },
  render: () => <TestMixInput />,
}

function TestMixInput() {
  const [val, setVal] = useState<MixInputValue[]>(['123', { type: 'tag', label: 'tag1', data: { a: 2 } }, 'asdf'])
  const r = useRef<MixInputRef>(null)
  // const [value, setValue] = useState()

  const handleClick = () => {
    setVal((prev) => {
      const prevVal = structuredClone(prev)
      prevVal.splice(1, 0, { type: 'tag', label: 'tag2' })
      return prevVal
    })
  }

  return (
    <>
      {/* TODO: text scollable in overflow situation */}
      {/* TODO: got error select multiple character and remove useing backspace */}
      {/* TODO: set exact caret position in insert content method */}
      {/* TODO: test backspace, left and right arrow fuctionality working with <br> */}
      {/* <h1>Mix Tag Input</h1> */}
      <MixInput
        showTagDeleteBtn={false}
        placeholder='placeholder'
        ref={r}
        // multiline
        value={val}
        onChange={(value) => {
          setVal(value)
          console.log('===', value)
        }}
      />
      <button onClick={handleClick}>add tag in state</button>
      <button onClick={() => r.current?.insertContent('_text_')}>insert text</button>
      <button onClick={() => r.current?.insertContent({ type: 'tag', label: 'tag', data: { e: 2 } })}>
        insert tag
      </button>
      <button onClick={() => r.current?.insertContent({ type: 'tag', label: 'tag 2', data: { e: 2 } })}>
        insert tag
      </button>
      <button
        onClick={() => {
          console.log(r.current?.getValue())
        }}
      >
        console ref
      </button>
    </>
  )
}
