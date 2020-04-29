const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');
const helper = require('./input-helper.js');

describe('d2l-input-date', () => {

	const visualDiff = new VisualDiff('input-date', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 800, height: 900}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
		await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
	});

	after(async() => await browser.close());

	[
		'basic',
		'disabled',
		'empty-text',
		'labelled',
		'label-hidden',
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

	it('empty-text-focus', async function() {
		await page.$eval('#empty-text', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#empty-text');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('localization', () => {

		after(async() => {
			await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
		});

		[
			'ar',
			'da',
			'de',
			'en',
			'es',
			'fr',
			'ja',
			'ko',
			'nl',
			'pt',
			'sv',
			'tr',
			'zh',
			'zh-tw'
		].forEach((lang) => {
			it(`${lang} empty`, async function() {
				await page.evaluate(lang => document.querySelector('html').setAttribute('lang', lang), lang);
				const rect = await visualDiff.getRect(page, '#no-value');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`${lang} value`, async function() {
				await page.evaluate(lang => document.querySelector('html').setAttribute('lang', lang), lang);
				const rect = await visualDiff.getRect(page, '#basic');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('calendar dropdown', () => {
		before(async() => {
			await page.reload();
		});

		afterEach(async() => {
			await helper.reset(page, '#basic');
		});

		it('disabled does not open', async function() {
			await page.$eval('#disabled', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await helper.getRect(page, '#disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with value', async function() {
			await helper.open(page, '#basic');
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('tab on open', async function() {
			await helper.open(page, '#basic');
			await page.keyboard.press('Tab');
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('click date', async function() {
			await helper.open(page, '#basic');
			await page.$eval('#basic', (elem) => {
				const calendar = elem.shadowRoot.querySelector('d2l-calendar');
				const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
				date.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('set to today', async function() {
			await page.$eval('#basic', (elem) => {
				const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Set to Today"]');
				button.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('clear', async function() {
			await page.$eval('#basic', (elem) => {
				const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]');
				button.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opens then changes month then closes then reopens', async function() {
			// open
			await helper.open(page, '#basic');

			// change month
			await page.$eval('#basic', (elem) => {
				const calendar = elem.shadowRoot.querySelector('d2l-calendar');
				const button = calendar.shadowRoot.querySelector('d2l-button-icon[text="Show January"]');
				button.click();
			});

			// close
			await helper.reset(page, '#basic');

			// re-open
			await helper.open(page, '#basic');

			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with click after text input', async function() {
			await page.$eval('#basic', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = '01/10/2030';
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with click after empty text input', async function() {
			await page.$eval('#basic', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = '';
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with enter after text input', async function() {
			await page.$eval('#basic', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = '11/21/2031';
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 13;
				input.dispatchEvent(eventObj);
			});
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with enter after empty text input', async function() {
			await page.$eval('#basic', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = '';
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 13;
				input.dispatchEvent(eventObj);
			});
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with down arrow after text input', async function() {
			await page.$eval('#basic', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = '08/30/2032';
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 40;
				input.dispatchEvent(eventObj);
			});
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with down arrow after empty text input', async function() {
			await page.$eval('#basic', (elem) => {
				const input = elem.shadowRoot.querySelector('d2l-input-text');
				input.value = '';
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 40;
				input.dispatchEvent(eventObj);
			});
			const rect = await helper.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('open with placeholder', async function() {
			await helper.open(page, '#no-value');
			const rect = await helper.getRect(page, '#no-value');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await helper.reset(page, '#no-value');
		});
	});

});
