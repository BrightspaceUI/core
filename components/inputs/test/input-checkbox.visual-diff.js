import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-input-checkbox', () => {

	const visualDiff = new VisualDiff('input-checkbox', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 1600 } });
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-checkbox.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	['wc', 'skeleton', 'sass'].forEach((type) => {
		['default', 'disabled'].forEach((state) => {
			const states = ['checked', 'unchecked'];
			if (type === 'wc') {
				states.push('indeterminate');
			}
			states.forEach((checked) => {
				const id = `${type}-${state}-${checked}`;
				it(id, async function() {
					const rect = await visualDiff.getRect(page, `#${id}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
				if (state !== 'disabled') {
					it(`${id}-focus`, async function() {
						await focusWithKeyboard(page, `#${id}`);
						const rect = await visualDiff.getRect(page, `#${id}`);
						await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
					});
				}
			});
		});
	});

	[
		'multiline',
		'multiline-unbreakable',
		'hidden-label',
		'spacer'
	].forEach((type) => {
		['', '-rtl'].forEach((dir) => {
			const id = `wc-${type}${dir}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
