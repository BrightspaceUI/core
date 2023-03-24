import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-tabs', () => {

	const visualDiff = new VisualDiff('tabs', import.meta.url);

	let browser, page;

	const focusTabs = async(selector) => {
		await focusWithKeyboard(page, selector);
		await page.evaluate(() => {
			new Promise(resolve => requestAnimationFrame(resolve));
		});
	};

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 2000 } });
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(async() => await browser.close());

	describe('basic', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/tabs/test/tabs.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		it('no panel selected', async function() {
			const rect = await visualDiff.getRect(page, '#no-panel-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('panel selected', async function() {
			const rect = await visualDiff.getRect(page, '#panel-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('one tab', async function() {
			const rect = await visualDiff.getRect(page, '#one-tab');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('non-selected tab focus', async function() {
			await focusTabs('#no-panel-selected');
			await page.keyboard.press('ArrowRight');
			const rect = await visualDiff.getRect(page, '#no-panel-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selected tab focus', async function() {
			await focusTabs('#panel-selected');
			const rect = await visualDiff.getRect(page, '#panel-selected');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('action slot', async function() {
			const rect = await visualDiff.getRect(page, '#action-slot');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('no padding', async function() {
			const rect = await visualDiff.getRect(page, '#no-padding');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('overflow', () => {

		['ltr', 'rtl'].forEach((dir) => {

			describe(dir, () => {

				before(async() => {
					await page.goto(`${visualDiff.getBaseUrl()}/components/tabs/test/tabs.visual-diff.html?dir=${dir}`, { waitUntil: ['networkidle0', 'load'] });
					await page.bringToFront();
				});

				it('scroll next', async function() {
					const rect = await visualDiff.getRect(page, '#scroll-next');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('scrolls next on click', async function() {
					await page.$eval('#scroll-next', (elem) => {
						elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button').click();
					});
					const rect = await visualDiff.getRect(page, '#scroll-next');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('scroll previous', async function() {
					const rect = await visualDiff.getRect(page, '#scroll-previous');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('scrolls previous on click', async function() {
					await page.$eval('#scroll-previous', (elem) => {
						elem.shadowRoot.querySelector('.d2l-tabs-scroll-previous-container button').click();
					});
					const rect = await visualDiff.getRect(page, '#scroll-previous');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('action slot', async function() {
					const rect = await visualDiff.getRect(page, '#overflow-action-slot');
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus next', async function() {
					const rect = await visualDiff.getRect(page, '#focus-next');
					await focusWithKeyboard(page, ['#focus-next', '.d2l-tabs-scroll-next-container > button']);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});

				it('focus previous', async function() {
					const rect = await visualDiff.getRect(page, '#focus-previous');
					await focusWithKeyboard(page, ['#focus-previous', '.d2l-tabs-scroll-previous-container > button']);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});

		});

	});

	describe('max-to-show', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/tabs/test/tabs.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		it('initial', async function() {
			const rect = await visualDiff.getRect(page, '#max-to-show');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('expands on focus to overflow', async function() {
			await focusTabs('#max-to-show-expand-focus');
			await page.keyboard.press('ArrowRight');
			const rect = await visualDiff.getRect(page, '#max-to-show-expand-focus');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('expands on scroll next click', async function() {
			await focusTabs('#max-to-show-expand-click');
			await page.$eval('#max-to-show-expand-click', (elem) => {
				elem.shadowRoot.querySelector('.d2l-tabs-scroll-next-container button').click();
			});
			const rect = await visualDiff.getRect(page, '#max-to-show-expand-click');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

	describe('keyboard', () => {

		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/tabs/test/tabs.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		it('focuses next on right arrow', async function() {
			await focusTabs('#keyboard');
			await page.keyboard.press('ArrowRight');
			const rect = await visualDiff.getRect(page, '#keyboard');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focuses previous on left arrow', async function() {
			await focusTabs('#keyboard');
			await page.keyboard.press('ArrowLeft');
			const rect = await visualDiff.getRect(page, '#keyboard');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focuses first on right arrow from last', async function() {
			await focusTabs('#keyboard');
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('ArrowRight');
			const rect = await visualDiff.getRect(page, '#keyboard');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('focuses last on left arrow from first', async function() {
			await focusTabs('#keyboard');
			await page.keyboard.press('ArrowLeft');
			await page.keyboard.press('ArrowLeft');
			const rect = await visualDiff.getRect(page, '#keyboard');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selects on space', async function() {
			await focusTabs('#keyboard-space');
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('Space');
			const rect = await visualDiff.getRect(page, '#keyboard-space');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it('selects on enter', async function() {
			await focusTabs('#keyboard-enter');
			await page.keyboard.press('ArrowRight');
			await page.keyboard.press('Enter');
			const rect = await visualDiff.getRect(page, '#keyboard-enter');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

	});

});
