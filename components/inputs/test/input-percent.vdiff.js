import '../input-percent.js';
import '../../button/button-icon.js';
import { clickAt, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';

const simpleFixture = html`<d2l-input-percent label="Percent"></d2l-input-percent>`;
const requiredFixture = html`<d2l-input-percent label="Percent" required></d2l-input-percent>`;
const inlineHelpComponents = {
	normal: html`
		<d2l-input-percent label="Grade" value="92">
			<div slot="inline-help">
				Help text <b>right here</b>!
			</div>
		</d2l-input-percent>
	`,
	multiline: html`
		<d2l-input-percent label="Grade" value="92">
			<div slot="inline-help">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit,
				sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
				reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
				qui officia deserunt mollit anim id est laborum.
			</div>
		</d2l-input-percent>
	`
};

const viewport = { width: 376 };

describe('d2l-input-percent', () => {

	it('simple', async() => {
		const elem = await fixture(simpleFixture, { viewport });
		await expect(elem).to.be.golden();
	});

	it('simple focus', async() => {
		const elem = await fixture(simpleFixture, { viewport });
		await focusElem(elem);
		await expect(elem).to.be.golden();
	});

	it('simple-skeleton', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" skeleton></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('label-hidden', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" label-hidden></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('label-hidden-skeleton', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" label-hidden skeleton></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('required', async() => {
		const elem = await fixture(requiredFixture, { viewport });
		await expect(elem).to.be.golden();
	});

	it('required-skeleton', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" required skeleton></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('disabled', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" value="10" disabled></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('disabled-skeleton', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" value="10" disabled skeleton></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('placeholder', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" placeholder="Percent..."></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('default-value', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" value="10"></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('after-slot', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Help Text"><d2l-button-icon icon="tier1:help" text="help" slot="after"></d2l-button-icon></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('after-slot-skeleton', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Help Text" skeleton><d2l-button-icon icon="tier1:help" text="help" slot="after"></d2l-button-icon></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('invalid no focus', async() => {
		const elem = await fixture(requiredFixture, { viewport });
		await elem.validate();
		await expect(elem).to.be.golden();
	});

	it('invalid focus', async() => {
		const elem = await fixture(requiredFixture, { viewport });
		await elem.validate();
		focusElem(elem);
		await oneEvent(elem, 'd2l-tooltip-show');
		await expect(elem).to.be.golden();
	});

	it('invalid focus then fix then blur', async() => {
		const elem = await fixture(requiredFixture, { viewport });
		await elem.validate();
		await focusElem(elem);
		await sendKeysElem(elem, 'type', '10');
		await clickAt(0, 0);
		await expect(elem).to.be.golden();
	});

	it('custom-width-skeleton', async() => {
		const elem = await fixture(html`<d2l-input-percent label="Percent" value="10" input-width="10rem" skeleton></d2l-input-percent>`, { viewport });
		await expect(elem).to.be.golden();
	});

	it('inline-help', async() => {
		const elem = await fixture(inlineHelpComponents.normal, { viewport });
		await expect(elem).to.be.golden();
	});

	it('inline-help-multiline', async() => {
		const elem = await fixture(inlineHelpComponents.multiline, { viewport });
		await expect(elem).to.be.golden();
	});

});
