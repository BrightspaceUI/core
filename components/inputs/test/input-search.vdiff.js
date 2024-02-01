import '../input-search.js';
import { expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { inlineHelpFixtures } from './input-shared-content.js';

const noValueFixture = html`<d2l-input-search label="search"></d2l-input-search>`;
const hasValueFixture = html`<d2l-input-search label="search" value="Apples"></d2l-input-search>`;

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
		{
			name: 'inline-help',
			template: new inlineHelpFixtures().search()
		},
		{
			name: 'inline-help-multiline',
			template: new inlineHelpFixtures({ multiline: true }).search()
		},
		{
			name: 'inline-help-skeleton',
			template: new inlineHelpFixtures({ skeleton: true }).search()
		},
		{
			name: 'inline-help-skeleton-multiline',
			template: new inlineHelpFixtures({ multiline: true, skeleton: true }).search()
		},
		{
			name: 'inline-help-disabled',
			template: new inlineHelpFixtures({ disabled: true }).search()
		}
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
