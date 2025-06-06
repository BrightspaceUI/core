import '../../icons/icon-custom.js';
import { defineCE, expect, fixture } from '@brightspace-ui/testing';
import { html, LitElement } from 'lit';
import { SlottedIconMixin } from '../slotted-icon-mixin.js';

const tagName = defineCE(
	class extends SlottedIconMixin(LitElement) {
		render() {
			return html`
				${this._renderIcon()}
			`;
		}
	}
);

describe('SlottedIconMixin', () => {
	[
		{
			name: 'no-icon',
			elemFixture: `<${tagName}></${tagName}>`,
			hasIcon: false,
		},
		{
			name: 'icon',
			elemFixture: `<${tagName} icon='tier1:edit'></${tagName}>`,
			hasIcon: true,
		}, {
			name: 'slot icon',
			elemFixture: `<${tagName}>
				<d2l-icon-custom slot="icon">
					<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
						<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
						<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
					</svg>
				</d2l-icon-custom>
			</${tagName}>`,
			hasIcon: true,
			slottedSelector: 'd2l-icon-custom',
			slottedDisplay: 'inline-flex'
		}, {
			name: 'slot invalid icon',
			elemFixture: `<${tagName}><span slot="icon">Not an icon</span></${tagName}>`,
			hasIcon: false,
			slottedSelector: 'span',
			slottedDisplay: 'none'
		}
	].forEach(({ name, elemFixture, hasIcon, slottedSelector, slottedDisplay }) => {
		it(name, async() => {
			const elem = await fixture(elemFixture);
			expect(elem.hasIcon()).to.equal(hasIcon);
			if (slottedSelector) {
				const slottedElem = elem.querySelector(slottedSelector);

				expect(window.getComputedStyle(slottedElem).display).to.equal(slottedDisplay);
			}
		});
	});
});
