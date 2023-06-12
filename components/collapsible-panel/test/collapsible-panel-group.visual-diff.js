import puppeteer from 'puppeteer';
import { VisualDiff } from '@brightspace-ui/visual-diff';

describe('d2l-collapsible-panel-group', () => {

	const visualDiff = new VisualDiff('collapsible-panel-group', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
	});

	beforeEach(async() => {
		await page.reload();
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	describe('ltr', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel-group.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'default', selector: '#default' },
			{ name: 'subtle', selector: '#subtle' },
			{ name: 'inline', selector: '#inline' },
		].forEach((info) => {

			it(info.name, async function() {
				if (info.action) await info.action(info.selector);
				const rect = await visualDiff.getRect(page, info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('rtl', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/collapsible-panel/test/collapsible-panel-group.visual-diff.html?dir=rtl`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'default', selector: '#default' },
			{ name: 'subtle', selector: '#subtle' },
			{ name: 'inline', selector: '#inline' },
		].forEach((info) => {

			it(info.name, async function() {
				const rect = await visualDiff.getRect(page, info.selector);
				if (info.action) await info.action(info.selector);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});
});
