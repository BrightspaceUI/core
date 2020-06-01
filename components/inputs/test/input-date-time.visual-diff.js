const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date-time', () => {

	const visualDiff = new VisualDiff('input-date-time', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 800, height: 900}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date-time.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'labelled',
		'invalid-value',
		'no-value'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('basic-focus', async function() {
		await page.$eval('#basic', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('functionality', () => {
		it('change time', async function() {
			await page.$eval('#basic', (elem) => {
				elem.blur();
				const timeSelector = elem.shadowRoot.querySelector('d2l-input-time');
				timeSelector.value = '15:22:00';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				timeSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('change date', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '2020-12-15';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('clear date', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('select date after clear', async function() {
			await page.$eval('#basic', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				dateSelector.value = '2018-01-20';
				const e = new Event(
					'change',
					{ bubbles: true, composed: true }
				);
				dateSelector.dispatchEvent(e);
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with min and max with enter', async function() {
			await page.$eval('#min-max', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				const input = dateSelector.shadowRoot.querySelector('d2l-input-text');
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 13;
				input.dispatchEvent(eventObj);
			});

			const rect = await page.$eval('#min-max', (elem) => {
				const dateSelector = elem.shadowRoot.querySelector('d2l-input-date');
				const content = dateSelector.shadowRoot.querySelector('[dropdown-content]');
				const opener = content.__getOpener();
				const contentWidth = content.shadowRoot.querySelector('.d2l-dropdown-content-width');
				const openerRect = opener.getBoundingClientRect();
				const contentRect = contentWidth.getBoundingClientRect();
				const x = Math.min(openerRect.x, contentRect.x);
				const y = Math.min(openerRect.y, contentRect.y);
				const width = Math.max(openerRect.right, contentRect.right) - x;
				const height = Math.max(openerRect.bottom, contentRect.bottom) - y;
				return {
					x: x - 10,
					y: y - 10,
					width: width + 20,
					height: height + 20
				};
			});
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
