import './main.css'

import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import MixInput from '../src/MixInput'
import type { MixInputRef, MixInputValues } from '../src/MixInputType'
import { getCaretPosition } from '../src/utils'

function TestApp() {
  const [value, setValue] = useState<MixInputValues>([])
  const ref = useRef<MixInputRef>(null)
  const [caretPos, setCaretPos] = useState<number>(0)

  const handleOnChange = (value: MixInputValues) => {
    setValue(value.flat())
  }

  const handleControls = (type: string) => () => {
    if (type === 'reset') {
      setValue([])
    }
    if (type === 'insert-tag-by-arr') {
      setValue([...value, { type: 'tag', label: 'Tag' }])
    }
    if (type === 'insert-tag-by-ref') {
      ref.current?.insertContent({ type: 'tag', label: 'Tag' })
    }
    if (type === 'caret-pos') {
      setCaretPos(getCaretPosition(ref.current?.element as HTMLDivElement) || 0)
    }
  }

  return (
    <div>
      <button onClick={handleControls('reset')} data-testId="reset">
        Reset
      </button>
      <button onClick={handleControls('insert-tag-by-arr')} data-testId="insert-tag-by-arr">
        Insert Tag 1
      </button>
      <button onClick={handleControls('insert-tag-by-ref')} data-testId="insert-tag-by-ref">
        Insert Tag 2
      </button>
      <button onClick={handleControls('caret-pos')} data-testId="get-caret-pos-btn">
        Print Updated Caret Pos
      </button>
      <br />
      <br />
      <div data-testId="caret-pos">{caretPos}</div>
      Test{' '}
      <MixInput
        ref={ref}
        value={value}
        onChange={handleOnChange}
        placeholder="Write here..."
        data-testId="input"
      />
    </div>
  )
}

ReactDOM.render(<TestApp />, document.getElementById('root'))
