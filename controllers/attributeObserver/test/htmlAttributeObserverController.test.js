import { defineCE, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { HtmlAttributeObserverController } from '../htmlAttributeObserverController.js';
import { LitElement } from 'lit';

const testAttr = 'test-attr';
const testAttrVal = 'test';
const otherTestAttr = 'other-test-attr';
const otherTestAttrVal = 'other-test';
const controllerUpdateEvent = 'test-controller-update';

const testHost = listeningAttributes => defineCE(
	class extends LitElement {
		constructor() {
			super();
			const attributes = listeningAttributes || [testAttr];
			this._controller = new HtmlAttributeObserverController(this, ...attributes);
		}
		connectedCallback() {
			super.connectedCallback();
			this._initialControllerVal = { ...this._controller.values };
		}
		render() {
			const htmlSegments = [];
			for (const [attr, val] of this._controller.values) {
				htmlSegments.push(html`<div id="${attr}">${val}</div>`);
			}
			return html`${htmlSegments}`;
		}
		updated() {
			super.updated();
			if (this._hasChanged()) this.dispatchEvent(new CustomEvent(controllerUpdateEvent));
		}
		getControllerVal(attr) {
			return this._controller.values.get(attr);
		}
		getRenderedVal(attr) {
			const elem = this.shadowRoot && this.shadowRoot.querySelector(`#${attr}`);
			return (elem && elem.textContent) || undefined;
		}
		_hasChanged() {
			if (this._initialControllerVal.size !== this._controller.values.size) return true;
			for (const [attr, val] of this._initialControllerVal) {
				if (!this._controller.values.has(attr)) return true;
				if (this._controller.values.get(attr) !== val) return true;
			}
			return false;
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
			expect(elem.getControllerVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getRenderedVal(testAttr)).to.equal(testAttrVal);
		});

		it('returns undefined if attribute not present', async() => {
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			expect(elem.getControllerVal(testAttr)).to.equal(undefined);
			expect(elem.getRenderedVal(testAttr)).to.equal(undefined);
		});

	});

	describe('Attribute modification', () => {

		it('returns new attribute value if attribute is changed', async() => {
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			setAttribute();
			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getRenderedVal(testAttr)).to.equal(testAttrVal);
		});

		it('returns undefined if attribute is removed', async() => {
			setAttribute();
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			removeAttribute();
			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal(testAttr)).to.equal(undefined);
			expect(elem.getRenderedVal(testAttr)).to.equal(undefined);
		});

		it('does not update if host is disconnected', async() => {
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			elem.remove();
			await elem.updateComplete;

			setAttribute();
			expect(elem.getControllerVal(testAttr)).to.equal(undefined);
			expect(elem.getRenderedVal(testAttr)).to.equal(undefined);
		});

	});

	describe('Multiple controllers', () => {

		it('only updates the listening controller', async() => {
			const ignoredAttribute = 'some-other-attribute';
			const elem = await fixture(`<${testHost()}></${testHost()}>`);
			const otherElem = await fixture(`<${testHost([ignoredAttribute])}></${testHost([ignoredAttribute])}>`);
			setAttribute();

			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getRenderedVal(testAttr)).to.equal(testAttrVal);
			expect(otherElem.getControllerVal(testAttr)).to.equal(undefined);
			expect(otherElem.getRenderedVal(testAttr)).to.equal(undefined);
		});

	});

	describe('Multiple attributes', () => {

		const setOtherAttribute = () => {
			document.documentElement.setAttribute(otherTestAttr, otherTestAttrVal);
		};

		const removeOtherAttribute = () => {
			document.documentElement.removeAttribute(otherTestAttr);
		};

		beforeEach(() => {
			removeOtherAttribute();
		});

		it('returns new value if any attribute is changed', async() => {
			const elem = await fixture(`<${testHost([testAttr, otherTestAttr])}></${testHost([testAttr, otherTestAttr])}>`);
			setAttribute();
			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getControllerVal(otherTestAttr)).to.equal(undefined);
			expect(elem.getRenderedVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getRenderedVal(otherTestAttr)).to.equal(undefined);
		});

		it('returns new value if all attributes are changed', async() => {
			setAttribute();
			const elem = await fixture(`<${testHost([testAttr, otherTestAttr])}></${testHost([testAttr, otherTestAttr])}>`);
			setOtherAttribute();
			await oneEvent(elem, controllerUpdateEvent);
			expect(elem.getControllerVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getControllerVal(otherTestAttr)).to.equal(otherTestAttrVal);
			expect(elem.getRenderedVal(testAttr)).to.equal(testAttrVal);
			expect(elem.getRenderedVal(otherTestAttr)).to.equal(otherTestAttrVal);
		});

	});

});
