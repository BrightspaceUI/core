import '../icon.js';
import '../demo/icon-color-override.js';
import '../demo/icon-size-override.js';
import { fixture, html, screenshotAndCompare } from '../../../tools/web-test-runner-helpers.js';

describe('d2l-icon', () => {

	it('tier1', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier1:assignments"></d2l-icon>`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('tier2', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier2:assignments"></d2l-icon>`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('tier3', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier3:assignments"></d2l-icon>`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('prefixed', async function() {
		const elem = await fixture(html`<d2l-icon icon="d2l-tier3:assignments"></d2l-icon>`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('fill-none', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier2:evaluate-all"></d2l-icon>`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('fill-circle', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier2:divider-big"></d2l-icon>`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('fill-mixed', async function() {
		const elem = await fixture(html`
			<d2l-icon-demo-color-override>
				<d2l-icon icon="tier2:check-box"></d2l-icon>
			</d2l-icon-demo-color-override>
		`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('color-override', async function() {
		const elem = await fixture(html`
			<d2l-icon-demo-color-override>
				<d2l-icon icon="tier3:assignments"></d2l-icon>
			</d2l-icon-demo-color-override>
		`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('size-override', async function() {
		const elem = await fixture(html`
			<d2l-icon-demo-size-override>
				<d2l-icon icon="tier3:assignments"></d2l-icon>
			</d2l-icon-demo-size-override>
		`);
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('rtl-tier1', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier1:assignments"></d2l-icon>`, { rtl: true });
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('rtl-tier2', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier2:assignments"></d2l-icon>`, { rtl: true });
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

	it('rtl-tier3', async function() {
		const elem = await fixture(html`<d2l-icon icon="tier3:assignments"></d2l-icon>`, { rtl: true });
		await screenshotAndCompare(elem, this.test.fullTitle());
	});

});
