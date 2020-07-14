const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-input-text', () => {

	const visualDiff = new VisualDiff('input-text', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, {viewport: {width: 800, height: 4500}});
		await page.goto(`${visualDiff.getBaseUrl()}/components/inputs/test/input-text.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(async() => await browser.close());

	['wc', 'sass'].forEach((type) => {
		[
			'basic',
			'email',
			'number',
			'password',
			'search',
			'tel',
			'url',
			'disabled',
			'placeholder',
			'placeholder-disabled',
			'invalid',
			'invalid-disabled',
			'aria-invalid',
			'aria-invalid-disabled'
		].forEach((name) => {
			const id = `${type}-${name}`;
			it(id, async function() {
				const rect = await visualDiff.getRect(page, `#${id}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
			if (name.indexOf('disabled') === -1) {
				it(`${id}-focus`, async function() {
					await page.$eval(`#${id}`, (elem) => elem.focus());
					const rect = await visualDiff.getRect(page, `#${id}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			}
		});
	});

	[
		'wc-labelled',
		'wc-required',
		'wc-label-hidden',
		'wc-override-height',
		'wc-override-padding',
		'wc-icon-left',
		'wc-icon-left-rtl',
		'wc-icon-right',
		'wc-icon-right-rtl',
		'wc-icon-left-label',
		'wc-icon-right-label',
		'wc-icon-left-right',
		'wc-button-icon-left',
		'wc-button-icon-right',
		'wc-icon-right-invalid',
		'wc-icon-right-invalid-rtl'
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
		it(`${name}-focus`, async function() {
			await page.$eval(`#${name}`, (elem) => elem.focus());
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'wc-tooltip',
		'wc-tooltip-error',
		'wc-tooltip-position'
	].forEach((name) => {
		afterEach(async() => {
			await page.reload();
		});

		it(name, async function() {
			const selector = `#${name}`;
			await showTooltip(page, selector);
			const rect = await getRect(page, selector);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	function getRect(page, selector) {
		return page.$eval(selector, (elem) => {
			const content = elem.shadowRoot.querySelector('d2l-tooltip');
			const contentWidth = content.shadowRoot.querySelector('.d2l-tooltip-content');
			const openerRect = elem.getBoundingClientRect();
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

	async function showTooltip(page, selector) {
		await page.$eval(selector, (elem) => {
			const tooltip = elem.shadowRoot.querySelector('d2l-tooltip');
			return new Promise((resolve) => {
				tooltip.addEventListener('d2l-tooltip-show', () => resolve(), { once: true });
				tooltip.show();
			});
		});
	}

});
