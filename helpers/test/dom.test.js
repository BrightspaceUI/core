import { css, html, LitElement } from 'lit-element/lit-element.js';
import { defineCE, expect, fixture } from '@open-wc/testing';
import {
	findComposedAncestor,
	getComposedChildren,
	getComposedParent,
	getNextAncestorSibling,
	getOffsetParent,
	isComposedAncestor,
	isVisible
} from '../dom.js';

const testElemTag = defineCE(
	class extends LitElement {
		getContainer() {
			return this.shadowRoot.querySelector('#container');
		}
		render() {
			return html`<div id="container"><slot id="slot1"></slot></div>`;
		}
	},
);
const offsetParentWrapperTag = defineCE(
	class extends LitElement {
		static get properties() {
			return {
				wrapperId: { type: String, attribute: 'wrapper-id' }
			};
		}
		static get styles() {
			return css`
				#expected {
					position: relative;
				}
			`;
		}
		constructor() {
			super();
			this.wrapperId = 'notExpected';
		}
		render() {
			return html`<div id="${this.wrapperId}">
					<slot></slot>
				</div>
			`;
		}
	}
);

const simpleFixture = html`
	<div id="light1">
		<div id="light2"></div>
		some text
	</div>`
;
const wcFixture = `
	<${testElemTag}>
		<div id="light1"></div>
		<div id="light2"></div>
	</${testElemTag}>
`;
const mixedFixture = `
	<div id="light1">
		<${testElemTag} id="wc1">
			<div id="light2"></div>
			<div id="light3"></div>
		</${testElemTag}>
	</div>
`;

const visibilityFixture = html`
	<div>
		<div id="default"></div>
		<div id="fixedPosition" style="position:fixed;"></div>
		<div id="visibilityHidden" style="visibility:hidden;"></div>
		<div id="displayNone" style="display:none;"></div>
		<div style="display:none;"><div id="parentDisplayNone"></div></div>
		<div style="visibility:hidden;"><div id="parentVisibilityNone"></div></div>
	</div>
`;

