import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-input-select', () => {

	const visualDiff = new VisualDiff('input-select', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1200 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-select.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	['wc', 'sass'].forEach((type) => {
		['default', 'overflow', 'disabled', 'invalid', 'rtl', 'rtl-overflow', 'rtl-invalid'].forEach((name) => {
			const id = `${type}-${name}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

		['default', 'overflow', 'invalid', 'rtl', 'rtl-overflow', 'rtl-invalid'].forEach((name) => {
			const id = `${type}-${name}`;
			it(`${id}-focus`, async function() {
				await focusWithKeyboard(page, `#${id}`);
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	it('wc-skeleton', async function() {
		const rect = await visualDiff.getRect(page, '#wc-skeleton');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
