import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-switch-visibility', () => {

	const visualDiff = new VisualDiff('switch-visibility', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
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
				{ name: 'on with conditions', selector: '#on-with-conditions' }
			].forEach(info => {

				it(info.name, async function() {
					const rect = await visualDiff.getRect(page, info.selector);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

			});

			it('on with conditions and conditions focused', async function() {
				const selector = '#on-with-conditions';
				await page.$eval(selector, (elem) => elem.shadowRoot.querySelector('#conditions-help').focus());

				const rect = await visualDiff.getRect(page, selector);

				if (dir === 'rtl') {
					rect.x -= 120;
				}
				rect.width += 120;
				rect.height += 170;

				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});

	});

});