describe('dom', () => {

	describe('isVisible', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(visibilityFixture);
		});

		it('returns true if it and all ancestors are visible', () => {
			expect(isVisible(elem.querySelector('#default'))).to.be.true;
		});

		it('returns false if web component ancestor has display:none', () => {
			elem.style.display = 'none';
			expect(isVisible(elem.querySelector('#default'))).to.be.false;
		});

		it('returns true if position fixed and all ancestors are visible', () => {
			expect(isVisible(elem.querySelector('#fixedPosition'))).to.be.true;
		});

		it('returns false if position fixed and ancestor has display: none', () => {
			elem.style.display = 'none';
			expect(isVisible(elem.querySelector('#fixedPosition'))).to.be.false;
		});

		it('returns false if inline style has visibility:hidden', () => {
			expect(isVisible(elem.querySelector('#visibilityHidden'))).to.be.false;
		});

		it('returns false if inline style has display:none', () => {
			expect(isVisible(elem.querySelector('#displayNone'))).to.be.false;
		});

		it('returns false if parent has display:none', () => {
			expect(isVisible(elem.querySelector('#parentDisplayNone'))).to.be.false;
		});

		it('returns false if parent has visibility:hidden', () => {
			expect(isVisible(elem.querySelector('#parentVisibilityNone'))).to.be.false;
		});

	});

	describe('findComposedAncestor', () => {

		it('finds ancestor with specified id', async() => {
			const elem = await fixture(simpleFixture);
			const predicate = (node) => { return node.id === 'light1'; };
			expect(findComposedAncestor(elem.querySelector('#light2'), predicate))
				.to.equal(elem);
		});

		it('does not find ancestor with specified id', async() => {
			const elem = await fixture(simpleFixture);
			const predicate = (node) => { return node.id === 'x'; };
			expect(findComposedAncestor(elem.querySelector('#light2'), predicate))
				.to.be.null;
		});

		it('finds shadow ancestor with specified id for light node', async() => {
			const elem = await fixture(wcFixture);
			const predicate = (node) => { return node.id === 'container'; };
			expect(findComposedAncestor(elem.querySelector('#light1'), predicate))
				.to.equal(elem.getContainer());
		});

		it('finds light ancestor with specified id for shadow node', async() => {
			const elem = await fixture(mixedFixture);
			const predicate = (node) => { return node.id === 'light1'; };
			expect(findComposedAncestor(elem.querySelector('#wc1').getContainer(), predicate))
				.to.equal(elem);
		});

	});

	describe('getComposedChildren', () => {

		it('returns child elememts', async() => {
			const elem = await fixture(simpleFixture);
			const children = getComposedChildren(elem);
			const expected = elem.children;
			expect(children.length).to.equal(expected.length);
			expect(children[0]).to.equal(expected[0]);
		});

		it('returns child elememts for document', async() => {
			const children = getComposedChildren(document);
			const expected = document.children;
			expect(children.length).to.equal(expected.length);
			expect(children[0]).to.equal(expected[0]);
		});

		it('returns shadow child elememts', async() => {
			const elem = await fixture(wcFixture);
			const children = getComposedChildren(elem);
			expect(children.length).to.equal(1);
			expect(children[0]).to.equal(elem.getContainer());
		});

		it('returns distributed child elements for insertion point', async() => {
			const elem = await fixture(wcFixture);
			const container = elem.getContainer();
			let children = getComposedChildren(container);
			expect(children[0].tagName).to.be.oneOf(['SLOT', 'CONTENT']);
			children = getComposedChildren(children[0]);
			expect(children.length).to.equal(2);
			expect(children[0]).to.equal(elem.querySelector('#light1'));
			expect(children[1]).to.equal(elem.querySelector('#light2'));
		});

	});

	describe('getComposedParent', () => {

		it('returns parent', async() => {
			const elem = await fixture(simpleFixture);
			expect(getComposedParent(elem.querySelector('#light2')))
				.to.equal(elem);
		});

		it('returns insertion point as parent of distributed node', async() => {
			const elem = await fixture(wcFixture);
			expect(getComposedParent(elem.querySelector('#light1')))
				.to.equal(elem.querySelector('#light1').assignedSlot);
		});

		it('returns host as parent of shadow-root', async() => {
			const elem = await fixture(wcFixture);
			expect(getComposedParent(elem.shadowRoot))
				.to.equal(elem);
		});

		it('returns null as parent of detached element', async() => {
			expect(getComposedParent(document.createElement('div')))
				.to.equal(null);
		});

		it('returns null as parent of document', async() => {
			expect(getComposedParent(document))
				.to.equal(null);
		});

	});

	describe('getOffsetParent', () => {

		it('direct-parent', async() => {
			const elem = await fixture(html`
				<div>
					<div class="expected" style="position: relative;">
						<div class="child"></div>
					</div>
				</div>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('indirect-parent', async() => {
			const elem = await fixture(html`
				<div>
					<div class="expected" style="position: relative;">
						<div>
							<div class="child"></div>
						</div>
					</div>
				</div>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('td', async() => {
			const elem = await fixture(html`
				<table>
					<td class="expected" style="position: static;">
						<div class="child"></div>
					</td>
				</table>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('th', async() => {
			const elem = await fixture(html`
				<table>
					<th class="expected" style="position: static;">
						<div class="child"></div>
					</th>
				</table>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('table', async() => {
			const elem = await fixture(html`
				<div>
					<table class="expected" style="position: static;">
						<tbody class="child"></tbody>
					</table>
				</div>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('wrapper-inside', async() => {
			const elem = await fixture(`
				<${offsetParentWrapperTag}>
					<div class="expected" style="position: relative">
						<div class="child"></div>
					<div>
				</${offsetParentWrapperTag}>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('wrapper-passthrough', async() => {
			const elem = await fixture(`
				<div>
					<div class="expected" style="position: relative">
						<${offsetParentWrapperTag}>
							<div class="child"></div>
						</${offsetParentWrapperTag}>
					</div>
				</div>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('wrapper-is-parent', async() => {
			const elem = await fixture(`
				<div>
					<${offsetParentWrapperTag} class="expected" style="position: relative">
						<div class="child"></div>
					</${offsetParentWrapperTag}>
				</div>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		it('nested-wrapper-is-parent', async() => {
			const elem = await fixture(`
				<div>
					<${offsetParentWrapperTag} class="expected" style="position: relative">
						<${offsetParentWrapperTag}>
							<div class="child"></div>
						</${offsetParentWrapperTag}>
					</${offsetParentWrapperTag}>
				</div>
			`);
			const child = elem.querySelector('.child');
			const expected = elem.querySelector('.expected');
			expect(getOffsetParent(child)).to.equal(expected);
		});

		/*[
			'direct-parent',
			'indirect-parent',
			'td',
			'th',
			'table',
			'wrapper-inside',
			'wrapper-passthrough',
			'wrapper-is-parent',
			'nested-wrapper-is-parent'
		].forEach(fixtureName => {
			it(fixtureName, async() => {
				const fixt = fixture(fixtureName);
				await fixt.updateComplete;
				const child = fixt.querySelector('.child');
				const expected = fixt.querySelector('.expected');
				expect(getOffsetParent(child)).to.equal(expected);
			});
		});*/

		it('wrapper-simple', async() => {
			const elem = await fixture(`
				<div>
					<${offsetParentWrapperTag} wrapper-id="expected">
						<div class="child"></div>
					</${offsetParentWrapperTag}>
				</div>
			`);
			const child = elem.querySelector('.child');
			expect(getOffsetParent(child).id).to.equal('expected');
		});

		it('wrapper-nested', async() => {
			const elem = await fixture(`
				<div>
					<${offsetParentWrapperTag}>
						<${offsetParentWrapperTag} wrapper-id="expected">
							<div class="child"></div>
						</${offsetParentWrapperTag}>
					</${offsetParentWrapperTag}>
				</div>
			`);
			const child = elem.querySelector('.child');
			expect(getOffsetParent(child).id).to.equal('expected');
		});

		it('fallback-when-shadowroot-undefined', () => {
			const tempShadowRoot = window.ShadowRoot;
			window.ShadowRoot = false;
			const child = {
				offsetParent: 'this is the offsetParent'
			};
			expect(getOffsetParent(child)).to.equal(child.offsetParent);
			window.ShadowRoot = tempShadowRoot;
		});

		it('body', () => {
			const body = document.querySelector('body');
			expect(getOffsetParent(body)).to.equal(null);
		});

		it('orphan', () => {
			const child = document.createElement('div');
			expect(getOffsetParent(child)).to.equal(null);
		});

		it('orphan-with-extra-steps', () => {
			const grandparent = document.createElement('div');
			const parent = document.createElement('div');
			const child = document.createElement('div');
			grandparent.appendChild(parent);
			parent.appendChild(child);
			expect(getOffsetParent(child)).to.equal(null);
		});

		it('fixed', async() => {
			const elem = await fixture(html`<div style="position: fixed;"></div>`);
			expect(getOffsetParent(elem)).to.equal(null);
		});

		it('body-is-parent', () => {
			const elem = document.createElement('div');
			document.body.appendChild(elem);
			expect(getOffsetParent(elem)).to.equal(document.body);
		});

	});

	describe('getNextAncestorSibling', () => {

		it('returns null when no siblings', async() => {
			const elem = await fixture(simpleFixture);
			expect(getNextAncestorSibling(elem)).to.be.null;
		});

		it('returns the ancestor sibling one level up', async() => {
			const elem = await fixture(html`
			<div id="parent">
				<div>
					<div id="target"></div>
				</div>
				<div id="expected"></div>
				<div></div>
			</div>
			`);
			expect(getNextAncestorSibling(elem.querySelector('#target')))
				.to.be.equal(elem.querySelector('#expected'));
		});

		it('returns the ancestor sibling two levels up', async() => {
			const elem = await fixture(html`
			<div id="parent">
				<div>
					<div>
						<div id="target"></div>
					</div>
				</div>
				<div id="expected"></div>
			</div>
			`);
			expect(getNextAncestorSibling(elem.querySelector('#target')))
				.to.be.equal(elem.querySelector('#expected'));
		});
	});

	describe('isComposedAncestor', () => {

		it('returns true if ancestor', async() => {
			const elem = await fixture(simpleFixture);
			expect(isComposedAncestor(elem, elem.querySelector('#light2')))
				.to.be.true;
		});

		it('returns true if ancestor and node are same', async() => {
			const elem = await fixture(simpleFixture);
			expect(isComposedAncestor(elem, elem))
				.to.be.true;
		});

		it('returns false not ancestor', async() => {
			const elem = await fixture(simpleFixture);
			expect(isComposedAncestor(elem.querySelector('#light2'), elem))
				.to.be.false;
		});

		it('returns true if shadow ancestor of light descendant', async() => {
			const elem = await fixture(wcFixture);
			expect(isComposedAncestor(elem.getContainer(), elem.querySelector('#light2')))
				.to.be.true;
		});

		it('returns false if light sibling', async() => {
			const elem = await fixture(wcFixture);
			expect(isComposedAncestor(elem.querySelector('#light3'), elem.querySelector('#light2')))
				.to.be.false;
		});

		it('returns true if light ancestor of shadow descendant', async() => {
			const elem = await fixture(mixedFixture);
			expect(isComposedAncestor(elem, elem.querySelector('#light2')))
				.to.be.true;
		});

	});

});
