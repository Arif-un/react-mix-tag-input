import './stories.css'

import type { Meta, StoryObj } from '@storybook/react'
import React, { useRef, useState } from 'react'

import MixTagInput from './MixTagInput'
import type { MixTagInputRef, MixTagValue } from './MixTagInput.d'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof MixTagInput> = {
  component: MixTagInput,
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof MixTagInput>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    value: ['asd'],
  },
  render: () => <TestMixTagInput />,
}

function TestMixTagInput() {
  const [val, setVal] = useState<MixTagValue[]>(['123', { type: 'tag', label: 'tag1' }, 'asdf'])
  const r = useRef<MixTagInputRef>(null)

  const handleClick = () => {
    setVal((prev) => {
      const prevVal = structuredClone(prev)
      prevVal.splice(1, 0, { type: 'tag', label: 'tag2' })
      return prevVal
    })
  }

  return (
    <>
      <MixTagInput
        ref={r}
        // multiline
        value={val}
        onChange={(value) => console.log('===', value)}
      />
      <button onClick={handleClick}>add tag</button>
      <button onClick={() => r.current?.insertContent('_text_')}>insert text</button>
      <button onClick={() => r.current?.insertContent({ type: 'tag', label: 'tag' })}>
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
