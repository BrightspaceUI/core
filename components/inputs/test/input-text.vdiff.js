import '../../button/button-icon.js';
import '../../icons/icon.js';
import '../input-text.js';
import { expect, fixture, focusElem, html } from '@brightspace-ui/testing';
import { loadSass, unloadSass } from '../../../test/load-sass.js';
import { inlineHelpFixtures, inlineHelpSlots } from './input-shared-content.js';

const createIcon = (icon, slot) => html`<d2l-icon icon="tier1:${icon}" slot="${slot}" style="margin-left: 0.55rem; margin-right: 0.55rem"></d2l-icon>`;

const labelHiddenFixture = html`<d2l-input-text label="Name" label-hidden value="text"></d2l-input-text>`;
const labelledFixture = html`<d2l-input-text label="Name" value="text"></d2l-input-text>`;
const unitFixture = html`<d2l-input-text label="unit" label-hidden value="value" unit="%"></d2l-input-text>`;
const unitInvalidFixture = html`<d2l-input-text label="unit" label-hidden value="value" unit="%" aria-invalid="true"></d2l-input-text>`;
const iconLeftFixture = html`
	<d2l-input-text label="Name" label-hidden value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
		${createIcon('calendar', 'left')}
	</d2l-input-text>
`;
const iconRightFixture = html`
	<d2l-input-text label="Name" label-hidden value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
		${createIcon('calendar', 'right')}
	</d2l-input-text>
`;
const iconRightInvalidFixture = html`
	<d2l-input-text label="Name" label-hidden aria-invalid="true" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
		${createIcon('calendar', 'right')}
	</d2l-input-text>
`;
const invalidFixture = html`<d2l-input-text label="Name" label-hidden type="email" value="invalid@"></d2l-input-text>`;
const ariaInvalidFixture = html`<d2l-input-text label="Name" label-hidden value="aria-invalid" aria-invalid="true"></d2l-input-text>`;

const viewport = { width: 376 };

