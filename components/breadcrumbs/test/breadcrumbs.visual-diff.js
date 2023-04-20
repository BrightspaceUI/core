import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-breadcrumbs', () => {

	const visualDiff = new VisualDiff('breadcrumbs', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.goto(`${visualDiff.getBaseUrl()}/components/breadcrumbs/test/breadcrumbs.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ name:'default-mode', selector: '#default-mode' },
		{ name:'current-page', selector: '#current-page' },
		{ name:'constrained-width', selector: '#constrained-width' },
		{ name:'compact', selector: '#compact' }
	].forEach(info => {
		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
