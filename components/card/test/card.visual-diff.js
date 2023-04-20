import { focusWithKeyboard, focusWithMouse, VisualDiff } from '@brightspace-ui/visual-diff';
import { open } from '../../dropdown/test/dropdown-helper.js';
import puppeteer from 'puppeteer';

describe('d2l-card', () => {

	const visualDiff = new VisualDiff('card', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 3700 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/card/test/card.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[
		{ name: 'header-content', selector: '#header-content' },
		{ name: 'footer', selector: '#footer' },
		{ name: 'align-center', selector: '#align-center' },
		{ name: 'badge', selector: '#badge' },
		{ name: 'actions', selector: '#actions' },
		{ name: 'actions-focus', selector: '#actions', action: (selector) => focusWithKeyboard(page, `${selector} > d2l-button-icon`) },
		{ name: 'actions-rtl', selector: '#actions-rtl' },
		{ name: 'no-link-focus', selector: '#header-content', action: (selector) => focusWithMouse(page, selector) },
		{ name: 'subtle', selector: '#subtle' },
		{ name: 'link', selector: '#link' },
		{ name: 'link-focus', selector: '#link', action: (selector) => focusWithMouse(page, selector) },
		{ name: 'link-actions-focus', selector: '#link', action: (selector) => focusWithKeyboard(page, `${selector} > d2l-button-icon`) },
		{ name: 'link-footer-focus', selector: '#link', action: (selector) => focusWithKeyboard(page, `${selector} > d2l-button`) },
		{ name: 'with-dropdown', selector: '#with-dropdown', margin: 20 },
		{ name: 'with-dropdown-open', selector: '#with-dropdown', margin: 20, action: (selector) => open(page, `${selector} d2l-dropdown-more`) },
		{ name: 'with-dropdown-adjacent-hover', selector: '#with-dropdown-adjacent-hover', margin: 20, action: async(selector) => {
			await open(page, `${selector} d2l-dropdown-more`);
			return page.hover(`${selector} #hover-target`);
		} },
		{ name: 'with-tooltip', selector: '#with-tooltip', margin: 20 },
		{ name: 'with-tooltip-focus', selector: '#with-tooltip', margin: 20, action: (selector) => focusWithKeyboard(page, `${selector} #shiny-button`) }
	].forEach((info) => {

		it(info.name, async function() {
			const rect = await visualDiff.getRect(page, info.selector, info.margin);
			if (info.action) await info.action(info.selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
