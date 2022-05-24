import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-html-block', () => {

	const visualDiff = new VisualDiff('html-block', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 2000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/html-block/test/html-block.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
		await page.emulateMediaType('screen');
	});

	after(async() => await browser.close());

	[
		{ name: 'empty', selector: '#empty' },
		{ name: 'typography-print', selector: '#typography', action: () => page.emulateMediaType('print') },
		{ name: 'typography-screen', selector: '#typography' },
		{ name: 'compact', selector: '#compact' },
		{ name: 'inline', selector: '#inline' },
		{ name: 'inline-no-deferred-rendering', selector: '#inline-no-deferred-rendering' },
		{ name: 'large-font-size', selector: '#large-font-size' },
		{ name: 'update-content', selector: '#update-content', action: selector => page.$eval(selector, elem => elem.textContent = 'after update') },
		{ name: 'math (block)', selector: '#math-block' },
		{ name: 'math (inline)', selector: '#math-inline' }
	].forEach((info) => {

		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
