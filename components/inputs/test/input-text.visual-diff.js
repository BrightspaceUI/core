import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-input-text', () => {

	const visualDiff = new VisualDiff('input-text', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 3600 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-text.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	['wc', 'sass'].forEach((type) => {
		[
			'basic',
			'email',
			'number',
			'password',
			'search',
			'tel',
			'url',
			'disabled',
			'placeholder',
			'placeholder-disabled',
			'invalid',
			'invalid-disabled',
			'aria-invalid',
			'aria-invalid-disabled'
		].forEach((name) => {
			const id = `${type}-${name}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
			if (name.indexOf('disabled') === -1) {
				it(`${id}-focus`, async function() {
					await focusWithKeyboard(page, `#${id}`);
					const rect = await visualDiff.getRect(page, `#${id}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			}
		});
	});

	[
		{ name: 'wc-labelled', selector: '#wc-labelled' },
		{ name: 'wc-labelled-focus', selector: '#wc-labelled', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'wc-labelled-skeleton', selector: '#wc-labelled', action: selector => page.$eval(selector, elem => elem.skeleton = true) },
		{ name: 'wc-label-hidden', selector: '#wc-label-hidden' },
		{ name: 'wc-label-hidden-skeleton', selector: '#wc-label-hidden', action: selector => page.$eval(selector, elem => elem.skeleton = true) },
		{ name: 'wc-required', selector: '#wc-required' },
		{ name: 'wc-required-skeleton', selector: '#wc-required', action: selector => page.$eval(selector, elem => elem.skeleton = true) },
		{ name: 'wc-custom-width-skeleton', selector: '#wc-custom-width', action: selector => page.$eval(selector, elem => elem.skeleton = true) },
		{ name: 'wc-overflowing', selector: '#wc-overflowing' },
		{ name: 'wc-unit', selector: '#wc-unit' },
		{ name: 'wc-unit-rtl', selector: '#wc-unit-rtl' },
		{ name: 'wc-unit-disabled', selector: '#wc-unit-disabled' },
		{ name: 'wc-unit-invalid', selector: '#wc-unit-invalid' },
		{ name: 'wc-unit-invalid-focus', selector: '#wc-unit-invalid', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'wc-unit-invalid-rtl', selector: '#wc-unit-invalid-rtl' },
		{ name: 'wc-unit-invalid-rtl-focus', selector: '#wc-unit-invalid-rtl', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'wc-unit-init-hidden', selector: '#wc-unit-init-hidden', action: selector => page.$eval(selector, elem => elem.style.display = 'inline-block') },
		{ name: 'wc-unit-change', selector: '#wc-unit-change', action: selector => page.$eval(selector, async(elem) => { elem.unit = '/5000'; await elem.updateComplete;}) },
		{ name: 'wc-override-height', selector: '#wc-override-height' },
		{ name: 'wc-override-padding', selector: '#wc-override-padding' },
		{ name: 'wc-override-text-align', selector: '#wc-override-text-align' },
		{ name: 'wc-icon-left', selector: '#wc-icon-left' },
		{ name: 'wc-icon-left-rtl', selector: '#wc-icon-left-rtl' },
		{ name: 'wc-icon-right', selector: '#wc-icon-right' },
		{ name: 'wc-icon-right-rtl', selector: '#wc-icon-right-rtl' },
		{ name: 'wc-icon-left-label', selector: '#wc-icon-left-label' },
		{ name: 'wc-icon-right-label', selector: '#wc-icon-right-label' },
		{ name: 'wc-icon-left-right', selector: '#wc-icon-left-right' },
		{ name: 'wc-button-icon-left', selector: '#wc-button-icon-left' },
		{ name: 'wc-button-icon-right', selector: '#wc-button-icon-right' },
		{ name: 'wc-icon-right-invalid', selector: '#wc-icon-right-invalid' },
		{ name: 'wc-icon-right-invalid-focus', selector: '#wc-icon-right-invalid', action: selector => focusWithKeyboard(page, selector) },
		{ name: 'wc-icon-right-invalid-rtl', selector: '#wc-icon-right-invalid-rtl' },
		{ name: 'wc-icon-right-invalid-rtl-focus', selector: '#wc-icon-right-invalid-rtl', action: selector => focusWithKeyboard(page, selector) }
	].forEach(info => {

		it(info.name, async function() {
			if (info.action) await info.action(info.selector);
			const rect = await visualDiff.getRect(page, info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
