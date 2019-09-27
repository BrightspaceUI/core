const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-checkbox', () => {

	const visualDiff = new VisualDiff('input-checkbox', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		const client = await page.target().createCDPSession();
		await client.send('Animation.enable');
		await client.send('Animation.setPlaybackRate', { playbackRate: 100 });
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-checkbox.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'checked',
		'checked-disabled',
		'unchecked',
		'unchecked-disabled',
		'unchecked-rtl',
		'indeterminate',
		'indeterminate-disabled',
		'multiline',
		'multiline-rtl',
		'hidden-label',
		'hidden-label-rtl',
		'spacer',
		'spacer-rtl'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'checked',
		'unchecked',
		'indeterminate',
		'multiline',
		'hidden-label'
	].forEach((name) => {
		it(`${name}-focus`, async function() {
			await page.$eval(`#${name}`, (elem) => elem.focus());
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
