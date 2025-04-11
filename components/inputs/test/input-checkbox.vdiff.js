import '../input-checkbox.js';
import '../input-checkbox-spacer.js';
import { expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';
import { checkboxFixtures } from './input-checkbox-fixtures.js';
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
						label="Checkbox (${text})"
						?skeleton="${skeleton}"></d2l-input-checkbox>
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

	[
		{
			name: 'inline-help',
			template: new inlineHelpFixtures().checkbox()
		},
		{
			name: 'inline-help-multiline',
			template: new inlineHelpFixtures({ multiline: true }).checkbox()
		},
		{
			name: 'inline-help-skeleton',
			template: new inlineHelpFixtures({ skeleton: true }).checkbox()
		},
		{
			name: 'inline-help-skeleton-multiline',
			template: new inlineHelpFixtures({ multiline: true, skeleton: true }).checkbox()
		},
		{
			name: 'inline-help-disabled',
			template: new inlineHelpFixtures({ disabled: true }).checkbox()
		}
	].forEach(({ name, template }) => {
		[false, true].forEach(rtl => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});

	describe('disabled-tooltip', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(checkboxFixtures.disabledTooltip);
		});

		it('hover', async() => {
			hoverElem(elem.shadowRoot.querySelector('.d2l-input-checkbox-wrapper'));
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
		});

		it('focus', async() => {
			focusElem(elem);
			await oneEvent(elem, 'd2l-tooltip-show');
			await expect(elem).to.be.golden();
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
			template: checkboxFixtures.labelMultiline
		},
		{
			name: 'multiline-unbreakable',
			template: checkboxFixtures.labelMultilineUnbreakable
		},
		{
			name: 'aria-label',
			template: checkboxFixtures.labelAria
		},
		{
			name: 'hidden-label',
			template: checkboxFixtures.labelHidden
		},
		{
			name: 'supporting',
			template: checkboxFixtures.supporting
		},
		{
			name: 'spacer',
			template: html`
				<div class="display:inline-block;">
					<d2l-input-checkbox>
						Label for checkbox
						<div slot="supporting" style="color: #999999;">
							Additional content can go here and will<br>
							also line up nicely with the checkbox.
						</div>
					</d2l-input-checkbox>
				</div>
			`
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
