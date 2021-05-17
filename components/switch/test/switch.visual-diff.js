import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-switch', () => {

	const visualDiff = new VisualDiff('switch', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await browser.newPage();
		await page.emulateMediaFeatures([{
			name: 'prefers-reduced-motion', value: 'reduce'
		}]);
		await page.setViewport({ width: 1200, height: 1200, deviceScaleFactor: 2 });
		page.on('console', msg => console.log(msg.text()));
	});

	//after(async() => await browser.close());

	describe('ltr', () => {
		before(async() => {
			await page.goto(`${visualDiff.getBaseUrl()}/components/switch/test/switch.visual-diff.html?dir=ltr`, { waitUntil: ['networkidle0', 'load'] });
			await page.bringToFront();
		});

		[
			{ name: 'test', selector: '#test' },
			{ name: 'test2', selector: '#test' },
			{ name: 'test3', selector: '#test' },
			{ name: 'test4', selector: '#test' },
			{ name: 'test5', selector: '#test' },
			{ name: 'test6', selector: '#test' },
			{ name: 'test7', selector: '#test' },
			{ name: 'test8', selector: '#test' },
			{ name: 'test9', selector: '#test' },
			{ name: 'test10', selector: '#test' }
		].forEach((info) => {
			it.only(info.name, async function() {
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle());
			});
		});

	});

});
