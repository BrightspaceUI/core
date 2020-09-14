const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-number', () => {
	const visualDiff = new VisualDiff('input-number', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1150 } });
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
		'default-value',
		'decimal-value',
		'min-value',
		'max-value',
		'min-max-value',
		'min-max-fraction-digits'
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

	it('required focus then blur', async function() {
		await page.$eval('#required', (elem) => elem.focus());
		await page.$eval('#required', (elem) => elem.blur());
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('required focus then blur then fix', async function() {
		await page.$eval('#required', (elem) => elem.focus());
		await page.$eval('#required', (elem) => elem.blur());
		await changeValue(page, '#required', 10);
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	// min = 20, max = 30
	// min-fraction-digits = 2, max-fraction-digits = 3
	[
		{ name: 'less than min', selector: '#min-value', value: 15 },
		{ name: 'more than min', selector: '#min-value', value: 25 },
		{ name: 'less than max', selector: '#max-value', value: 25 },
		{ name: 'more than max', selector: '#max-value', value: 35 },
		{ name: 'less than range', selector: '#min-max-value', value: 15 },
		{ name: 'within range', selector: '#min-max-value', value: 25 },
		{ name: 'more than range', selector: '#min-max-value', value: 35 },
		{ name: 'less than min fraction digits', selector: '#min-max-fraction-digits', value: 1 },
		{ name: 'more than max fraction digits round up', selector: '#min-max-fraction-digits', value: 1.2345 },
		{ name: 'more than max fraction digits round down', selector: '#min-max-fraction-digits', value: 1.2344 },
		{ name: 'within fraction digits', selector: '#min-max-fraction-digits', value: 1.23 },
		{ name: 'invalid value', selector: '#simple', value: 'hello123' },
		{ name: 'starts with numbers', selector: '#simple', value: '123hello' },
		{ name: 'more than thousand', selector: '#simple', value: 1234 }
	].forEach((testCase) => {
		it(testCase.name, async function() {
			await page.$eval(testCase.selector, (elem) => elem.focus());
			await changeValue(page, testCase.selector, testCase.value);
			await page.$eval(testCase.selector, (elem) => elem.blur());
			const rect = await visualDiff.getRect(page, testCase.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});
});
