const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-date', () => {

	const visualDiff = new VisualDiff('input-date', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
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
		afterEach(async() => {
			await page.reload();
		});

		it('looks correct open', async function() {
			await open(page, '#basic');
			const rect = await getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('selects correctly', async function() {
			await page.$eval('#basic', (elem) => {
				// click a date
				elem.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('sets to today', async function() {
			await page.$eval('#basic', (elem) => {
				// click "Set to Today"
				elem.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		it.skip('clears', async function() {
			await page.$eval('#basic', (elem) => {
				// click "clear"
				elem.click();
			});
			const rect = await visualDiff.getRect(page, '#basic');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});

		function getOpenEvent(page, selector) {
			return page.$eval(selector, (elem) => {
				return new Promise((resolve) => {
					elem.shadowRoot.querySelector('d2l-dropdown').addEventListener('d2l-dropdown-open', resolve, { once: true });
				});
			});
		}

		async function open(page, selector) {
			const openEvent = getOpenEvent(page, selector);
			await page.$eval(selector, (elem) => {
				const dropdown = elem.shadowRoot.querySelector('d2l-dropdown');
				return new Promise((resolve) => {
					dropdown.querySelector('[dropdown-content]').addEventListener('animationend', () => resolve(), { once: true });
					dropdown.toggleOpen();
				});
			});
			return openEvent;
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
