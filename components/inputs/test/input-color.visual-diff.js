import { focusWithKeyboard, oneEvent, resetFocus, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-input-color', () => {
	const visualDiff = new VisualDiff('input-color', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-color.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await resetFocus(page);
	});

	after(async() => await browser.close());

	[
		'background',
		'background-none',
		'background-disabled',
		'background-readonly',
		'foreground',
		'foreground-none',
		'foreground-disabled',
		'foreground-readonly',
		'custom',
		'custom-none',
		'custom-disabled',
		'custom-readonly',
		'label-hidden'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name} > d2l-input-color`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it(`${name}-focus`, async function() {
			const e = oneEvent(page, `#${name} > d2l-input-color`, 'd2l-tooltip-show');
			await focusWithKeyboard(page, `#${name} > d2l-input-color`);
			await e;
			await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect, captureBeyondViewport: false });
		});
	});

});
