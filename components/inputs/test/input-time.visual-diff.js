import { getRect, open, reset } from './input-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-input-time', () => {

	const visualDiff = new VisualDiff('input-time', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 300, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-time.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
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
			'ja',
			'ko',
			'nl',
			'pt',
			'sv',
			'zh',
			'tr',
			'zh-tw'
		].forEach((lang) => {

			it(`${lang} AM`, async function() {
				await page.evaluate(lang => {
					const input = document.querySelector('#localizationAM');
					return new Promise((resolve) => {
						input.addEventListener('d2l-localize-behavior-language-changed', () => {
							input.addEventListener('d2l-input-time-hidden-content-width-change', () => input.updateComplete.then(setTimeout(resolve, 200)));
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

		it('dropdown open enforce-time-intervals', async function() {
			await page.$eval('#enforce', (elem) => elem.skeleton = false);
			await open(page, '#enforce');
			const rect = await getRect(page, '#enforce');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#enforce'); // Make sure the dropdown is closed before the next test
		});

	});

	it('focus', async function() {
		await page.$eval('#basic', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		await reset(page, '#basic');
	});

});
