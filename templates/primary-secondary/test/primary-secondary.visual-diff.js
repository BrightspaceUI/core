import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-template-primary-secondary', () => {
	const visualDiff = new VisualDiff('primary-secondary', import.meta.url);

	let browser, page;

	const directions = Object.freeze({
		LEFT: 37,
		UP: 38,
		RIGHT: 39,
		DOWN: 40
	});

	async function moveDivider(page, selector, dir, steps) {
		return page.$eval(selector, (ele, dir, steps) => {
			const handle = ele.shadowRoot.querySelector('.d2l-template-primary-secondary-divider');
			const e = new KeyboardEvent('keydown', { keyCode: dir });
			for (let i = 0; i < steps; i += 1) {
				handle.dispatchEvent(e);
			}
		}, dir, steps);
	}

	async function getRect(page, selector) {
		return page.$eval(selector, (elem) => {
			const rect = elem.getBoundingClientRect();
			return {
				x: rect.x,
				y: rect.y,
				width: rect.width,
				height: rect.height
			};
		});
	}

	async function focusHandle(page, selector) {
		return focusWithKeyboard(page, [selector, '.d2l-template-primary-secondary-divider']);
	}

	describe('mobile', () => {

		before(async() => {
			browser = await puppeteer.launch({ headless: 'new' });
			page = await visualDiff.createPage(browser, { viewport: { width: 767, height: 2000 } });
			await page.goto(`${visualDiff.getBaseUrl()}/templates/primary-secondary/test/primary-secondary-mobile.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		after(async() => await browser.close());

		afterEach(async function() {
			const reset = this.currentTest.value;
			if (reset) {
				await moveDivider(page, reset.sel, reset.dir, reset.steps);
			}
		});

		[
			{ testName: 'default', options: {} },
			{ testName: 'focus', options: { focus: true } },
			{ testName: 'rtl', options: {} },
			{ testName: 'focus-rtl', options: { focus: true } },
			{ testName: 'expanded', options: { position: { dir: directions.UP, steps: 5 } } },
			{ testName: 'middle', options: { position: { dir: directions.UP, steps: 1 }, resetDir: directions.DOWN } },
			{ testName: 'collapsed', options: { position: { dir: directions.DOWN, steps: 5 } } },
			{ testName: 'hidden-footer', options: {} },
			{ testName: 'hidden-footer-expanded', options: { position: { dir: directions.UP, steps: 5 } } },
			{ testName: 'hidden-footer-collapsed', options: { position: { dir: directions.DOWN, steps: 5 } } },
			{ testName: 'short-content', options: {} },
		].forEach((test) => {
			it(test.testName, async function() {
				await page.bringToFront();
				const sel = `#${test.testName}`;
				if (test.options.position) {
					const pos = test.options.position;
					await moveDivider(page, sel, pos.dir, pos.steps);
					if (test.options.resetDir) { // Needed for retries
						this.test.value = { sel: sel, dir: test.options.resetDir, steps: pos.steps };
					}
				}
				if (test.options.focus) {
					await focusHandle(page, sel);
				}
				const rect = await getRect(page, sel);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('desktop', () => {

		before(async() => {
			browser = await puppeteer.launch({ headless: 'new' });
			page = await visualDiff.createPage(browser, { viewport: { width: 1500, height: 4000 } });
			await page.goto(`${visualDiff.getBaseUrl()}/templates/primary-secondary/test/primary-secondary-desktop.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		after(async() => await browser.close());

		[
			{ testName: 'fixed', options: {} },
			{ testName: 'fixed-secondary-first', options: {} },
			{ testName: 'resizable', options: {} },
			{ testName: 'expanded', options: { position: { dir: directions.LEFT, steps: 10 } } },
			{ testName: 'collapsed', options: { position: { dir: directions.RIGHT, steps: 5 } } },
			{ testName: 'focus', options: { focus: true } },
			{ testName: 'focus-expanded', options: { focus: true, position: { dir: directions.LEFT, steps: 10 } } },
			{ testName: 'focus-expanded-rtl', options: { focus: true, position: { dir: directions.RIGHT, steps: 10 } } },
			{ testName: 'focus-expanded-secondary-first', options: { focus: true, position: { dir: directions.RIGHT, steps: 10 } } },
			{ testName: 'focus-expanded-rtl-secondary-first', options: { focus: true, position: { dir: directions.LEFT, steps: 10 } } },
			{ testName: 'focus-collapsed', options: { focus: true, position: { dir: directions.RIGHT, steps: 5 } } },
			{ testName: 'focus-collapsed-rtl', options: { focus: true, position: { dir: directions.LEFT, steps: 5 } } },
			{ testName: 'focus-collapsed-secondary-first', options: { focus: true, position: { dir: directions.LEFT, steps: 5 } } },
			{ testName: 'focus-collapsed-rtl-secondary-first', options: { focus: true, position: { dir: directions.RIGHT, steps: 5 } } },
			{ testName: 'background-shading-primary', options: {} },
			{ testName: 'background-shading-primary-rtl', options: {} },
			{ testName: 'background-shading-secondary', options: {} },
			{ testName: 'background-shading-secondary-rtl', options: {} },
			{ testName: 'hidden-footer', options: {} },
			{ testName: 'width-fullscreen', options: {} },
			{ testName: 'width-normal', options: {} },
			{ testName: 'width-normal-collapsed', options: { focus: true, position: { dir: directions.RIGHT, steps: 5 } } },
			{ testName: 'short-content', options: {} },
		].forEach((test) => {
			it(test.testName, async function() {
				await page.bringToFront();
				const sel = `#${test.testName}`;
				if (test.options.position) {
					const pos = test.options.position;
					await moveDivider(page, sel, pos.dir, pos.steps);
				}
				if (test.options.focus) {
					await focusHandle(page, sel);
				}
				const rect = await getRect(page, sel);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	describe('persist', () => {

		before(async() => {
			browser = await puppeteer.launch({ headless: 'new' });
			page = await visualDiff.createPage(browser, { viewport: { width: 1500, height: 300 } });
			await page.goto(`${visualDiff.getBaseUrl()}/templates/primary-secondary/test/primary-secondary-persist.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		after(async() => await browser.close());

		it('persist divider size on reload', async function() {
			await page.bringToFront();
			const sel = '#persist';

			await moveDivider(page, sel, directions.RIGHT, 10);

			await page.reload();

			const rect = await getRect(page, sel);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	describe('stacking', () => {

		before(async() => {
			browser = await puppeteer.launch({ headless: 'new' });
			page = await visualDiff.createPage(browser, { viewport: { width: 1000, height: 1000 } });
			await page.goto(`${visualDiff.getBaseUrl()}/templates/primary-secondary/test/primary-secondary-stacking.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		after(async() => await browser.close());

		[
			{ testName: 'opt-in', options: {} },
		].forEach((test) => {
			it(test.testName, async function() {
				const rect = await getRect(page, '#opt-in');
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

});
