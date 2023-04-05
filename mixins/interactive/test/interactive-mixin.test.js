import { defineCE, expect, fixture, html } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
import { InteractiveMixin } from '../interactive-mixin.js';
import { keyDown } from '../../../tools/dom-test-helpers.js';
import { LitElement } from 'lit';

const mixinTag = defineCE(
	class extends InteractiveMixin(LitElement) {
		render() {
			return this.renderInteractiveContainer(
				html`<div><button class="content-button">interactive</button></div>`,
				'interactive label',
				() => this.shadowRoot.querySelector('.content-button').focus()
			);
		}
	}
);

describe('InteractiveMixin', () => {

	describe('Non-Interactive', () => {

		it('should not render interactive container if not a descendant of a grid', async() => {
			const elem = await fixture(`<${mixinTag}></${mixinTag}>`);
			expect(elem.shadowRoot.querySelector('.interactive-container')).to.be.null;
		});

	});

	describe('Interactive', () => {

		let fixtureElem, elem, toggle;

		beforeEach(async() => {
			fixtureElem = await fixture(`<div role="grid"><span id="before" tabindex="0"></span><${mixinTag}></${mixinTag}><span id="after" tabindex="0"></div>`);
			elem = fixtureElem.querySelector(mixinTag);
			await elem.updateComplete;
			toggle = elem.shadowRoot.querySelector('.interactive-toggle');
		});

		it('should render interactive container if a descendant of a grid', async() => {
			expect(toggle).not.be.null;
			expect(toggle.tabIndex).to.equal(0);
			expect(toggle.textContent).to.contain('interactive label');
		});

		it('should toggle to interactive mode when Enter pressed', async() => {
			toggle.focus();
			toggle.click();
			await new Promise(resolve => setTimeout(resolve, 0));
			const activeElement = getComposedActiveElement();
			expect(toggle.tabIndex).to.equal(-1);
			expect(activeElement).to.equal(elem.shadowRoot.querySelector('.content-button'));
		});

		it('should toggle to non-interactive mode when Escape pressed', async() => {
			toggle.focus();
			toggle.click();
			await new Promise(resolve => setTimeout(resolve, 0));
			expect(getComposedActiveElement()).to.equal(elem.shadowRoot.querySelector('.content-button'));
			keyDown(toggle, 27);
			await new Promise(resolve => setTimeout(resolve, 0));
			expect(getComposedActiveElement()).to.equal(toggle);
		});

		it('should toggle to interactive mode when focus moves into interactive contents', async() => {
			elem.shadowRoot.querySelector('.content-button').focus();
			await elem.updateComplete;
			expect(toggle.tabIndex).to.equal(-1);
		});

		it('should move focus past focusable contents when moving forwards and in non-interactive mode', async() => {
			toggle.focus();
			elem.shadowRoot.querySelector('.interactive-trap-start').focus();
			await new Promise(resolve => setTimeout(resolve, 0));
			expect(getComposedActiveElement()).to.equal(fixtureElem.querySelector('#after'));
		});

		it('should move focus past focusable contents when moving backwards and in non-interactive mode', async() => {
			fixtureElem.querySelector('#after').focus();
			elem.shadowRoot.querySelector('.interactive-trap-end').focus();
			await new Promise(resolve => setTimeout(resolve, 0));
			expect(getComposedActiveElement()).to.equal(toggle);
		});

		it('should move focus to toggle if moving focus backwards to outside from within focusable contents', async() => {
			elem.shadowRoot.querySelector('.content-button').focus();
			await elem.updateComplete;
			elem.shadowRoot.querySelector('.interactive-trap-start').focus();
			await new Promise(resolve => setTimeout(resolve, 0));
			expect(getComposedActiveElement()).to.equal(toggle);
		});

		it('should move focus to toggle if moving focus forwards to outside from within focusable contents', async() => {
			elem.shadowRoot.querySelector('.content-button').focus();
			await elem.updateComplete;
			elem.shadowRoot.querySelector('.interactive-trap-end').focus();
			await new Promise(resolve => setTimeout(resolve, 0));
			expect(getComposedActiveElement()).to.equal(toggle);
		});

	});

});
