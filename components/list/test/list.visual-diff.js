const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('d2l-list', function() {

	const visualDiff = new VisualDiff('list', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.setViewport({width: 900, height: 900, deviceScaleFactor: 2});
		await page.goto(`${visualDiff.getBaseUrl()}/components/list/test/list.visual-diff.html`, {waitUntil: ['networkidle0', 'load']});
		await page.bringToFront();
	});

	after(() => browser.close());

	afterEach(async() => {
		await page.$eval('#list', (list) => {
			list.style.width = '500px';
			list.toggleAttribute('divider-mode', false);
			list.toggleAttribute('divider-extend', false);
			list.toggleAttribute('hover-effect', false);
			list.toggleAttribute('selectable', false);
		});
	});

	describe('Breakpoints', () => {
		[
			{ breakpoint: 3, width: 900 },
			{ breakpoint: 2, width: 800 },
			{ breakpoint: 1, width: 600 },
			{ breakpoint: 0, width: 500 }
		].forEach(breakpoint => {
			describe(`${breakpoint.breakpoint}`, () => {
				before(async() => {
					await page.$eval('#list', (list, breakpoint) => {
						list.style.width = `${breakpoint.width}px`;
					}, breakpoint);
					await page.$eval('#list d2l-list', (list, breakpoint) => {
						list.style.width = `${breakpoint.width}px`;
					}, breakpoint);
				});

				it('list', async function() {
					await visualListScreenshot(page, this.test.fullTitle());
				});
			});
		});
	});

	describe('Visual Changing attributes', () => {
		[
			{ name: 'divider-mode', value: 'all' },
			{ name: 'divider-mode', value: 'between'},
			{ name: 'divider-mode', value: 'none' },
			{ name: 'divider-extend', value: true },
			{ name: 'dir', value: 'rtl', listItemAttribute: true }
		].forEach((attribute) => {
			it(`${attribute.name}=${attribute.value}`, async function() {
				await setAttribute(page, 'd2l-list', attribute.name, attribute.value);
				if (attribute.listItemAttribute) {
					await setAttribute(page, 'd2l-list-item', attribute.name, attribute.value);
				}

				await visualListScreenshot(page, this.test.fullTitle());

				await toggleAttribute(page, 'd2l-list', attribute.name, false);
				if (attribute.listItemAttribute) {
					await toggleAttribute(page, 'd2l-list-item', attribute.name, false);
				}
			});
		});
	});

	describe('List tests for selectable', () => {
		before(async() => {
			await toggleAttribute(page, 'd2l-list', 'selectable', true);
		});
		[
			{ name: 'hover-effect', value: false },
			{ name: 'hover-effect', value: true }
		].forEach((attribute) => {
			describe(`Selectable when ${attribute.name}=${attribute.value}`, () => {
				beforeEach(async() =>  {
					await toggleAttribute(page, 'd2l-list', attribute.name, attribute.value);
				});
				afterEach(async() =>  {
					await toggleAttribute(page, 'd2l-list', attribute.name, false);
					await resetMouse(page);
				});
				it('Checkbox visable', async function() {
					await visualListScreenshot(page, this.test.fullTitle());
				});

				it('Hover', async function() {
					await hover(page, '#hover');
					await visualListScreenshot(page, this.test.fullTitle());
				});

				it('Focus', async function() {
					await tab(page);
					await visualListScreenshot(page, this.test.fullTitle());
				});

				it('Selected', async function() {
					await page.click('#hover');
					await resetMouse(page); // take away focus.
					await visualListScreenshot(page, this.test.fullTitle());
					await page.click('#hover');
				});
			});
		});
	});

	const toggleAttribute = async(page, selector, name, value) => {
		await page.$$eval(`#list ${selector}`, (elements, name, value) => {
			elements.forEach(element => element.toggleAttribute(name, value));
		}, name, value);
	};
	const setAttribute = async(page, selector, name, value) => {
		await page.$$eval(`#list ${selector}`, (elements, name, value) => {
			elements.forEach(element => element.setAttribute(name, value));
		}, name, value);
	};
	const visualListScreenshot = async(page, title) => {
		const rect = await visualDiff.getRect(page, '#list');
		await visualDiff.screenshotAndCompare(page, title, { clip: rect });
	};
	const hover = (page, selector) => {
		return new Promise((resolve) => {
			page.hover(`#list ${selector}`);
			setTimeout(resolve, 505);
		});
	};
	const tab = (page) => {
		return new Promise((resolve) => {
			page.keyboard.press('Tab');
			setTimeout(resolve, 505);
		});
	};
	const resetMouse = (page) => {
		return new Promise((resolve) => {
			page.mouse.click(0, 0);
			setTimeout(resolve, 505);
		});
	};
});
