import '../input-radio-spacer.js';
import '../demo/input-radio-label-test.js';
import '../demo/input-radio-solo-test.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';

const labelFixture = html`
	<div>
		<d2l-test-input-radio-label></d2l-test-input-radio-label>
		<d2l-input-radio-spacer style="color: #999999; width: 200px;">
			Additional content can go here and will<br>
			also line up nicely with the radios.
		</d2l-input-radio-spacer>
	</div>
`;

describe('d2l-input-radio', () => {

	[
		{ name: 'label', template: labelFixture, allColorModes: true },
		{ name: 'label-rtl', rtl: true, template: labelFixture }
	].forEach(({ name, allColorModes, rtl, template }) => {

		it(name, async() => {
			const elem = await fixture(template, { rtl });
			await expect(elem).to.be.golden({ allColorModes });
		});

	});

	['default', 'disabled', 'invalid'].forEach(state => {
		['unchecked', 'checked'].forEach(checked => {

			const name = `${state}-${checked}`;
			const radioFixture = html`
				<d2l-test-input-radio-solo
					?checked="${checked === 'checked'}"
					?disabled="${state === 'disabled'}"
					?invalid="${state === 'invalid'}"></d2l-test-input-radio-solo>
			`;
			it(name, async() => {
				const elem = await fixture(radioFixture);
				await expect(elem).to.be.golden({ allColorModes: true });
			});

			if (state !== 'disabled') {
				it(`${name}-focus`, async() => {
					const elem = await fixture(radioFixture);
					await focusElem(elem);
					await expect(elem).to.be.golden({ allColorModes: true });
				});
			}

		});
	});

});
