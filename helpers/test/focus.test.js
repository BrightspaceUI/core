import { defineCE, expect, fixture, html } from '@brightspace-ui/testing';
import {
	getComposedActiveElement,
	getFirstFocusableDescendant,
	getLastFocusableDescendant,
	getNextFocusable,
	getPreviousFocusable,
	getPreviousFocusableAncestor,
	isFocusable
} from '../focus.js';
import { LitElement } from 'lit';

const testElemTag = defineCE(
	class extends LitElement {
		render() {
			return html`
				<div>
					<div><a id="shadow1" href="javascript:void(0);"></a></div>
					<div id="content"><slot></slot></div>
					<div><a id="shadow2" href="javascript:void(0);"></a></div>
				</div>
			`;
		}
		getContent() {
			return this.shadowRoot && this.shadowRoot.querySelector('#content');
		}
		getShadow1() {
			return this.shadowRoot && this.shadowRoot.querySelector('#shadow1');
		}
		getShadow2() {
			return this.shadowRoot && this.shadowRoot.querySelector('#shadow2');
		}
	},
);

const simpleFixture = html`
	<div>
		<a id="light1" href="javascript:void(0);"></a>
		<a id="light2" href="javascript:void(0);"></a>
	</div>
`;
const wcFixture = `
	<${testElemTag}>
		<a id="light1" href="javascript:void(0);"></a>
		<a id="light2" href="javascript:void(0);"></a>
	</${testElemTag}>
`;
const nestedFixture = html`
	<div>
		<div>
			<a id="light1" href="javascript:void(0);"></a>
			<a id="light2" href="javascript:void(0);"></a>
		</div>
		<a id="light3" href="javascript:void(0);"></a>
	</div>
`;
const mixedFixture = `
	<div>
		<a id="light1" href="javascript:void(0);"></a>
		<${testElemTag} id="wc1">
			<a id="light3" href="javascript:void(0);"></a>
		</${testElemTag}>
		<a id="light2" href="javascript:void(0);"></a>
	</div>
`;
const focusableFixture = html`
	<div>
		<div id="optionallyFocusable">
			<a></a>
			<button></button>
			some text node
			<!-- some comment node -->
		</div>
	</div>
`;
const focusableNotTabbableFixture = html`
	<div>
		<div id="not-focusable" class="same-class"></div>
		<div id="focusable" class="same-class" tabindex="-1"></div>
	</div>
`;

