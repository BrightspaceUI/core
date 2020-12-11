const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-skeleton', () => {

	const visualDiff = new VisualDiff('skeleton', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 3500 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/skeleton/test/skeleton.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'typography-standard',
		'typography-compact',
		'typography-small',
		'typography-label',
		'typography-standard-paragraph-2',
		'typography-standard-paragraph-3',
		'typography-standard-paragraph-5',
		'typography-compact-paragraph-2',
		'typography-compact-paragraph-3',
		'typography-compact-paragraph-5',
		'typography-small-paragraph-2',
		'typography-small-paragraph-3',
		'typography-small-paragraph-5',
		'link-normal',
		'link-main',
		'link-small',
		'heading-1',
		'heading-2',
		'heading-3',
		'heading-4',
		'heading-1-multiline',
		'heading-2-multiline',
		'heading-3-multiline',
		'heading-4-multiline',
		'box',
		'width'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
