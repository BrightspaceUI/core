
import { defineCE, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { FocusMixin } from '../focus-mixin.js';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { LitElement } from 'lit';

const mixinTag = defineCE(
	class extends FocusMixin(LitElement) {
		static get focusElementSelector() {
			return 'input';
		}
		render() {
			return html`<input type="text">`;
		}
	}
);

const mixinNoSelectorTag = defineCE(
	class extends FocusMixin(LitElement) {}
);

const mixinNoElemTag = defineCE(
	class extends FocusMixin(LitElement) {
		static get focusElementSelector() {
			return 'div';
		}
		render() {
			return html`<input type="text">`;
		}
	}
);

describe('FocusMixin', () => {

	it('should delegate focus to underlying input', async() => {
		const elem = await fixture(`<${mixinTag}></${mixinTag}>`);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		const activeElement = getComposedActiveElement();
		expect(activeElement).to.equal(elem.shadowRoot.querySelector('input'));
	});

	it('should focus even if component has not rendered', async() => {
		const container = await fixture(html`<div></div>`);
		const elem = document.createElement(mixinTag);
		container.appendChild(elem);
		setTimeout(() => elem.focus());
		await oneEvent(elem, 'focus');
		const activeElement = getComposedActiveElement();
		expect(activeElement).to.equal(elem.shadowRoot.querySelector('input'));
	});

	it('should throw if no selector is provided', async() => {
		const elem = await fixture(`<${mixinNoSelectorTag}></${mixinNoSelectorTag}>`);
		expect(() => elem.focus())
			.to.throw(`FocusMixin: no static focusElementSelector provided for "${mixinNoSelectorTag.toUpperCase()}"`);
	});

	it('should throw if no selector yields no element', async() => {
		const elem = await fixture(`<${mixinNoElemTag}></${mixinNoElemTag}>`);
		expect(() => elem.focus())
			.to.throw(`FocusMixin: selector "div" yielded no element for "${mixinNoElemTag.toUpperCase()}"`);
	});

});
