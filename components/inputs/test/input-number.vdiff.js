import '../input-number.js';
import '../../button/button-icon.js';
import { clickAt, expect, fixture, focusElem, html, oneEvent, sendKeysElem } from '@brightspace-ui/testing';
import { inlineHelpSlots } from './input-shared-content.js';

const requiredFixture = html`<d2l-input-number label="Number" required></d2l-input-number>`;
const simpleFixture = html`<d2l-input-number label="Number"></d2l-input-number>`;
export const inlineHelpNumberFixtures = {
	normal: html`
		<d2l-input-number label="Age" value="18">
			${inlineHelpSlots.normal}
		</d2l-input-number>
	`,
	multiline: html`
		<d2l-input-number label="Age" value="18">
			${inlineHelpSlots.multiline}
		</d2l-input-number>
	`
};

const viewport = { width: 376 };

describe('d2l-input-number', () => {

	[
		{ name: 'simple', template: simpleFixture },
		{ name: 'label-hidden', template: html`<d2l-input-number label="Number" label-hidden></d2l-input-number>` },
		{ name: 'required', template: requiredFixture },
		{ name: 'disabled', template: html`<d2l-input-number label="Number" value="10" disabled></d2l-input-number>` },
		{ name: 'placeholder', template: html`<d2l-input-number label="Number" placeholder="Number..."></d2l-input-number>` },
		{ name: 'default-value', template: html`<d2l-input-number label="Number" value="10"></d2l-input-number>` },
		{
			name: 'after-slot',
			template: html`
				<d2l-input-number label="Help Text">
					<d2l-button-icon icon="tier1:help" text="help" slot="after"></d2l-button-icon>
				</d2l-input-number>
			`
		},
		{ name: 'trailing-zeroes', template: html`<d2l-input-number label="Number" value-trailing-zeroes="1.000" trailing-zeroes></d2l-input-number>` },
		{ name: 'inline-help', template: inlineHelpNumberFixtures.normal },
		{ name: 'inline-help-multiline', template: inlineHelpNumberFixtures.multiline }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport });
			await expect(elem).to.be.golden();
		});
	});

	it('simple focus', async() => {
		const elem = await fixture(simpleFixture, { viewport });
		await focusElem(elem);
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
		await sendKeysElem(elem, 'type', '10');
		await clickAt(0, 0);
		await expect(elem).to.be.golden();
	});

	it('invalid focus when required with initial invalid value', async() => {
		const elem = await fixture(
			html`<d2l-input-number label="Number" required min="0" value="-2"></d2l-input-number>`,
			{ viewport }
		);
		focusElem(elem);
		await oneEvent(elem, 'd2l-tooltip-show');
		await expect(elem).to.be.golden();
	});

	describe('skeleton', () => {
		[
			{ name: 'simple', template: html`<d2l-input-number skeleton label="Number"></d2l-input-number>` },
			{ name: 'label-hidden', template: html`<d2l-input-number skeleton label="Number" label-hidden></d2l-input-number>` },
			{ name: 'required', template: html`<d2l-input-number skeleton label="Number" required></d2l-input-number>` },
			{ name: 'disabled', template: html`<d2l-input-number skeleton label="Number" value="10" disabled></d2l-input-number>` },
			{
				name: 'after-slot',
				template: html`
					<d2l-input-number skeleton label="Help Text">
						<d2l-button-icon icon="tier1:help" text="help" slot="after"></d2l-button-icon>
					</d2l-input-number>
				`
			},
			{ name: 'custom-width', template: html`<d2l-input-number skeleton label="Number" value="10" input-width="10rem"></d2l-input-number>` },
		].forEach(({ name, template }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport });
				await expect(elem).to.be.golden();
			});
		});
	});

});
