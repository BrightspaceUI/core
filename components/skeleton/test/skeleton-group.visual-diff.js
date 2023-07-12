import puppeteer from 'puppeteer';
import VisualDiff from '@brightspace-ui/visual-diff';

describe('d2l-skeleton-group', () => {

	const visualDiff = new VisualDiff('skeleton-group', import.meta.url);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser, { viewport: { width: 800, height: 3500 } });
	});

	after(async() => await browser.close());

	before(async() => {
		await page.goto(
			`${visualDiff.getBaseUrl()}/components/skeleton/test/skeleton-group.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	[
		'all-skeleton',
		'one-skeleton',
		'no-skeleton',
	].forEach((name) => {
		it(name, async function() {
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		{ name: 'make-one-skeleton', skeleton: true },
		{ name: 'make-one-not-skeleton', skeleton: false },
	].forEach((info) => {
		it(info.name, async function() {
			await page.$eval(`#${info.name}`, async(element, skeleton) => {
				const panelGroup = element.querySelector('d2l-skeleton-group-test-wrapper').querySelector('d2l-collapsible-panel-group');
				const panel = panelGroup.querySelector('d2l-collapsible-panel');
				panel.skeleton = skeleton;
				await panel.updateComplete;
			}, info.skeleton);
			const rect = await visualDiff.getRect(page, `#${info.name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('add-element', async function() {
		await page.$eval('#add-element', async(element) => {
			const panelGroup = element.querySelector('d2l-skeleton-group-test-wrapper').querySelector('d2l-collapsible-panel-group');
			panelGroup.insertAdjacentHTML('beforeend', '<d2l-collapsible-panel skeleton panel-title="blah"></d2l-collapsible-panel>');
		});
		const rect = await visualDiff.getRect(page, '#add-element');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('remove-element', async function() {
		await page.$eval('#remove-element', async(element) => {
			const panelGroup = element.querySelector('d2l-skeleton-group-test-wrapper').querySelector('d2l-collapsible-panel-group');
			const panel = panelGroup.querySelector('#to-remove');
			panel?.remove();
		});
		const rect = await visualDiff.getRect(page, '#remove-element');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
