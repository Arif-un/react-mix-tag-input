import './main.css'

import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom'

import MixInput from '../src/MixInput'
import type { MixInputRef, MixInputValues } from '../src/MixInputType'

function TestApp() {
  const [value, setValue] = useState<MixInputValues>([])
  const ref = useRef<MixInputRef>(null)

  const handleOnChange = (value: MixInputValues) => {
    console.log('on change', value)
    setValue([value.flat()])
  }

  const handleControls = (type: string) => () => {
    if (type === 'reset') {
      setValue([])
    }
    if (type === 'insert-tag-by-arr') {
      setValue((prv) => {
        prv[0].push({
          type: 'tag',
          attrs: { label: 'sss', class: '----asd---', ddd: 'dddd', sss: 'tttt' },
        })
        return [...prv]
      })
    }
    if (type === 'insert-tag-by-ref') {
      ref.current?.insertContent({
        type: 'tag',
        attrs: { label: 'Tag', class: ['class-2', 's'] },
      })
    }
    if (type === 'caret-pos') {
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
      <br />
      <br />
      <MixInput
        ref={ref}
        value={value}
        onChange={handleOnChange}
        placeholder="Write here..."
        spellCheck={false}
        // data-testId="input"
        // tagAttrs={{ test-attr: '22', test: undefined }}
      />
    </div>
  )
}

ReactDOM.render(<TestApp />, document.getElementById('root'))
