const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-number', () => {
	const visualDiff = new VisualDiff('input-number', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 700 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-number.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	async function changeValue(page, selector, newValue) {
		return page.$eval(selector, (elem, newValue) => {
			elem.value = newValue;
			const e = new Event(
				'change',
				{ bubbles: true, composed: false }
			);
			elem.dispatchEvent(e);
		}, newValue);
	}

	[
		'simple',
		'label-hidden',
		'required',
		'disabled',
		'placeholder',
		'default-value'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('simple focus', async function() {
		await page.$eval('#simple', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#simple');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('invalid no focus', async function() {
		await page.$eval('#required', (elem) => elem.validate());
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('invalid focus', async function() {
		await page.$eval('#required', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('invalid focus then fix then blur', async function() {
		await page.$eval('#required', (elem) => elem.focus());
		await changeValue(page, '#required', 10);
		await page.$eval('#required', (elem) => elem.blur());
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
