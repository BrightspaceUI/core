import { focusWithKeyboard, resetFocus, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-switch-visibility', () => {

	const visualDiff = new VisualDiff('switch-visibility', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await visualDiff.createPage(browser);
	});

	beforeEach(async() => {
		await resetFocus(page);
	});

	after(async() => await browser.close());

	['ltr', 'rtl'].forEach(dir => {

		describe(dir, () => {

			before(async() => {
				await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch-visibility.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
				await page.bringToFront();
			});

			[
				{ name: 'off', selector: '#off' },
				{ name: 'on', selector: '#on' },
				{ name: 'off with conditions', selector: '#off-with-conditions' },
				{ name: 'on with conditions', selector: '#on-with-conditions' },
				{ name: 'on with conditions text position start', selector: '#on-with-conditions-text-position-start' },
				{ name: 'on text-position hidden', selector: '#on-text-position-hidden' },
				{ name: 'on with conditions text-position hidden', selector: '#on-with-conditions-text-position-hidden' },
				{ name: 'off text overridden', selector: '#off-text-overridden' },
				{ name: 'on text overridden', selector: '#on-text-overridden' },
				{ name: 'off with conditons text overridden', selector: '#off-with-conditions-text-overridden' },
				{ name: 'on with conditions text overridden', selector: '#on-with-conditions-text-overridden' },
				{ name: 'on with conditions text-position start text overridden', selector: '#on-with-conditions-text-position-start-text-overridden' },
				{ name: 'on text-position hidden text overridden', selector: '#on-text-position-hidden-text-overridden' },
				{ name: 'on with conditions text-position hidden text overridden', selector: '#on-with-conditions-text-position-hidden-text-overridden' },
				{ name: 'off with only whitespace conditions', selector: '#off-with-only-whitespace-conditions' },
				{ name: 'on with only whitespace conditions', selector: '#on-with-only-whitespace-conditions' },
				{ name: 'on with only lots of whitespace conditions', selector: '#on-with-only-lots-of-whitespace-conditions' },
				{ name: 'on with only loooots of whitespace conditions', selector: '#on-with-only-loooots-of-whitespace-conditions' }
			].forEach(info => {

				it(info.name, async function() {
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

			it('on with conditions and conditions focused', async function() {
				const selector = '#on-with-conditions';
				setTimeout(() => focusWithKeyboard(page, [selector, '#conditions-help']));
				await page.$eval(selector, async(elem) => {
					return new Promise((resolve) => {
						const conditionsHelpTooltip = elem.shadowRoot.querySelector('#conditions-help');
						conditionsHelpTooltip.addEventListener('d2l-tooltip-show', resolve);
					});
				});

				const rect = await visualDiff.getRect(page, selector);

				if (dir === 'rtl') {
					rect.x -= 120;
				}
				rect.width += 120;
				rect.height += 170;

				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect, captureBeyondViewport: false });
			});

		});

	});

});
