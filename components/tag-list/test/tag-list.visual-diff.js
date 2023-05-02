import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-tag-list', () => {
	const visualDiff = new VisualDiff('tag-list', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 1400, height: 1000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/tag-list/test/tag-list.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	it('is correct at 1400px page width', async function() {
		const rect = await visualDiff.getRect(page, '#default');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
	});

	it('is correct when clear button hidden', async function() {
		const rect = await visualDiff.getRect(page, '#hide-clear-button');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
	});

	describe('tag list item style behaviour', () => {

		it('is correct on focus on tag list item', async function() {
			await page.$eval('#default', async(elem) => {
				const firstListItem = elem.children[0];
				firstListItem.keyboardTooltipItem = true;
				firstListItem.keyboardTooltipShown = false;
				await firstListItem.updateComplete;
			});
			await page.keyboard.press('Tab');
			const rect = await visualDiff.getRect(page, '#default');
			rect.height += 100;
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('is correct on hover on tag list item', async function() {
			await page.hover('d2l-tag-list-item');
			const rect = await visualDiff.getRect(page, '#default');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('is correct on focus and hover tag list item', async function() {
			await page.$eval('#default', async(elem) => {
				await elem.updateComplete;
				const firstListItem = elem.children[0];
				firstListItem.keyboardTooltipItem = false;
				await firstListItem.updateComplete;
			});
			await page.keyboard.press('Tab');
			await page.hover('d2l-tag-list-item');
			const rect = await visualDiff.getRect(page, '#default');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

	});

	[980, 969, 601, 599, 400, 320].forEach((width) => {
		['default', 'clearable'].forEach((state) => {
			describe(`${state} at width ${width}`, () => {
				const selector = `#${state}`;

				before(async() => {
					await page.$eval(selector, async(elem, width) => {
						elem.parentNode.style.width = `${width}px`;
						elem._showHiddenTags = false;
						await elem.updateComplete;
					}, width);
					await page.waitForTimeout(500);
				});

				beforeEach(async() => {
					await page.$eval(selector, async(elem) => {
						if (elem.children[0].text === 'Added New Item') {
							for (let i = 0; i < 2; i++) {
								if (elem.children[0].text === 'Added New Item') elem.removeChild(elem.children[0]);
							}
							await elem.updateComplete;
						}
					});
				});

				it('is correct', async function() {
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});

				it('is correct after adding items', async function() {
					await page.$eval(selector, async(elem) => {
						for (let i = 0; i < 2; i++) {
							const tag = document.createElement('d2l-tag-list-item');
							tag.text = 'Added New Item';
							elem.insertBefore(tag, elem.children[0]);
						}
						await elem.updateComplete;
					});
					await page.waitForTimeout(500);
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});

				it('is correct when show more button clicked if applicable', async function() {
					await page.$eval(selector, async(elem) => {
						const button = elem.shadowRoot.querySelector('.d2l-tag-list-button');
						if (button) button.click();
						await elem.updateComplete;
					});
					await page.waitForTimeout(500);
					const rect = await visualDiff.getRect(page, selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
				});

			});
		});
	});

	describe('clearable behavior', () => {

		beforeEach(async() => {
			await page.reload();
			await visualDiff.resetFocus(page);
		});

		it('is correct when deleting the last item', async function() {
			await page.$eval('#clearable', (elem) => {
				const firstItem = elem.children[4];
				const deleteButton = firstItem.shadowRoot.querySelector('d2l-button-icon');
				deleteButton.click();
			});
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, '#clearable');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('is correct when deleting first item', async function() {
			await page.keyboard.press('Tab');
			await page.keyboard.press('Tab');
			const openEvent = page.$eval('#clearable2', (elem) => {
				elem._hasShownKeyboardTooltip = true;
				const firstItem = elem.children[0];
				return new Promise((resolve) => {
					elem.children[1].addEventListener('focus', resolve);
					const eventObj = document.createEvent('Events');
					eventObj.initEvent('keydown', true, true);
					eventObj.keyCode = 46; // delete
					firstItem.dispatchEvent(eventObj);
				});
			});
			await openEvent;
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, '#clearable2');
			rect.height += 75;
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('is correct after clicking Clear All', async function() {
			await page.$eval('#clearable', (elem) => elem.shadowRoot.querySelector('d2l-button-subtle.d2l-tag-list-clear-button').click());
			await page.waitForTimeout(500);
			const rect = await visualDiff.getRect(page, '#clearable');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

	});

	describe('interactive', () => {

		it('normal', async function() {
			const rect = await visualDiff.getRect(page, '#interactive');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('focus', async function() {
			const rect = await visualDiff.getRect(page, '#interactive');
			await focusWithKeyboard(page, '#interactive');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

	});

});
