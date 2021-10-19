import { defineCE, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { HtmlAttributeObserverController } from '../htmlAttributeObserverController.js';
import { LitElement } from 'lit-element/lit-element.js';

const testAttr = 'test-attr';
const testAttrVal = 'test';
const controllerUpdateEvent = 'test-controller-update';

const testHost = listeningAttribute => defineCE(
	class extends LitElement {
		constructor() {
			super();
			this._controller = new HtmlAttributeObserverController(this, listeningAttribute || testAttr);
		}
		connectedCallback() {
			super.connectedCallback();
			this._controller.hostConnected();
			this._initialControllerVal = this._controller.value;
		}
		disconnectedCallback() {
			super.disconnectedCallback();
			this._controller.hostDisconnected();
		}
		render() {
			return html`<span id="val">${this._controller.value}</span>`;
		}
		updated() {
			super.updated();
			if (this._controller.value !== this._initialControllerVal) {
				this.dispatchEvent(new CustomEvent(controllerUpdateEvent));
			}
		}
		getControllerVal() {
			return this._controller.value;
		}
		getRenderedVal() {
			return this.shadowRoot.querySelector('#val').textContent;
		}
	},
);

describe('htmlAttributeObserverController', () => {

	const setAttribute = () => {
		document.documentElement.setAttribute(testAttr, testAttrVal);
	};

	const removeAttribute = () => {
		document.documentElement.removeAttribute(testAttr);
	};

	beforeEach(() => {
		removeAttribute();
	});

	describe('Controller initialization', () => {

		it('returns attribute value if attribute present', async() => {
			setAttribute();
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			expect(elem.getControllerVal()).to.equal(testAttrVal);
			expect(elem.getRenderedVal()).to.equal(testAttrVal);
		});

		it('returns null if attribute not present', async() => {
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			expect(elem.getControllerVal()).to.equal(null);
			expect(elem.getRenderedVal()).to.equal('');
		});

	});

	describe('Attribute modification', () => {

		it('returns new attribute value if attribute is changed', async() => {
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			setAttribute();
			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal()).to.equal(testAttrVal);
			expect(elem.getRenderedVal()).to.equal(testAttrVal);
		});

		it('returns null if attribute is removed', async() => {
			setAttribute();
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			removeAttribute();
			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal()).to.equal(null);
			expect(elem.getRenderedVal()).to.equal('');
		});

		it('does not update if host is disconnected', async() => {
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			elem.remove();
			await elem.updateComplete;

			setAttribute();
			expect(elem.getControllerVal()).to.equal(null);
			expect(elem.getRenderedVal()).to.equal('');
		});

	});

	describe('Multiple controllers', () => {

		it('only updates the listening controller', async() => {
			const otherAttribute = 'some-other-attribute';
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			const otherElem = await fixture(`<${testHost(otherAttribute)}></${testHost(otherAttribute)}>`);
			setAttribute();

			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal()).to.equal(testAttrVal);
			expect(elem.getRenderedVal()).to.equal(testAttrVal);
			expect(otherElem.getControllerVal()).to.equal(null);
			expect(otherElem.getRenderedVal()).to.equal('');
		});

	});

});