describe('focus', () => {

	describe('getComposedActiveElement', () => {

		it('returns composed light-dom element', async() => {
			const elem = await fixture(wcFixture);
			const expected = elem.querySelector('#light1');
			expected.focus();
			expect(getComposedActiveElement()).to.equal(expected);
		});

		it('returns composed shadow-dom element', async() => {
			const elem = await fixture(wcFixture);
			const expected = elem.getShadow1();
			expected.focus();
			expect(getComposedActiveElement()).to.equal(expected);
		});

	});

	describe('getFirstFocusableDescendant without predicate', () => {

		it('returns focusable child', async() => {
			const elem = await fixture(simpleFixture);
			expect(getFirstFocusableDescendant(elem))
				.to.equal(elem.querySelector('#light1'));
		});

		it('returns focusable descendant', async() => {
			const elem = await fixture(nestedFixture);
			expect(getFirstFocusableDescendant(elem))
				.to.equal(elem.querySelector('#light1'));
		});

		it('returns null if no children', async() => {
			const elem = await fixture(html`<div></div>`);
			expect(getFirstFocusableDescendant(elem))
				.to.be.null;
		});

		it('returns focusable child in shadow-dom', async() => {
			const elem = await fixture(wcFixture);
			expect(getFirstFocusableDescendant(elem))
				.to.equal(elem.getShadow1());
		});

		it('returns focusable distributed child', async() => {
			const elem = await fixture(wcFixture);
			expect(getFirstFocusableDescendant(elem.getContent()))
				.to.equal(elem.querySelector('#light1'));
		});

		it('returns focusable not tabblable child', async() => {
			const elem = await fixture(focusableNotTabbableFixture);
			expect(getFirstFocusableDescendant(elem, false, undefined, false))
				.to.equal(elem.querySelector('#focusable'));
		});

	});

	describe('getFirstFocusableDescendant with predicate', () => {
		const lightPredicate = node => node.id === 'light2';
		const shadowPredicate = node => node.id === 'shadow2';
		const classPredicate = node => node.classList.contains('same-class');

		it('returns focusable child', async() => {
			const elem = await fixture(simpleFixture);
			expect(getFirstFocusableDescendant(elem, false, lightPredicate))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns focusable descendant', async() => {
			const elem = await fixture(nestedFixture);
			expect(getFirstFocusableDescendant(elem, false, lightPredicate))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns null if no children', async() => {
			const elem = await fixture(html`<div></div>`);
			expect(getFirstFocusableDescendant(elem, false, lightPredicate))
				.to.be.null;
		});

		it('returns focusable child in shadow-dom', async() => {
			const elem = await fixture(wcFixture);
			expect(getFirstFocusableDescendant(elem, false, shadowPredicate))
				.to.equal(elem.getShadow2());
		});

		it('returns focusable distributed child', async() => {
			const elem = await fixture(wcFixture);
			expect(getFirstFocusableDescendant(elem.getContent(), false, lightPredicate))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns focusable not tabblable child', async() => {
			const elem = await fixture(focusableNotTabbableFixture);
			expect(getFirstFocusableDescendant(elem, false, classPredicate, false))
				.to.equal(elem.querySelector('#focusable'));
		});

	});

	describe('getLastFocusableDescendant', () => {

		it('returns last focusable child', async() => {
			const elem = await fixture(simpleFixture);
			expect(getLastFocusableDescendant(elem))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns last focusable descendant', async() => {
			const elem = await fixture(nestedFixture);
			expect(getLastFocusableDescendant(elem))
				.to.equal(elem.querySelector('#light3'));
		});

		it('returns null if no children', async() => {
			const elem = await fixture(html`<div></div>`);
			expect(getLastFocusableDescendant(elem))
				.to.be.null;
		});

		it('returns focusable last child in shadow-dom', async() => {
			const elem = await fixture(wcFixture);
			expect(getLastFocusableDescendant(elem))
				.to.equal(elem.getShadow2());
		});

		it('returns focusable last distributed child', async() => {
			const elem = await fixture(wcFixture);
			expect(getLastFocusableDescendant(elem.getContent()))
				.to.equal(elem.querySelector('#light2'));
		});

	});

	describe('getNextFocusable', () => {

		it('returns focusable child', async() => {
			const elem = await fixture(simpleFixture);
			expect(getNextFocusable(elem))
				.to.equal(elem.querySelector('#light1'));
		});

		it('returns focusable sibling', async() => {
			const elem = await fixture(simpleFixture);
			expect(getNextFocusable(elem.querySelector('#light1')))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns focusable parent sibling', async() => {
			const elem = await fixture(nestedFixture);
			expect(getNextFocusable(elem.querySelector('#light1')))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns focusable shadow parent sibling', async() => {
			const elem = await fixture(wcFixture);
			expect(getNextFocusable(elem.querySelector('#light2')))
				.to.equal(elem.getShadow2());
		});

		it('returns focusable host sibling', async() => {
			const elem = await fixture(mixedFixture);
			expect(getNextFocusable(elem.querySelector('#wc1').getShadow2()))
				.to.equal(elem.querySelector('#light2'));
		});

	});

	describe('getPreviousFocusable', () => {

		it('returns previous focusable sibling', async() => {
			const elem = await fixture(simpleFixture);
			expect(getPreviousFocusable(elem.querySelector('#light2')))
				.to.equal(elem.querySelector('#light1'));
		});

		it('returns previous focusable parent sibling child', async() => {
			const elem = await fixture(nestedFixture);
			expect(getPreviousFocusable(elem.querySelector('#light3')))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns previous focusable shadow parent sibling', async() => {
			const elem = await fixture(wcFixture);
			expect(getPreviousFocusable(elem.querySelector('#light1')))
				.to.equal(elem.getShadow1());
		});

		it('returns previous focusable sibling distributed element', async() => {
			const elem = await fixture(wcFixture);
			expect(getPreviousFocusable(elem.getShadow2()))
				.to.equal(elem.querySelector('#light2'));
		});

		it('returns previous focusable host sibling', async() => {
			const elem = await fixture(mixedFixture);
			expect(getPreviousFocusable(elem.querySelector('#wc1').getShadow1()))
				.to.equal(elem.querySelector('#light1'));
		});

	});

	describe('getPreviousFocusableAncestor', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(focusableFixture);
		});

		it('returns focusable div', () => {
			const focusableDiv = elem.querySelector('#optionallyFocusable');
			focusableDiv.setAttribute('tabindex', '-1');
			expect(getPreviousFocusableAncestor(elem.querySelector('a'), false, false))
				.to.equal(focusableDiv);
		});

		it('returns body when no ancestor focusable', () => {
			expect(getPreviousFocusableAncestor(elem.querySelector('a'), false, false))
				.to.equal(document.body);
		});

	});

	describe('isFocusable', () => {

		let elem;
		beforeEach(async() => {
			elem = await fixture(focusableFixture);
		});

		it('returns true for standard anchor', () => {
			expect(isFocusable(elem.querySelector('a'))).to.be.true;
		});

		it('returns true for anchor with tabindex=0', () => {
			elem.querySelector('a').setAttribute('tabindex', '0');
			expect(isFocusable(elem.querySelector('a'))).to.be.true;
		});

		it('returns false if tabindex=-1 and includeTabbablesOnly is undefined', () => {
			elem.querySelector('a').setAttribute('tabindex', '-1');
			expect(isFocusable(elem.querySelector('a'))).to.be.false;
		});

		it('returns false if tabindex=-1 and includeTabbablesOnly is true', () => {
			elem.querySelector('a').setAttribute('tabindex', '-1');
			expect(isFocusable(elem.querySelector('a'), null, true)).to.be.false;
		});

		it('returns true if tabindex=-1 and includedTabbablesOnly is false', () => {
			elem.querySelector('a').setAttribute('tabindex', '-1');
			expect(isFocusable(elem.querySelector('a'), null, false)).to.be.true;
		});

		it('returns false if not displayed', () => {
			elem.querySelector('a').style.display = 'none';
			expect(isFocusable(elem.querySelector('a'))).to.be.false;
		});

		it('returns true if not displayed and includeHidden=true', () => {
			elem.querySelector('a').style.display = 'none';
			expect(isFocusable(elem.querySelector('a'), true)).to.be.true;
		});

		it('returns false if not displayed and includeHidden=false', () => {
			elem.querySelector('a').style.display = 'none';
			expect(isFocusable(elem.querySelector('a'), false)).to.be.false;
		});

		it('returns true for standard button', () => {
			expect(isFocusable(elem.querySelector('button'))).to.be.true;
		});

		it('returns false for disabled button', () => {
			elem.querySelector('button').setAttribute('disabled', true);
			expect(isFocusable(elem.querySelector('button'))).to.be.false;
		});

		it('returns false for text node', () => {
			const textNode = elem.querySelector('button').nextSibling;
			expect(isFocusable(textNode)).to.be.false;
		});

		it('returns false for document node', () => {
			expect(isFocusable(document)).to.be.false;
		});

		it('returns false for comment node', () => {
			const commentNode = elem.querySelector('button').nextSibling.nextSibling;
			expect(isFocusable(commentNode)).to.be.false;
		});

	});

});
