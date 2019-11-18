const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-button-icon', function() {

	const visualDiff = new VisualDiff('button-icon', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await visualDiff.disableAnimations(page);
		await page.setViewport({width: 800, height: 800, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/button/test/button-icon.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	beforeEach(async() => {
		await visualDiff.resetFocus(page);
	});

	after(() => browser.close());

	[
		{category: 'normal', tests: ['normal', 'hover', 'focus', 'disabled']},
		{category: 'translucent-enabled', tests: ['normal', 'focus', 'hover', 'disabled']},
		{category: 'custom', tests: ['normal', 'hover', 'focus']}
	].forEach((entry) => {
		describe(entry.category, () => {
			entry.tests.forEach((name) => {
				it(name, async function() {

					if (name === 'hover') {
						if (entry.category === 'translucent-enabled') {
							await hover(page, '#translucent-enabled > d2l-button-icon');
						} else {
							await page.hover(`#${entry.category}`);
						}
					} else if (name === 'focus') {
						if (entry.category === 'translucent-enabled') {
							await focus(page, '#translucent-enabled > d2l-button-icon');
						} else {
							await focus(page, `#${entry.category}`);
						}
					}

					const rectId = (name.indexOf('disabled') !== -1) ? name : entry.category;
					const rect = await visualDiff.getRect(page, `#${rectId}`);
					await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
				});
			});
		});
	});

	const hover = (page, selector) => {
		const p = page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				let backgroundTransitioned, boxShadowTransitioned;
				elem.shadowRoot.querySelector('button').addEventListener('transitionend', (e) => {
					if (e.propertyName === 'background-color') backgroundTransitioned = true;
					if (e.propertyName === 'box-shadow') boxShadowTransitioned = true;
					if (backgroundTransitioned && boxShadowTransitioned) resolve();
				});
			});
		}, selector);
		page.hover(selector);
		return p;
	};

	const focus = (page, selector) => {
		return page.evaluate((selector) => {
			return new Promise((resolve) => {
				const elem = document.querySelector(selector);
				elem.shadowRoot.querySelector('button').addEventListener('transitionend', resolve);
				elem.focus();
			});
		}, selector);
	};

});
