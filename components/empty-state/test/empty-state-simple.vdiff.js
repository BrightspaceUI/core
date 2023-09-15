import '../empty-state-action-button.js';
import '../empty-state-action-link.js';
import '../empty-state-simple.js';
import { expect, fixture, html } from '@brightspace-ui/testing';

const short = 'There are no assignments to display.';
const long = 'There are no assignments to display. Adding additional text to wrap to the next line.';
const xlong = 'There are no assignments to display. Adding additional text here to wrap the text to the next line.';

const button = primary => html`<d2l-empty-state-action-button ?primary="${primary}" text="Create New Assignment"></d2l-empty-state-action-button>`;
const link = html`<d2l-empty-state-action-link text="Create New Assignment" href="#"></d2l-empty-state-action-link>`;

describe('empty-state-simple', () => {

	[true, false].forEach(rtl => {
		[
			{ name: 'normal', template: html`<d2l-empty-state-simple description="${short}"></d2l-empty-state-simple>` },
			{ name: 'normal-button', template: html`<d2l-empty-state-simple description="${short}">${button()}</d2l-empty-state-simple>` },
			{ name: 'normal-button-primary-blocked', template: html`<d2l-empty-state-simple description="${short}">${button(true)}</d2l-empty-state-simple>` },
			{ name: 'normal-link', template: html`<d2l-empty-state-simple description="${short}">${link}</d2l-empty-state-simple>` },
			{ name: 'wrap', template: html`<d2l-empty-state-simple description="${xlong}"></d2l-empty-state-simple>` },
			{ name: 'wrap-button', template: html`<d2l-empty-state-simple description="${long}">${button()}</d2l-empty-state-simple>` },
			{ name: 'wrap-link', template: html`<d2l-empty-state-simple description="${long}">${link}</d2l-empty-state-simple>` },
			{ name: 'no-description-button', template: html`<d2l-empty-state-simple>${button()}</d2l-empty-state-simple>` },
			{ name: 'no-description-link', template: html`<d2l-empty-state-simple>${link}</d2l-empty-state-simple>` }
		].forEach(({ name, template }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(template, { rtl });
				await expect(elem).to.be.golden();
			});
		});
	});
});
