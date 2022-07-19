/*global forceFocusVisible */
import { getRect, show } from './tooltip-helper.js';
import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe.skip('d2l-tooltip-help', () => {

	const visualDiff = new VisualDiff('tooltip-help', import.meta.url);
	const tooltipHelpSelector = '#help-tooltip-basic';

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
				await page.$eval(tooltipHelpSelector, (elem) => forceFocusVisible(elem));
			}
			if (testCase.hover) {
				await page.hover(tooltipHelpSelector);
			}
			if (testCase.click) {
				await page.click(tooltipHelpSelector);
			}

			if (testCase.focus || testCase.hover || testCase.click) {
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

	[
		'help-tooltip-in-sentence',
		'help-tooltip-in-paragraph',
	].forEach((testName) => {

		it(testName, async function() {
			const selector = `#${testName}`;
			const openEvent = page.$eval(`${selector} d2l-tooltip-help`, async(elem) => {
				return new Promise((resolve) => {
					elem.addEventListener('d2l-tooltip-show', resolve);
				});
			});

			await page.$eval(`${selector} d2l-tooltip-help`, (elem) => forceFocusVisible(elem));
			await openEvent;

			const rect = await visualDiff.getRect(page, selector);
			rect.x -= 10;
			rect.width += 120;
			rect.height += 70;
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
