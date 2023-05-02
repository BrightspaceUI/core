import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-scroll-wrapper', () => {

	const visualDiff = new VisualDiff('scroll-wrapper', import.meta.url);

	let browser, page;
	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach((dir) => {
		describe(dir, () => {

			before(async() => {
				await page.goto(`${visualDiff.getBaseUrl()}/components/scroll-wrapper/test/scroll-wrapper.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			['show-actions', 'hide-actions', 'split-scrollers'].forEach((actions) => {
				[
					'smaller',
					'same',
					'overflow-right',
					'overflow-both',
					'overflow-left'
				].forEach((width) => {
					const id = `${actions}-${width}`;
					it(id, async function() {
						const rect = await visualDiff.getRect(page, `#${id}`);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				});
			});

			it('split-scrollers-secondary-focus-scroll', async function() {
				await page.$eval('#split-scrollers-secondary-focus-scroll', elem => {
					const button = elem.querySelector('d2l-test-scroll-wrapper').shadowRoot.querySelector('button');
					button.focus();
				});
				const rect = await visualDiff.getRect(page, '#split-scrollers-secondary-focus-scroll');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});
	});

	describe('focus', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/scroll-wrapper/test/scroll-wrapper.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		['show-actions', 'split-scrollers'].forEach((type) => {
			it(type, async function() {
				await focusWithKeyboard(page, `#${type}-overflow-right > d2l-test-scroll-wrapper`);
				const rect = await visualDiff.getRect(page, `#${type}-overflow-right`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});

	});

	describe('print', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/scroll-wrapper/test/scroll-wrapper.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.emulateMediaType('print');
			await page.bringToFront();
		});

		it('hide-actions', async function() {
			const rect = await visualDiff.getRect(page, '#show-actions-overflow-both');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('split-scrollers', async function() {
			const rect = await visualDiff.getRect(page, '#split-scrollers-overflow-both');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
