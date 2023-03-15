import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-input-percent', () => {
	const visualDiff = new VisualDiff('input-percent', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 800 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-percent.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
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
		'after-slot'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('simple focus', async function() {
		await focusWithKeyboard(page, '#simple');
		const rect = await visualDiff.getRect(page, '#simple');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('invalid no focus', async function() {
		await page.$eval('#required', (elem) => elem.validate());
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('invalid focus', async function() {
		await focusWithKeyboard(page, '#required');
		const rect = await visualDiff.getRect(page, '#required-container');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('invalid focus then fix then blur', async function() {
		await focusWithKeyboard(page, '#required');
		await changeValue(page, '#required', 10);
		await page.$eval('#required', (elem) => elem.blur());
		const rect = await visualDiff.getRect(page, '#required');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('skeleton', () => {
		[
			'simple',
			'label-hidden',
			'required',
			'disabled',
			'after-slot',
			'custom-width'
		].forEach((name) => {
			it(name, async function() {
				await page.$eval(`#${name}`, (elem) => elem.skeleton = true);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
