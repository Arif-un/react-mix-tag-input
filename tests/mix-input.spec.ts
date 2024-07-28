import { expect, Page, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:5173/', { timeout: 5000 })
})

test('default caret position check by simple text', async ({ page }) => {
  await page.getByTestId('input').focus()
  await page.keyboard.type('hihello')

  expect(await getCaretPosition(page)).toBe(7)

  await page.getByTestId('input').focus()
  await page.keyboard.press('ArrowLeft')

  expect(await getCaretPosition(page)).toBe(6)
})

test('insert content/tag after a tag', async ({ page }) => {
  // add text content ==> [hihello]
  await page.getByTestId('input').focus()
  await page.keyboard.type('hihello')
  expect(await getCaretPosition(page)).toBe(7)

  // add a tag by useRef ==> [hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-ref').click()
  expect(await getCaretPosition(page)).toBe(11)

  // add text after tag ==> [hihello{Tag}afterTag]
  await page.getByTestId('input').focus()
  await page.keyboard.type('afterTag')
  expect(await getCaretPosition(page)).toBe(18)

  // add a tag by arr ==> [hihello{Tag}afterTag{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-arr').click()
  expect(await getCaretPosition(page)).toBe(22)

  // add text after tag ==> [hihello{Tag}afterTag{Tag}text]
  await page.getByTestId('input').focus()
  await page.keyboard.type('text')
  expect(await getCaretPosition(page)).toBe(25)

  // reset input ==> []
  await page.getByTestId('reset').click()
  expect(await getCaretPosition(page)).toBe(0)

  // add tag in empty input ==> [{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-ref').click()
  expect(await getCaretPosition(page)).toBe(5)

  // add another tag after tag ==> [{Tag}{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-ref').click()
  expect(await getCaretPosition(page)).toBe(9)
})

test('insert content/tag before a tag', async ({ page }) => {
  // add text content ==> [hihello]
  await page.getByTestId('input').focus()
  await page.keyboard.type('hihello')
  expect(await getCaretPosition(page)).toBe(7)

  // add a tag by useRef ==> [hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-ref').click()
  expect(await getCaretPosition(page)).toBe(11)

  // move caret before tag ==> [hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('ArrowLeft')
  expect(await getCaretPosition(page)).toBe(7)

  // add text before tag ==> [hihellotext{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.type('text')
  expect(await getCaretPosition(page)).toBe(11)

  // add tag before tag  ==> [hihellotext{Tag}{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-arr').click()
  expect(await getCaretPosition(page)).toBe(15)

  // add text between tag ==> [hihellotext{Tag}text{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.type('text')
  expect(await getCaretPosition(page)).toBe(18)

  // reset input ==> []
  await page.getByTestId('reset').click()
  expect(await getCaretPosition(page)).toBe(0)

  // add tag in empty input ==> [{Tag}]
  await page.getByTestId('insert-tag-by-ref').click()
  await page.getByTestId('input').focus()
  expect(await getCaretPosition(page)).toBe(5)

  // move caret before tag ==> [{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('ArrowLeft')
  expect(await getCaretPosition(page)).toBe(1)

  // add tag before tag ==> [{Tag}{Tag}]
  await page.getByTestId('insert-tag-by-arr').click()
  expect(await getCaretPosition(page)).toBe(5)

  // remove tag ==> [{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('Backspace')
  expect(await getCaretPosition(page)).toBe(1)

  // add text before tag ==> [text{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.type('text')
  expect(await getCaretPosition(page)).toBe(4)
})

test('check caret position after tag removal', async ({ page }) => {
  // add text content ==> [hihello]
  await page.getByTestId('input').focus()
  await page.keyboard.type('hihello')
  expect(await getCaretPosition(page)).toBe(7)

  // add a tag by useRef ==> [hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-ref').click()
  expect(await getCaretPosition(page)).toBe(11)

  // remove tag ==> [hihello]
  await page.getByTestId('input').focus()
  await page.keyboard.press('Backspace')
  expect(await getCaretPosition(page)).toBe(7)

  // add 2 tags by arr ==> [hihello{Tag}{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-arr').click()
  await page.getByTestId('insert-tag-by-arr').click()
  expect(await getCaretPosition(page)).toBe(15)

  // move caret between tags ==> [hihello{Tag}^{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('ArrowLeft')
  expect(await getCaretPosition(page)).toBe(11)

  // remove tag ==> [hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('Backspace')
  expect(await getCaretPosition(page)).toBe(7)

  // jump to beginning ==> [^hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('Control+ArrowLeft')
  expect(await getCaretPosition(page)).toBe(0)

  // add tag at beginning ==> [{Tag}hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.getByTestId('insert-tag-by-ref').click()
  expect(await getCaretPosition(page)).toBe(4)

  // remove tag ==> [hihello{Tag}]
  await page.getByTestId('input').focus()
  await page.keyboard.press('Backspace')
  expect(await getCaretPosition(page)).toBe(0)
})

test('check caret positions placing correct position', async ({ page }) => {
    // add contents ==> [hihello{Tag}text{Tag}{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.type('hihello')
    await page.getByTestId('insert-tag-by-ref').click()
    await page.keyboard.type('text')
    await page.getByTestId('insert-tag-by-arr').click()
    await page.getByTestId('insert-tag-by-arr').click()
    expect(await getCaretPosition(page)).toBe(22)

    // move caret to beginning ==> [^hihello{Tag}text{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.press('Home')
    expect(await getCaretPosition(page)).toBe(0)

    // move caret before first tag ==> [hihello^{Tag}text{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    expect(await getCaretPosition(page)).toBe(7)

    // move caret after first tag ==> [hihello{Tag}^text{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.press('ArrowRight')
    expect(await getCaretPosition(page)).toBe(10)

    // move caret before fist tag again ==> [hihello^{Tag}text{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.press('ArrowLeft')
    expect(await getCaretPosition(page)).toBe(7)

    // move caret before second tag ==> [hihello{Tag}text^{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    await page.keyboard.press('ArrowRight')
    expect(await getCaretPosition(page)).toBe(14)

    // move caret after second tag ==> [hihello{Tag}text{Tag}^]
    await page.getByTestId('input').focus()
    await page.keyboard.press('ArrowRight')
    expect(await getCaretPosition(page)).toBe(18)

    // move caret before second tag again ==> [hihello{Tag}text^{Tag}]
    await page.getByTestId('input').focus()
    await page.keyboard.press('ArrowLeft')
    expect(await getCaretPosition(page)).toBe(14)
})




async function getCaretPosition(page: Page) {
  await page.getByTestId('get-caret-pos-btn').click()

  const caretPos = await page.getByTestId('caret-pos').textContent()
  return Number(caretPos)
}