describe('d2l-input-text', () => {

	[
		{ name: 'basic', template: labelHiddenFixture },
		{ name: 'basic-focus', template: labelHiddenFixture, focus: true },
		{ name: 'email', template: html`<d2l-input-text label="Name" label-hidden type="email" value="bill@nye.com"></d2l-input-text>` },
		{ name: 'number', template: html`<d2l-input-text label="Name" label-hidden type="number" value="500"></d2l-input-text>` },
		{ name: 'password', template: html`<d2l-input-text label="Name" label-hidden type="password" value="123456"></d2l-input-text>` },
		{ name: 'search', template: html`<d2l-input-text label="Name" label-hidden type="search" value="search"></d2l-input-text>` },
		{ name: 'tel', template: html`<d2l-input-text label="Name" label-hidden type="tel" value="123-456-7890"></d2l-input-text>` },
		{ name: 'url', template: html`<d2l-input-text label="Name" label-hidden type="url" value="https://www.d2l.com"></d2l-input-text>` },
		{ name: 'disabled', template: html`<d2l-input-text label="Name" label-hidden disabled value="text disabled"></d2l-input-text>` },
		{ name: 'placeholder', template: html`<d2l-input-text label="Name" label-hidden placeholder="placeholder"></d2l-input-text>` },
		{ name: 'placeholder-disabled', template: html`<d2l-input-text label="Name" label-hidden disabled placeholder="placeholder disabled"></d2l-input-text>` },
		{ name: 'invalid', template: invalidFixture },
		{ name: 'invalid-disabled', template: html`<d2l-input-text label="Name" label-hidden disabled type="email" value="invalid-disabled@"></d2l-input-text>` },
		{ name: 'invalid-focus', template: invalidFixture, focus: true },
		{ name: 'aria-invalid', template: ariaInvalidFixture },
		{ name: 'aria-invalid-disabled', template: html`<d2l-input-text label="Name" label-hidden disabled value="aria-invalid-disabled" aria-invalid="true"></d2l-input-text>` },
		{ name: 'aria-invalid-focus', template: ariaInvalidFixture, focus: true },
		{ name: 'labelled', template: labelledFixture },
		{ name: 'labelled-focus', template: labelledFixture, focus: true },
		{ name: 'labelled-skeleton', template: html`<d2l-input-text label="Name" value="text" skeleton></d2l-input-text>` },
		{ name: 'label-hidden', template: labelHiddenFixture },
		{ name: 'label-hidden-skeleton', template: html`<d2l-input-text label="Name" label-hidden value="text" skeleton></d2l-input-text>` },
		{ name: 'required', template: html`<d2l-input-text label="Name" required value="text"></d2l-input-text>` },
		{ name: 'required-skeleton', template: html`<d2l-input-text label="Name" required value="text" skeleton></d2l-input-text>` },
		{ name: 'custom-width-skeleton', template: html`<d2l-input-text label="Custom Width Longer Than Input" input-width="100px" skeleton></d2l-input-text>` },
		{ name: 'overflowing', template: html`<d2l-input-text label="Name" label-hidden value="overflowing value that renders ellipsis"></d2l-input-text>` },
		{ name: 'unit', template: unitFixture },
		{ name: 'unit-rtl', template: unitFixture, rtl: true },
		{ name: 'unit-disabled', template: html`<d2l-input-text label="unit" label-hidden value="value" unit="%" disabled></d2l-input-text>` },
		{ name: 'unit-invalid', template: unitInvalidFixture },
		{ name: 'unit-invalid-focus', template: unitInvalidFixture, focus: true },
		{ name: 'unit-invalid-rtl', template: unitInvalidFixture, rtl: true },
		{ name: 'unit-invalid-rtl-focus', template: unitInvalidFixture, focus: true, rtl: true },
		{
			name: 'unit-init-hidden',
			template: html`<d2l-input-text label="unit" label-hidden value="overflowing value should not overlap unit" unit="%" style="display: none;"></d2l-input-text>`,
			action: async(elem) => elem.style.display = 'inline-block'
		},
		{
			name: 'unit-change',
			template: html`<d2l-input-text label="unit" label-hidden value="3" value-align="end" unit="/5" unit-label="out of 5"></d2l-input-text>`,
			action: async(elem) => { elem.unit = '/5000'; await elem.updateComplete; }
		},
		{ name: 'override-height', template: html`<d2l-input-text label="Name" label-hidden value="text" style="--d2l-input-height: 100px;"></d2l-input-text>` },
		{ name: 'override-padding', template: html`<d2l-input-text label="Name" label-hidden value="text" style="--d2l-input-padding: 2rem 3rem;--d2l-input-padding-focus: calc(2rem - 1px) calc(3rem - 1px);"></d2l-input-text>` },
		{ name: 'override-text-align', template: html`<d2l-input-text label="Name" label-hidden value="text" style="--d2l-input-text-align: end;"></d2l-input-text>` },
		{ name: 'icon-left', template: iconLeftFixture },
		{ name: 'icon-left-rtl', template: iconLeftFixture, rtl: true },
		{ name: 'icon-right', template: iconRightFixture },
		{ name: 'icon-right-rtl', template: iconRightFixture, rtl: true },
		{
			name: 'icon-left-label',
			template: html`
				<d2l-input-text label="Name" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
					${createIcon('calendar', 'left')}
				</d2l-input-text>
			`
		},
		{
			name: 'icon-right-label',
			template: html`
				<d2l-input-text label="Name" value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
					${createIcon('calendar', 'right')}
				</d2l-input-text>
			`
		},
		{
			name: 'icon-left-right',
			template: html`
				<d2l-input-text label="Name" label-hidden value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
					${createIcon('search', 'left')}
					${createIcon('search', 'right')}
				</d2l-input-text>
			`
		},
		{
			name: 'button-icon-left',
			template: html`
				<d2l-input-text label="Name" label-hidden value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
					${createIcon('search', 'left')}
				</d2l-input-text>
			`
		},
		{
			name: 'button-icon-right',
			template: html`
				<d2l-input-text label="Name" label-hidden value="Lorem ipsum dolor sit amet, consectetur adipiscing elit">
					${createIcon('search', 'right')}
				</d2l-input-text>
			`
		},
		{ name: 'icon-right-invalid', template: iconRightInvalidFixture },
		{ name: 'icon-right-invalid-focus', template: iconRightInvalidFixture, focus: true },
		{ name: 'icon-right-invalid-rtl', template: iconRightInvalidFixture, rtl: true },
		{ name: 'icon-right-invalid-rtl-focus', template: iconRightInvalidFixture, focus: true, rtl: true },
		{
			name: 'inline-help',
			template: inlineHelpFixtures.text.normal
		},
		{
			name: 'inline-help-multiline',
			template: inlineHelpFixtures.text.multiline
		},
		{
			name: 'inline-help-skeleton',
			template: html`
				<d2l-input-text label="Name" value="text" skeleton>
					${inlineHelpSlots.normal}
				</d2l-input-text>
			`
		},
	].forEach(({ name, template, action, focus, rtl }) => {

		it(name, async() => {
			const elem = await fixture(template, { rtl, viewport });
			if (action) await action(elem);
			if (focus) await focusElem(elem);
			await expect(elem).to.be.golden();
		});

	});

	describe('sass', () => {

		before(loadSass);
		after(unloadSass);

		const sassBasicFixture = html`<input class="d2l-test-input-text" type="text" value="text">`;
		const sassInvalidFixture = html`<input class="d2l-test-input-text" type="email" value="invalid@">`;
		const sassAriaInvalidFixture = html`<input class="d2l-test-input-text" value="aria-invalid" aria-invalid="true">`;

		[
			{ name: 'basic', template: sassBasicFixture },
			{ name: 'basic-focus', template: sassBasicFixture, focus: true },
			{ name: 'email', template: html`<input class="d2l-test-input-text" type="email" value="bill@nye.com">` },
			{ name: 'number', template: html`<input class="d2l-test-input-text" type="number" value="500">` },
			{ name: 'password', template: html`<input class="d2l-test-input-text" type="password" value="123456">` },
			{ name: 'search', template: html`<input class="d2l-test-input-text" type="search" value="search">` },
			{ name: 'tel', template: html`<input class="d2l-test-input-text" type="tel" value="123-456-7890">` },
			{ name: 'url', template: html`<input class="d2l-test-input-text" type="url" value="https://www.d2l.com">` },
			{ name: 'disabled', template: html`<input class="d2l-test-input-text" disabled value="text disabled">` },
			{ name: 'placeholder', template: html`<input class="d2l-test-input-text" placeholder="placeholder">` },
			{ name: 'placeholder-disabled', template: html`<input class="d2l-test-input-text" disabled placeholder="placeholder disabled">` },
			{ name: 'invalid', template: sassInvalidFixture },
			{ name: 'invalid-disabled', template: html`<input class="d2l-test-input-text" disabled type="email" value="invalid-disabled@">` },
			{ name: 'invalid-focus', template: sassInvalidFixture, focus: true },
			{ name: 'aria-invalid', template: sassAriaInvalidFixture },
			{ name: 'aria-invalid-disabled', template: html`<input class="d2l-test-input-text" disabled value="aria-invalid-disabled" aria-invalid="true">` },
			{ name: 'aria-invalid-focus', template: sassAriaInvalidFixture, focus: true },
		].forEach(({ name, template, focus }) => {
			it(name, async() => {
				const elem = await fixture(template, { viewport });
				if (focus) await focusElem(elem);
				await expect(elem).to.be.golden();
			});
		});

	});

});
