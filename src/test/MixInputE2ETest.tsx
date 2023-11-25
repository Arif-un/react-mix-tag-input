import { FormEvent, useState } from 'react'
import React, { useRef } from 'react'

import MixInput from '../MixInput'
import { type MixInputRef, type MixInputValues } from '../MixInputType'

export default function MixInputE2ETest() {
  const [value, setValue] = useState<MixInputValues>([])
  const mixInputRef = useRef<MixInputRef>(null)

  const handleControls = (e: FormEvent<HTMLButtonElement>) => {
    const action = e.target.name

    if (action === 'reset') {
      setValue([])
    }
    if (action === 'insert-tag') {
      mixInputRef.current?.insertContent({ type: 'tag', label: 'okk' })
    }
  }

  return (
    <>
      <h4>Controls</h4>
      <button name="reset" onClick={handleControls}>
        Reset Value
      </button>
      <button name="insert-tag" onClick={handleControls}>
        insert tag
      </button>
      <hr />
      <MixInput
        // showTagDeleteBtn={false}
        placeholder="placeholder"
        value={value}
        ref={mixInputRef}
        onChange={(val) => setValue(val)}
        multiline
      />
    </>
  )
}
