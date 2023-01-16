import { focus, VisualDiff } from '@brightspace-ui/visual-diff';
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

	['print', 'screen'].forEach((mediaType) => {

		describe(mediaType, () => {

			before(async() => {
				await page.emulateMediaType(mediaType);
			});

			after(async() => {
				await page.emulateMediaType('screen');
			});

			[
				'wc-standard',
				'wc-main',
				'wc-small',
				'wc-inline',
				'wc-inline-paragraph',
				'wc-overflow-ellipsis',
				'sass-standard',
				'sass-main',
				'sass-small'
			].forEach((name) => {
				it(`${name}`, async function() {
					const rect = await visualDiff.getRect(page, `#${name}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

		});

	});

	[
		{ name: 'wc-standard-focus', selector: '#wc-standard', action: selector => { return focus(page, `${selector}`); } },
		{ name: 'wc-inline-paragraph-focus', selector: '#wc-inline-paragraph', action: selector => { return focus(page, `${selector} d2l-link`); } },
		{ name: 'wc-overflow-ellipsis-focus', selector: '#wc-overflow-ellipsis', action: selector => { return focus(page, `${selector}`); } },
		{ name: 'sass-standard-focus', selector: '#sass-standard', action: selector => { return focus(page, `${selector}`); } }
	].forEach(info => {
		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
