import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

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

	const focus = selector => {
		return page.$eval(selector, elem => {
			return new Promise(resolve => {
				elem.focus();
				requestAnimationFrame(resolve);
			});
		});
	};

	[
		{ name: 'wc-standard-focus', selector: '#wc-standard', action: selector => { return focus(`${selector}`); } },
		{ name: 'wc-inline-paragraph-focus', selector: '#wc-inline-paragraph', action: selector => { return focus(`${selector} d2l-link`); } },
		{ name: 'sass-standard-focus', selector: '#sass-standard', action: selector => { return focus(`${selector}`); } }
	].forEach(info => {
		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
