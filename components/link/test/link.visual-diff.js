import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-link', () => {

	const visualDiff = new VisualDiff('link', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/link/test/link.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ name: 'wc-standard' },
		{ name: 'wc-main' },
		{ name: 'wc-small' },
		{ name: 'wc-inline', selector: '#wc-inline d2l-link' },
		{ name: 'wc-inline-paragraph', selector: '#wc-inline-paragraph d2l-link' },
		{ name: 'wc-block' },
		{ name: 'wc-clamp-one-line' },
		{ name: 'wc-clamp-unbreakable-one-line' },
		{ name: 'wc-clamp-two-lines' },
		{ name: 'wc-clamp-unbreakable-two-lines' },
		{ name: 'sass-standard' },
		{ name: 'sass-main' },
		{ name: 'sass-small' }
	].forEach(({ name, selector }) => {
		describe('screen', () => {
			it(`${name}`, async function() {
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`${name} focused`, async function() {
				await focusWithKeyboard(page, selector || `#${name}`);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		describe('print', () => {
			before(async() => {
				await page.emulateMediaType('print');
			});

			after(async() => {
				await page.emulateMediaType('screen');
			});

			it(`${name}`, async function() {
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

	});

});
