const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-scroll-wrapper', () => {

	const visualDiff = new VisualDiff('scroll-wrapper', __dirname);

	let browser, page;
	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach((dir) => {
		describe(dir, () => {

			before(async() => {
				await page.goto(`${visualDiff.getBaseUrl()}/components/scroll-wrapper/test/scroll-wrapper.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			['show-actions', 'no-actions'].forEach((actions) => {
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

			it('action-button-focus', async function() {
				await page.$eval('#show-actions-overflow-right > d2l-test-scroll-wrapper', (elem) => {
					elem.focusRightScrollButton();
				});
				const rect = await visualDiff.getRect(page, '#show-actions-overflow-right');
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

	});

});
