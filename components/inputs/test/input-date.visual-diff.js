const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date', () => {

	const visualDiff = new VisualDiff('input-date', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-date.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	[
		'basic',
		'disabled',
		'labelled',
		'label-hidden',
		'placeholder-default',
		'placeholder-specified'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('basic-focus', async function() {
		await page.$eval('#basic', (elem) => elem.focus());
		const rect = await visualDiff.getRect(page, '#basic');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	describe('calendar dropdown', () => {
		before(async() => {
			await page.reload();
		});

		it('open with value', async function() {
			await open(page, '#basic');
			const rect = await getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#basic');
		});

		it('open with placeholder', async function() {
			await open(page, '#placeholder-default');
			const rect = await getRect(page, '#placeholder-default');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#placeholder-default');
		});

		it('tab on open', async function() {
			await open(page, '#basic');
			await page.keyboard.press('Tab');
			const rect = await getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#basic');
		});

		it('click date', async function() {
			await open(page, '#basic');
			await page.$eval('#basic', (elem) => {
				const calendar = elem.shadowRoot.querySelector('d2l-calendar');
				const date = calendar.shadowRoot.querySelector('td[data-date="20"]');
				date.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#basic');
		});

		it('set to today', async function() {
			await page.$eval('#basic', (elem) => {
				const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Set to Today"]');
				button.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#basic');
		});

		it('clear', async function() {
			await page.$eval('#basic', (elem) => {
				const button = elem.shadowRoot.querySelector('d2l-button-subtle[text="Clear"]');
				button.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			await reset(page, '#basic');
		});

		async function open(page, selector) {
			const openEvent = page.$eval(selector, (elem) => {
				return new Promise((resolve) => {
					elem.shadowRoot.querySelector('d2l-dropdown').addEventListener('d2l-dropdown-open', resolve, { once: true });
				});
			});

			await page.$eval(selector, (elem) => {
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
				return new Promise((resolve) => {
					dropdown.querySelector('[dropdown-content]').addEventListener('animationend', () => resolve(), { once: true });
					dropdown.toggleOpen();
				});
			});
			return openEvent;
		}

		async function reset(page, selector) {
			await page.$eval(selector, (elem) => {
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
				return new Promise((resolve) => {
					const content = dropdown.querySelector('[dropdown-content]');
					content.scrollTo(0);
					if (content.opened) {
						content.addEventListener('d2l-dropdown-close', () => resolve(), { once: true });
						content.opened = false;
					} else {
						resolve();
					}
				});
			});
		}

		function getRect(page, selector) {
			return page.$eval(selector, (elem) => {
				const content = elem.shadowRoot.querySelector('[dropdown-content]');
				const opener = content.__getOpener();
				const contentWidth = content.shadowRoot.querySelector('.d2l-dropdown-content-width');
				const openerRect = opener.getBoundingClientRect();
				const contentRect = contentWidth.getBoundingClientRect();
				const x = Math.min(openerRect.x, contentRect.x);
				const y = Math.min(openerRect.y, contentRect.y);
				const width = Math.max(openerRect.right, contentRect.right) - x;
				const height = Math.max(openerRect.bottom, contentRect.bottom) - y;
				return {
					x: x - 10,
					y: y - 10,
					width: width + 20,
					height: height + 20
				};
			});
		}
	});

});
