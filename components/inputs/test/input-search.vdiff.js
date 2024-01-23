import '../input-search.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';

const noValueFixture = html`<d2l-input-search label="search"></d2l-input-search>`;
const hasValueFixture = html`<d2l-input-search label="search" value="Apples"></d2l-input-search>`;
const inlineHelpFixtures = {
	normal: html`
		<d2l-input-search label="Search" value="apples" placeholder="Search for some stuff">
			<div slot="inline-help">
				Help text <b>right here</b>!
			</div>
		</d2l-input-search>
	`,
	multiline: html`
		<d2l-input-search label="Search" value="apples" placeholder="Search for some stuff">
			<div slot="inline-help">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit,
				sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
				Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
				nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
				reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
				pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
				qui officia deserunt mollit anim id est laborum.
			</div>
		</d2l-input-search>
	`
};

const viewport = { width: 376 };

describe('d2l-input-search', () => {

	[
		{ name: 'no-value', template: noValueFixture },
		{ name: 'has-value', template: hasValueFixture },
		{ name: 'no-clear', template: html`<d2l-input-search label="search" value="Apples" no-clear></d2l-input-search>` },
		{ name: 'disabled', template: html`<d2l-input-search label="search" value="Apples" disabled></d2l-input-search>` },
		{ name: 'placeholder', template: html`<d2l-input-search label="search" placeholder="Search for something..."></d2l-input-search>` },
		{ name: 'placeholder-disabled', template: html`<d2l-input-search label="search" placeholder="Search for something..." disabled></d2l-input-search>` },
		{ name: 'padding', template: html`<d2l-input-search label="search" style="padding: 10px;"></d2l-input-search>` },
		{ name: 'flexbox', template: html`<div style="display: flex;"><d2l-input-search label="search"></d2l-input-search><p>stuff</p></div>` },
		{ name: 'inline-help', template: inlineHelpFixtures.normal },
		{ name: 'inline-help-multiline', template: inlineHelpFixtures.multiline }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(template, { viewport });
			await expect(elem).to.be.golden();
		});
	});

	it('focus-input', async() => {
		const elem = await fixture(noValueFixture, { viewport });
		await focusElem(elem);
		await expect(elem).to.be.golden();
	});

	it('focus-search-button', async() => {
		const elem = await fixture(noValueFixture, { viewport });
		await focusElem(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:search"]'));
		await expect(elem).to.be.golden();
	});

	it('focus-clear-button', async() => {
		const elem = await fixture(hasValueFixture, { viewport });
		await focusElem(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:close-default"]'));
		await expect(elem).to.be.golden();
	});

	it('hover-search-button', async() => {
		const elem = await fixture(noValueFixture, { viewport });
		await hoverElem(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:search"]'));
		await expect(elem).to.be.golden();
	});

	it('hover-clear-button', async() => {
		const elem = await fixture(hasValueFixture, { viewport });
		await hoverElem(elem.shadowRoot.querySelector('d2l-button-icon[icon="tier1:close-default"]'));
		await expect(elem).to.be.golden();
	});

});
