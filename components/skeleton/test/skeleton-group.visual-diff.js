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
				const container = element.querySelector('d2l-skeleton-group-test-wrapper d2l-test-skeleton-container');
				container.skeleton = skeleton;
				await container.updateComplete;
			}, info.skeleton);
			const rect = await visualDiff.getRect(page, `#${info.name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('add-element', async function() {
		await page.$eval('#add-element', async(element) => {
			const wrapper = element.querySelector('d2l-skeleton-group-test-wrapper');
			wrapper.insertAdjacentHTML('beforeend', '<d2l-test-skeleton-container skeleton></d2l-test-skeleton-container>');
		});
		const rect = await visualDiff.getRect(page, '#add-element');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('remove-element', async function() {
		await page.$eval('#remove-element', async(element) => {
			const group = element.querySelector('d2l-skeleton-group-test-wrapper');
			group.querySelector('#to-remove')?.remove();
		});
		const rect = await visualDiff.getRect(page, '#remove-element');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	[true, false].forEach((skeleton) => {
		it(`mixed-elements${skeleton ? '-skeleton' : ''}`, async function() {
			await page.$eval('#mixed-elements', async(element, skeleton) => {
				const elements = element.querySelectorAll('.to-skeleton');
				elements.forEach(el => el.skeleton = skeleton);
			}, skeleton);
			const rect = await visualDiff.getRect(page, '#mixed-elements');
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	[
		'nested-groups-inner',
		'nested-groups-middle',
		'nested-groups-outer',
	].forEach((name) => {
		[false, true].forEach((skeleton) => {
			it(`${name}${skeleton ? '-skeleton' : ''}`, async function() {
				await page.$eval(`#${name}`, async(element, skeleton) => {
					const elements = element.querySelectorAll('.skeleton-element');
					elements.forEach(el => el.skeleton = skeleton);
				}, skeleton);
				const rect = await visualDiff.getRect(page, `#${name}`);
				await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
			});
		});
	});

	[
		'nested-groups-remove-inner',
		'nested-groups-remove-middle',
		'nested-groups-remove-outer',
	].forEach((name) => {
		it(`${name}`, async function() {
			await page.$eval(`#${name}`, async(element) => {
				const el = element.querySelector('#to-remove');
				el.skeleton = false;
			});
			const rect = await visualDiff.getRect(page, `#${name}`);
			await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
		});
	});

	it('nested-groups-remove-all-before', async function() {
		const rect = await visualDiff.getRect(page, '#nested-groups-remove-all');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('nested-groups-remove-all-after', async function() {
		await page.$eval('#nested-groups-remove-all', async(element) => {
			const elements = element.querySelectorAll('#to-remove');
			elements.forEach(el => el.skeleton = false);
		});
		const rect = await visualDiff.getRect(page, '#nested-groups-remove-all');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
