import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import { getRect, show } from './tooltip-helper.js';
import puppeteer from 'puppeteer';

describe('d2l-tooltip-help', () => {

	const visualDiff = new VisualDiff('tooltip-help', import.meta.url);
	const tooltipHelpSelector = '#help-tooltip-basic';
	const tooltipHelpSelectorSkeleton = '#help-tooltip-skeleton';

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);

		await page.goto(`${visualDiff.getBaseUrl()}/components/tooltip/test/tooltip-help.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	afterEach(async() => {
		await page.reload();
	});

	after(async() => await browser.close());

	[
		{ case: 'help tooltip hidden' },
		{ case: 'help tooltip hovered and focused', hover: true, focus: true },
		{ case: 'help tooltip hovered', hover: true },
		{ case: 'help tooltip focused', focus: true },
		{ case: 'help tooltip clicked', click: true }
	].forEach((testCase) => {

		it(testCase.case, async function() {
			const openEvent = page.$eval(tooltipHelpSelector, async(elem) => {
				return new Promise((resolve) => {
					elem.addEventListener('d2l-tooltip-show', resolve);
				});
			});

			if (testCase.focus) {
				await focusWithKeyboard(page, tooltipHelpSelector);
			}
			if (testCase.hover) {
				await page.hover(tooltipHelpSelector);
				if (!testCase.focus) {
					await openEvent;
				}
			}
			if (testCase.click) {
				await page.click(tooltipHelpSelector);
				await openEvent;
			}

			const rect = await getRect(page, tooltipHelpSelector, true);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'help-tooltip-unordered-list',
		'help-tooltip-ordered-list',
	].forEach((testName) => {

		it(testName, async function() {
			const selector = `#${testName}`;
			await show(page, selector, true);

			const rect = await getRect(page, selector, true);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('d2l-tooltip-help inherit-font-style', () => {

		[
			{ case: 'help-tooltip-in-sentence', lang: 'en' },
			{ case: 'help-tooltip-in-paragraph', lang: 'en' },
			{ case: 'help-tooltip-in-sentence', lang: 'ar' }
		].forEach((testCase) => {

			after(async() => {
				await page.evaluate(() => document.querySelector('html').setAttribute('lang', 'en'));
			});

			it(`${testCase.case} ${testCase.lang}`, async function() {
				await page.evaluate((lang) => document.querySelector('html').setAttribute('lang', lang), testCase.lang);

				const selector = `#${testCase.case}`;
				const openEvent = page.$eval(`${selector} d2l-tooltip-help`, async(elem) => {
					return new Promise((resolve) => {
						elem.addEventListener('d2l-tooltip-show', resolve);
					});
				});

				await focusWithKeyboard(page, `${selector} d2l-tooltip-help`);
				await openEvent;

				const rect = await visualDiff.getRect(page, selector);
				rect.x -= 10;
				rect.width += 120;
				rect.height += 70;
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});

		});
	});

	[
		{ case: 'help tooltip skeleton' },
		{ case: 'help tooltip skeleton and hovered', hover: true },
		{ case: 'help tooltip skeleton and focused', focus: true },
		{ case: 'help tooltip skeleton and hovered and focused', hover: true, focus: true }
	].forEach((testCase) => {

		it(testCase.case, async function() {

			if (testCase.focus) {
				await focusWithKeyboard(page, tooltipHelpSelectorSkeleton);
			}
			if (testCase.hover) {
				await page.hover(tooltipHelpSelectorSkeleton);
			}

			const rect = await visualDiff.getRect(page, tooltipHelpSelectorSkeleton);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

});
