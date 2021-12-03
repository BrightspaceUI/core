import { getRect, open, reset } from './input-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-input-time', () => {

	const visualDiff = new VisualDiff('input-time', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 650, height: 800 } });
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
			await page.$eval('#opened', (elem) => elem.removeAttribute('opened'));
			await page.$eval('#opened-disabled', (elem) => elem.removeAttribute('disabled'));
			const rect = await getRect(page, '#opened-disabled');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('opened-skeleton remove skeleton', async function() {
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
						input.addEventListener('d2l-localize-behavior-language-changed', () => {
							input.addEventListener('d2l-input-time-hidden-content-width-change', () => input.updateComplete.then(setTimeout(resolve, timeout)));
						}, { once: true });
						document.querySelector('html').setAttribute('lang', lang);
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
		});

		it('dropdown open top', async function() {
			await open(page, '#dropdown');
			const rect = await getRect(page, '#dropdown');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
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
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('dropdown open click', async function() {
			await page.$eval('#dropdown', (elem) => {
				elem.focus();
				const input = elem.shadowRoot.querySelector('input');
				const e = new Event(
					'mouseup',
					{ bubbles: true, composed: true }
				);
				input.dispatchEvent(e);
			});
			const rect = await getRect(page, '#dropdown');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('dropdown open enforce-time-intervals', async function() {
			await page.$eval('#enforce', (elem) => elem.skeleton = false);
			await open(page, '#enforce');
			const rect = await getRect(page, '#enforce');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#enforce'); // Make sure the dropdown is closed before the next test
		});

		it('mobile layout', async function() {
			await page.setViewport({ width: 300, height: 600 });
			await open(page, '#dropdown-mobile');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
			await reset(page, '#dropdown-mobile');
		});

	});

	it('focus', async function() {
		await page.$eval('#basic', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		await reset(page, '#basic');
	});

});
