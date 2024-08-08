import { describe } from "vitest";
import { editorValueToMixInputValue, mixInputValueToEditorValue, mixInputValueToTipTapJSon } from "./utils";
import { MixInputValues } from "./MixInputType";

describe('mix-input value to editor value then change it back', () => {
  const editorValue1 = [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "text"
        },
        {
          "type": "tag",
          "attrs": {
            "label": "Tag 1",
            "id": "111"
          }
        },
        {
          "type": "text",
          "text": "text2"
        }
      ]
    },
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "line2 text"
        },
        {
          "type": "tag",
          "attrs": {
            "label": "Tag 1",
            "id": "111"
          }
        },
        {
          "type": "text",
          "text": " text3"
        }
      ]
    }
  ]

  const convertedMixInputValue1: MixInputValues = [
    [
      "text",
      {
        "type": "tag",
        "attrs": {
          "label": "Tag 1",
          "id": "111"
        }
      },
      "text2"
    ],
    [
      "line2 text",
      {
        "type": "tag",
        "attrs": {
          "label": "Tag 1",
          "id": "111"
        }
      },
      " text3"
    ]
  ]

  it('should convert editor-value-1 to mix-input-value-1', () => {
    expect(editorValueToMixInputValue(editorValue1)).toEqual(convertedMixInputValue1)
  })

  it('should convert mix-input-value-1 to editor-value-1', () => {
    expect(mixInputValueToEditorValue(convertedMixInputValue1)).toEqual(editorValue1)
  })

})