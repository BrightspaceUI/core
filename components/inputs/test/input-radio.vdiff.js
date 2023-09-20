import '../input-radio-spacer.js';
import '../demo/input-radio-label-test.js';
import '../demo/input-radio-solo-test.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';

const labelFixture = html`
	<div>
		<d2l-test-input-radio-label></d2l-test-input-radio-label>
		<d2l-input-radio-spacer style="color: #999999; width: 200px;">
			Additional content can go here and will<br>
			also line up nicely with the radios.
		</d2l-input-radio-spacer>
	</div>
`;

function createFixture(type, state, checked) {
	if (type === 'solo') {
		return html`
			<d2l-test-input-radio-solo
				?checked="${checked === 'checked'}"
				?disabled="${state === 'disabled'}"
				?invalid="${state === 'invalid'}"></d2l-test-input-radio-solo>
		`;
	}
	return html`
		<input type="radio" class="d2l-test-input-radio"
			?checked="${checked === 'checked'}"
			?disabled="${state === 'disabled'}"
			aria-invalid="${state === 'invalid' ? 'true' : 'false'}">
	`;
}

describe('d2l-input-radio', () => {

	before(loadSass);
	after(unloadSass);

	it('label', async() => {
		const elem = await fixture(labelFixture);
		await expect(elem).to.be.golden();
	});

	it('label-rtl', async() => {
		const elem = await fixture(labelFixture, { rtl: true });
		await expect(elem).to.be.golden();
	});

	['solo', 'sass'].forEach(type => {
		['default', 'disabled', 'invalid'].forEach(state => {
			['unchecked', 'checked'].forEach(checked => {

				const name = `${type}-${state}-${checked}`;
				const radioFixture = createFixture(type, state, checked);

				it(name, async() => {
					const elem = await fixture(radioFixture);
					await expect(elem).to.be.golden();
				});

				if (state !== 'disabled') {
					it(`${name}-focus`, async() => {
						const elem = await fixture(radioFixture);
						await focusElem(elem);
						await expect(elem).to.be.golden();
					});
				}

			});
		});
	});

});
