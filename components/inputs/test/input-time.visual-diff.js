import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import { getRect, open, reset } from './input-helper.js';
import puppeteer from 'puppeteer';

describe('d2l-input-time', () => {

	const visualDiff = new VisualDiff('input-time', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 650, height: 1100 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-time.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();

		// #opened being opened causes issues with focus with other time inputs being opened.
		// Putting this first in case tests are run in isolation.
		await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
	});

	after(async() => await browser.close());

	[
		'disabled',
		'enforce',
		'labelled',
		'label-hidden',
		'required'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it(`${name}-skeleton`, async function() {
			await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('focus', async function() {
		await focusWithKeyboard(page, '#basic');
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		await reset(page, '#basic');
	});

	describe('opened behavior', () => {

		before(async() => {
			await page.reload();
			await page.$eval('#opened', async(elem) => await elem.updateComplete);
		});

		after(async() => {
			await page.$eval('#opened-skeleton', (elem) => elem.removeAttribute('opened'));
		});

		it('opened-disabled', async function() {
			await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
			const rect = await visualDiff.getRect(page, '#opened-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton', async function() {
			const rect = await visualDiff.getRect(page, '#opened-skeleton');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-disabled remove disabled', async function() {
			// Needed for retries
			await page.reload();
			await page.$eval('#opened', async(elem) => await elem.updateComplete);

			await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('disabled'));
			const rect = await getRect(page, '#opened-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton remove skeleton', async function() {
			// Needed for retries
			await page.reload();
			await page.$eval('#opened', async(elem) => await elem.updateComplete);
			await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));

			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('opened'));
			await page.$eval('#opened-skeleton', (elem) => elem.removeAttribute('skeleton'));
			const rect = await getRect(page, '#opened-skeleton');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('localization', () => {

		after(async() => {
			await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
		});

		[
			'ar',
			'da',
			'de',
			'es',
			'fr',
			'nl',
			'pt',
			'sv',
			'zh',
			'tr'
		].forEach((lang) => {

			it(`${lang} AM`, async function() {
				await page.evaluate(lang => {
					const input = document.querySelector('#localizationAM');
					const timeout = lang === 'da' ? 1000 : 100;
					return new Promise((resolve) => {
						if (document.querySelector('html').getAttribute('lang') !== lang) { // Needed for retries
							input.addEventListener('d2l-localize-resources-change', () => {
								input.addEventListener('d2l-input-time-hidden-content-width-change', () => input.updateComplete.then(setTimeout(resolve, timeout)));
							}, { once: true });
							document.querySelector('html').setAttribute('lang', lang);
						} else {
							resolve();
						}
					});
				}, lang);

				const rect = await visualDiff.getRect(page, '#localizationAM');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

			it(`${lang} PM`, async function() {
				const rect = await visualDiff.getRect(page, '#localizationPM');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('open behavior', () => {

		afterEach(async() => {
			await reset(page, '#dropdown');
			await reset(page, '#enforce');
		});

		it.skip('dropdown open top', async function() {
			await page.reload(); // Needed for retries
			await page.$eval('#opened', async(elem) => { elem.removeAttribute('opened'); await elem.updateComplete; }); // Needed for retries

			await open(page, '#dropdown');
			await page.waitForTimeout(100);
			const rect = await getRect(page, '#dropdown');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('dropdown open keydown top', async function() {
			await page.$eval('#dropdown', (elem) => {
				const input = elem.shadowRoot.querySelector('input');
				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 13;
				input.dispatchEvent(eventObj);
			});
			const rect = await getRect(page, '#dropdown');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('dropdown open click', async function() {
			await focusWithKeyboard(page, '#dropdown');
			await page.$eval('#dropdown', (elem) => {
				const input = elem.shadowRoot.querySelector('input');
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await getRect(page, '#dropdown');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});

		it('dropdown open enforce-time-intervals', async function() {
			await page.$eval('#enforce', (elem) => elem.skeleton = false);
			await open(page, '#enforce');
			await page.waitForTimeout(100);
			const rect = await getRect(page, '#enforce');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { captureBeyondViewport: false, clip: rect });
		});
	});
});
