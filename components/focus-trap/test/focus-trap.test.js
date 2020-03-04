import '../focus-trap.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';

const normalFixture = html`
	<div>
		<a id="before" href="http://www.d2l.com">Before</a>
		<d2l-focus-trap>
			<a id="first" href="http://www.d2l.com">First</a>
			some content
			<a id="middle" href="http://www.d2l.com">Middle</a>
			some content
			<a id="last" href="http://www.d2l.com">Last</a>
		</d2l-focus-trap>
		<a id=after"" href="http://www.d2l.com">After</a>
	</div>
`;

describe('d2l-focus-trap', () => {

	let elem, focusTrap;
	beforeEach(async() => {
		elem = await fixture(normalFixture);
		focusTrap = elem.querySelector('d2l-focus-trap');
	});

	describe('not trapping', () => {

		it('does not redirects body focus', () => {
			elem.querySelector('#before').focus();
			expect(document.activeElement).to.equal(elem.querySelector('#before'));
		});

		it('does not render traps', () => {
			expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').hasAttribute('tabindex')).to.be.false;
			expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').hasAttribute('tabindex')).to.be.false;
		});

	});

	describe('trapping', () => {

		beforeEach(async() => {
			focusTrap.trap = true;
			await focusTrap.updateComplete;
		});

		it('render traps', () => {
			expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').getAttribute('tabindex')).to.equal('0');
			expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').getAttribute('tabindex')).to.equal('0');
		});

		it('redirects body focus', () => {
			elem.querySelector('#before').focus();
			expect(document.activeElement).to.equal(elem.querySelector('#first'));
		});

		it('does not redirect from children', () => {
			elem.querySelector('#middle').focus();
			expect(document.activeElement).to.equal(elem.querySelector('#middle'));
		});

		it('dispatches d2l-focus-trap-enter', async() => {
			setTimeout(() => elem.querySelector('#before').focus());
			await oneEvent(focusTrap, 'd2l-focus-trap-enter');
		});

		it('wraps to first', () => {
			focusTrap.querySelector('#last').focus();
			focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').focus();
			expect(document.activeElement).to.equal(elem.querySelector('#first'));
		});

		it('wraps to last', () => {
			focusTrap.querySelector('#first').focus();
			focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').focus();
			expect(document.activeElement).to.equal(elem.querySelector('#last'));
		});

	});

});
