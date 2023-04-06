import { focusWithKeyboard, focusWithMouse, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-button-move', () => {

	const visualDiff = new VisualDiff('button-move', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 600, height: 2000 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-move.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	[ 'normal', 'dark' ].forEach(category => {

		describe(category, () => {

			[
				{ name: 'normal', selector: `#${category}-normal` },
				{ name: 'hover', selector: `#${category}-normal`, action: selector => page.hover(selector) },
				{ name: 'keyboard-focus', selector: `#${category}-normal`, action: selector => focusWithKeyboard(page, selector) },
				{ name: 'mouse-focus', selector: `#${category}-normal`, action: selector => focusWithMouse(page, selector) },
				{ name: 'disabled', selector: `#${category}-disabled` },
				{ name: 'disabled-up', selector: `#${category}-disabled-up` },
				{ name: 'disabled-down', selector: `#${category}-disabled-down` },
				{ name: 'disabled-up-hover', selector: `#${category}-disabled-up`, action: selector => page.hover(selector) },
				{ name: 'disabled-up-keyboard-focus', selector: `#${category}-disabled-up`, action: selector => focusWithKeyboard(page, selector) },
				{ name: 'disabled-up-mouse-focus', selector: `#${category}-disabled-up`, action: selector => focusWithMouse(page, selector) },
				{ name: 'disabled-tooltip', selector: `#${category}-disabled-tooltip`, action: selector => focusWithKeyboard(page, `${selector} d2l-button-move`) }
			].forEach(info => {

				it(info.name, async function() {
					if (info.action) await info.action(info.selector);
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});

		});

	});

});
