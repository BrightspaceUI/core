import '../input-checkbox.js';
import '../input-checkbox-spacer.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';
import { inlineHelpFixtures } from './input-shared-content.js';

describe('d2l-input-checkbox', () => {

	before(loadSass);
	after(unloadSass);

	[false, true].forEach(skeleton => {
		[false, true].forEach(disabled => {
			const checkedStates = ['checked', 'unchecked'];
			if (!skeleton) {
				checkedStates.push('indeterminate');
			}
			checkedStates.forEach(checked => {

				const name = `${skeleton ? 'skeleton-' : ''}${disabled ? 'disabled' : 'default'}-${checked}`;
				let text = '';
				if (skeleton) {
					text = 'skeleton';
					if (disabled) text += ', disabled';
					text += `, ${checked}`;
				} else {
					text += `${checked}`;
					if (disabled) text += ', disabled';
				}
				const checkboxFixture = html`
					<d2l-input-checkbox
						?checked="${checked === 'checked'}"
						?disabled="${disabled}"
						?indeterminate="${checked === 'indeterminate'}"
						?skeleton="${skeleton}">Checkbox (${text})</d2l-input-checkbox>
				`;

				it(name, async() => {
					const elem = await fixture(checkboxFixture);
					await expect(elem).to.be.golden();
				});

				if (!disabled) {
					it(`${name}-focus`, async() => {
						const elem = await fixture(checkboxFixture);
						await focusElem(elem);
						await expect(elem).to.be.golden();
					});
				}

			});
		});
	});

	describe('sass', () => {
		[false, true].forEach(disabled => {
			[true, false].forEach(checked => {

				const name = `${disabled ? 'disabled' : 'default'}-${checked ? 'checked' : 'unchecked'}`;
				const checkboxFixture = html`<input type="checkbox" class="d2l-test-input-checkbox" ?checked="${checked}" ?disabled="${disabled}">`;

				it(name, async() => {
					const elem = await fixture(checkboxFixture);
					await expect(elem).to.be.golden();
				});
				if (!disabled) {
					it(`${name}-focus`, async() => {
						const elem = await fixture(checkboxFixture);
						await focusElem(elem);
						await expect(elem).to.be.golden();
					});
				}

			});
		});
	});

	[
		{
			name: 'multiline',
			template: html`
				<d2l-input-checkbox style="overflow: hidden; width: 200px;">
					Label for checkbox that wraps nicely onto
					multiple lines and stays aligned
				</d2l-input-checkbox>`
		},
		{
			name: 'multiline-unbreakable',
			template: html`
				<d2l-input-checkbox id="wc-multiline-unbreakable" style="overflow: hidden; width: 200px;">
					https://en.wikipedia.org/wiki/Dark_matter
				</d2l-input-checkbox>
			`
		},
		{
			name: 'hidden-label',
			template: html`<d2l-input-checkbox aria-label="Label for checkbox"></d2l-input-checkbox>`
		},
		{
			name: 'spacer',
			template: html`
				<div class="display:inline-block;">
					<d2l-input-checkbox>Label for checkbox</d2l-input-checkbox>
					<d2l-input-checkbox-spacer style="color: #999999;">
						Additional content can go here and will<br>
						also line up nicely with the checkbox.
					</d2l-input-checkbox-spacer>
				</div>
			`
		},
		{
			name: 'inline-help',
			template: inlineHelpFixtures.checkbox.normal
		},
		{
			name: 'inline-help-multiline',
			template: inlineHelpFixtures.checkbox.multiline
		}
	].forEach(({ name, template }) => {
		[false, true].forEach(rtl => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

});
