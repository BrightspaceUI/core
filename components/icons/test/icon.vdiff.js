import '../icon.js';
import '../demo/icon-color-override.js';
import '../demo/icon-size-override.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

describe('d2l-icon', () => {

	it('tier1', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier1:assignments"></d2l-icon>`);
		await expect(elem).to.be.golden();
	});

	it('tier2', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier2:assignments"></d2l-icon>`);
		await expect(elem).to.be.golden();
	});

	it('tier3', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier3:assignments"></d2l-icon>`);
		await expect(elem).to.be.golden();
	});

	it('prefixed', async() => {
		const elem = await fixture(html`<d2l-icon icon="d2l-tier3:assignments"></d2l-icon>`);
		await expect(elem).to.be.golden();
	});

	it('fill-none', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier2:evaluate-all"></d2l-icon>`);
		await expect(elem).to.be.golden();
	});

	it('fill-circle', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier2:divider-big"></d2l-icon>`);
		await expect(elem).to.be.golden();
	});

	it('fill-mixed', async() => {
		const elem = await fixture(html`
			<d2l-icon-demo-color-override>
				<d2l-icon icon="tier2:check-box"></d2l-icon>
			</d2l-icon-demo-color-override>
		`);
		await expect(elem).to.be.golden();
	});

	it('color-override', async() => {
		const elem = await fixture(html`
			<d2l-icon-demo-color-override>
				<d2l-icon icon="tier3:assignments"></d2l-icon>
			</d2l-icon-demo-color-override>
		`);
		await expect(elem).to.be.golden();
	});

	it('size-override', async() => {
		const elem = await fixture(html`
			<d2l-icon-demo-size-override>
				<d2l-icon icon="tier3:assignments"></d2l-icon>
			</d2l-icon-demo-size-override>
		`);
		await expect(elem).to.be.golden();
	});

	it('rtl-tier1', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier1:assignments"></d2l-icon>`, { rtl: true });
		await expect(elem).to.be.golden();
	});

	it('rtl-tier2', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier2:assignments"></d2l-icon>`, { rtl: true });
		await expect(elem).to.be.golden();
	});

	it('rtl-tier3', async() => {
		const elem = await fixture(html`<d2l-icon icon="tier3:assignments"></d2l-icon>`, { rtl: true });
		await expect(elem).to.be.golden();
	});

});
