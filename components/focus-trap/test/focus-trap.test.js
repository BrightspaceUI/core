import '../focus-trap.js';
import { expect, fixture, html, oneEvent, runConstructor } from '@brightspace-ui/testing';
import sinon from 'sinon';

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
		<a id="after" href="http://www.d2l.com">After</a>
	</div>
`;

const siblingsFixture = html`
	<div>
		<a id="before" href="http://www.d2l.com">Before</a>
		<d2l-focus-trap id="focusTrap1">
			<a href="http://www.d2l.com">First</a>
		</d2l-focus-trap>
		<d2l-focus-trap id="focusTrap2">
			<a href="http://www.d2l.com">Second</a>
		</d2l-focus-trap>
	</div>
`;

describe('d2l-focus-trap', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-focus-trap');
		});

	});

	describe('single', () => {

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

			describe('wrapping', () => {
				let clock;

				beforeEach(() => {
					clock = sinon.useFakeTimers();
				});
				afterEach(() => {
					clock.restore();
				});

				it('wraps to first', async() => {
					focusTrap.querySelector('#last').focus();
					focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').focus();
					clock.tick(50);
					expect(document.activeElement).to.equal(elem.querySelector('#first'));
				});

				it('wraps to last', () => {
					focusTrap.querySelector('#first').focus();
					focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').focus();
					clock.tick(50);
					expect(document.activeElement).to.equal(elem.querySelector('#last'));
				});

			});

		});

		describe('legacy prompt', () => {

			beforeEach(async() => {
				focusTrap.trap = true;
				await focusTrap.updateComplete;
			});

			it('does not trap after prompt opened', async() => {
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-open', { bubbles: false, detail: { id: 'prompt1' } })
				);

				await focusTrap.updateComplete;

				elem.querySelector('#before').focus();
				expect(document.activeElement).to.equal(elem.querySelector('#before'));

				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').hasAttribute('tabindex')).to.be.false;
				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').hasAttribute('tabindex')).to.be.false;
			});

			it('traps after prompt closed', async() => {
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-open', { bubbles: false, detail: { id: 'prompt1' } })
				);
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-close', { bubbles: false, detail: { id: 'prompt1' } })
				);

				await focusTrap.updateComplete;

				elem.querySelector('#before').focus();
				expect(document.activeElement).to.equal(elem.querySelector('#first'));

				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').getAttribute('tabindex')).to.equal('0');
				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').getAttribute('tabindex')).to.equal('0');
			});

			it('does not trap after closing one of multiple open prompts', async() => {
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-open', { bubbles: false, detail: { id: 'prompt1' } })
				);
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-open', { bubbles: false, detail: { id: 'prompt2' } })
				);
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-close', { bubbles: false, detail: { id: 'prompt2' } })
				);
				// intentional duplicate event to ensure focus-trap is tracking prompts properly
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-close', { bubbles: false, detail: { id: 'prompt2' } })
				);

				await focusTrap.updateComplete;

				elem.querySelector('#before').focus();
				expect(document.activeElement).to.equal(elem.querySelector('#before'));

				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').hasAttribute('tabindex')).to.be.false;
				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').hasAttribute('tabindex')).to.be.false;
			});

			it('traps after closing all prompts', async() => {
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-open', { bubbles: false, detail: { id: 'prompt1' } })
				);
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-open', { bubbles: false, detail: { id: 'prompt2' } })
				);
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-close', { bubbles: false, detail: { id: 'prompt1' } })
				);
				document.body.dispatchEvent(
					new CustomEvent('d2l-legacy-prompt-close', { bubbles: false, detail: { id: 'prompt2' } })
				);

				await focusTrap.updateComplete;

				elem.querySelector('#before').focus();
				expect(document.activeElement).to.equal(elem.querySelector('#first'));

				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-start').getAttribute('tabindex')).to.equal('0');
				expect(focusTrap.shadowRoot.querySelector('.d2l-focus-trap-end').getAttribute('tabindex')).to.equal('0');
			});

		});

	});

	describe('siblings', () => {

		let elem, focusTrap1, focusTrap2;
		beforeEach(async() => {
			elem = await fixture(siblingsFixture);
			focusTrap1 = elem.querySelector('#focusTrap1');
			focusTrap2 = elem.querySelector('#focusTrap2');
		});

		it('does not redirects body focus', async() => {
			focusTrap1.trap = true;
			await focusTrap1.updateComplete;
			focusTrap2.trap = true;
			await focusTrap2.updateComplete;
			elem.querySelector('#before').focus();
			expect(document.activeElement).to.equal(focusTrap2.querySelector('a'));
		});

	});

});
