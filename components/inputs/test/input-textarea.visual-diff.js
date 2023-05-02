import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-input-textarea', () => {

	const visualDiff = new VisualDiff('input-textarea', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 4000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-textarea.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		{ name: 'default', selector: '#default' },
		{ name: 'default-focus', selector: '#default', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'disabled', selector: '#disabled' },
		{ name: 'label-hidden', selector: '#label-hidden' },
		{ name: 'wrapping', selector: '#wrapping' },
		{ name: 'placeholder', selector: '#placeholder' },
		{ name: 'placeholder-focus', selector: '#placeholder', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'placeholder-disabled', selector: '#placeholder-disabled' },
		{ name: 'rows', selector: '#rows' },
		{ name: 'max-rows', selector: '#max-rows', action: selector => page.$eval(selector, elem => elem.value = 'line 1\nline 2\nline 3\nline 4\nline 5\nline 6') },
		{ name: 'required', selector: '#required' },
		{ name: 'invalid', selector: '#invalid' },
		{ name: 'invalid-focus', selector: '#invalid', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'invalid-disabled', selector: '#invalid-disabled' },
		{ name: 'invalid-rtl', selector: '#invalid-rtl' },
		{ name: 'skeleton', selector: '#skeleton' },
		{ name: 'no-border-padding', selector: '#no-border-padding' },
		{ name: 'no-border-padding-focus', selector: '#no-border-padding', action: selector => focusWithKeyboard(page, selector) }
	].forEach(info => {

		it(info.name, async function() {
			if (info.action) await info.action(info.selector);
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('sass', () => {

		[
			{ name: 'basic', selector: '#sass-basic' },
			{ name: 'basic-focus', selector: '#sass-basic', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'disabled', selector: '#sass-disabled' },
			{ name: 'placeholder', selector: '#sass-placeholder' },
			{ name: 'placeholder-focus', selector: '#sass-placeholder', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'placeholder-disabled', selector: '#sass-placeholder-disabled' },
			{ name: 'invalid', selector: '#sass-invalid' },
			{ name: 'invalid-focus', selector: '#sass-invalid', action: selector => focusWithKeyboard(page, selector) },
			{ name: 'invalid-disabled', selector: '#sass-invalid-disabled' },
			{ name: 'invalid-rtl', selector: '#sass-invalid-rtl' }
		].forEach(info => {

			it(info.name, async function() {
				if (info.action) await info.action(info.selector);
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

		it('mirror does not add additional container height', async function() {
			// scroll to bottom
			await page.$eval('#scroll', (container) => {
				container.scrollTop = container.scrollHeight;
			});
			const rect = await visualDiff.getRect(page, '#scroll');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect, captureBeyondViewport: false });
		});

	});

});
