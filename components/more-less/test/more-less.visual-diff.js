import { focusWithKeyboard, VisualDiff } from '@brightspace-ui/visual-diff';
import puppeteer from 'puppeteer';

describe('d2l-more-less', () => {

	const visualDiff = new VisualDiff('more-less', import.meta.url);

	let browser, page;

	const contentResize = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.shadowRoot.querySelector('.d2l-more-less-content').addEventListener('transitionend', (e) => {
					if (e.propertyName === 'max-height') resolve();
				});
			});
		}, selector);
	};

	const click = async(page, selector) => {
		const resize = contentResize(page, selector);
		await page.evaluate((selector) => {
			document.querySelector(selector).shadowRoot.querySelector('d2l-button-subtle').click();
		}, selector);
		return resize;
	};

	const reset = async(page, selector, expanded) => {
		const shouldToggle = await page.evaluate((selector, expanded) => {
			const moreLess = document.querySelector(selector);
			return moreLess.expanded !== expanded;
		}, selector, expanded);

		if (shouldToggle) await click(page, selector);
	};

	before(async() => {
		browser = await puppeteer.launch({ headless: 'new' });
		page = await browser.newPage();
		await visualDiff.disableAnimations(page);
		await page.setViewport({ width: 800, height: 1100, deviceScaleFactor: 2 });
		await page.goto(`${visualDiff.getBaseUrl()}/components/more-less/test/more-less.visual-diff.html`, { waitUntil: ['networkidle0', 'load'] });
		await page.bringToFront();
	});

	after(async() => await browser.close());

	afterEach(async function() {
		if (this.currentTest.value) {
			await page.$eval('#expanded', async(elem, previousText) => { // Reset more-less text
				const p = elem.querySelector('p');
				p.textContent = previousText;
			}, this.currentTest.value);
			await click(page, '#expanded'); // Retrigger height calculation
		}
		await reset(page, '#collapsed', false);
		await reset(page, '#expanded', true);
		await reset(page, '#auto-expand', false);
		await visualDiff.resetFocus(page);
	});

	it('collapsed', async function() {
		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('expands on click', async function() {
		await click(page, '#collapsed');
		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('expanded', async function() {
		const rect = await visualDiff.getRect(page, '#expanded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('collapses on click', async function() {
		await click(page, '#expanded');
		const rect = await visualDiff.getRect(page, '#expanded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('grows with content when expanded', async function() {
		const resize = contentResize(page, '#expanded');
		this.test.value = await page.evaluate(() => {
			const elem = document.querySelector('#expanded').querySelector('p');
			const previousText = elem.textContent;
			elem.textContent += 'Some content appended after component first render.';
			return previousText;
		});
		await resize;
		const rect = await visualDiff.getRect(page, '#expanded');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('does not grow with content when collapsed', async function() {
		await page.evaluate(() => {
			const elem = document.querySelector('#collapsed').querySelector('p');
			elem.textContent += 'Some content appended after component first render.';
		});

		const rect = await visualDiff.getRect(page, '#collapsed');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('auto-expands on focus-in', async function() {
		const resize = contentResize(page, '#auto-expand');
		await focusWithKeyboard(page, '#auto-expand a');
		await resize;
		const rect = await visualDiff.getRect(page, '#auto-expand');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('auto-collapses on focus-out', async function() {
		let resize = contentResize(page, '#auto-expand');
		await focusWithKeyboard(page, '#auto-expand a');
		await resize;

		resize = contentResize(page, '#auto-expand');
		await visualDiff.resetFocus(page);
		await resize;
		const rect = await visualDiff.getRect(page, '#auto-expand');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with custom height', async function() {
		const rect = await visualDiff.getRect(page, '#with-height');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('with custom blur', async function() {
		const rect = await visualDiff.getRect(page, '#with-custom-blur');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
