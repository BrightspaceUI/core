import '../backdrop.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

const backdropFixture = html`
	<div>
		<div>
			<div id="target"><button>toggle backdrop</button></div>
			<div id="targetSibling"></div>
			<div aria-hidden="true"></div>
			<a></a>
			<a aria-hidden="false"></a>
			<form></form>
			<script></script>
			<style></style>
			<d2l-backdrop for-target="target" no-animate-hide></d2l-backdrop>
		</div>
		<div id="targetParentSibling"></div>
	</div>
`;

const multiBackdropFixture = html`
	<div>
		<div id="target1">
			<div id="target2"></div>
			<div id="target2Sibling"></div>
			<d2l-backdrop for-target="target2" no-animate-hide></d2l-backdrop>
		</div>
		<div id="target1Sibling"></div>
		<d2l-backdrop for-target="target1" no-animate-hide></d2l-backdrop>
	</div>
`;

describe('d2l-backdrop', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-backdrop');
		});

	});

	describe('updates for accessibility', () => {

		it('should hide accessible elements', async() => {
			const elem = await fixture(backdropFixture);
			const backdrop = elem.querySelector('d2l-backdrop');
			backdrop.shown = true;
			await backdrop.updateComplete;

			expect(backdrop.getAttribute('aria-hidden')).to.equal('true');
			expect(elem.querySelector('#target').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target').parentNode.getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('script').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('style').getAttribute('aria-hidden')).to.equal(null);

			expect(elem.querySelector('#targetSibling').getAttribute('aria-hidden')).to.equal('true');
			expect(elem.querySelector('#targetParentSibling').getAttribute('aria-hidden')).to.equal('true');

			const link = elem.querySelector('a');
			expect(link.getAttribute('aria-hidden')).to.equal('true');

			const form = elem.querySelector('form');
			expect(form.getAttribute('aria-hidden')).to.equal('true');

			const divAriaHidden = elem.querySelector('div[aria-hidden]');
			expect(divAriaHidden.getAttribute('aria-hidden')).to.equal('true');

			const linkAriaHidden = elem.querySelector('a[aria-hidden]');
			expect(linkAriaHidden.getAttribute('aria-hidden')).to.equal('true');
		});

		it('should show accessible elements', async() => {
			const elem = await fixture(backdropFixture);
			const backdrop = elem.querySelector('d2l-backdrop');
			backdrop.shown = true;
			await backdrop.updateComplete;
			backdrop.shown = false;
			await backdrop.updateComplete;

			expect(backdrop.getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target').parentNode.getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('script').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('style').getAttribute('aria-hidden')).to.equal(null);

			expect(elem.querySelector('#targetSibling').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#targetParentSibling').getAttribute('aria-hidden')).to.equal(null);

			const link = elem.querySelector('a');
			expect(link.getAttribute('aria-hidden')).to.equal(null);

			const form = elem.querySelector('form');
			expect(form.getAttribute('aria-hidden')).to.equal(null);

			const divAriaHidden = elem.querySelector('div[aria-hidden]');
			expect(divAriaHidden.getAttribute('aria-hidden')).to.equal('true');

			const linkAriaHidden = elem.querySelector('a[aria-hidden]');
			expect(linkAriaHidden.getAttribute('aria-hidden')).to.equal('false');
		});

		it('should not show accessible elements hidden by other backdrops', async() => {
			const elem = await fixture(multiBackdropFixture);

			const backdrop1 = elem.querySelector('d2l-backdrop[for-target="target1"]');
			backdrop1.shown = true;
			await backdrop1.updateComplete;

			const backdrop2 = elem.querySelector('d2l-backdrop[for-target="target2"]');
			backdrop2.shown = true;
			await backdrop2.updateComplete;

			backdrop2.shown = false;
			await backdrop2.updateComplete;

			expect(backdrop2.getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target2').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target2Sibling').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target2').parentNode.getAttribute('aria-hidden')).to.equal(null);

			expect(backdrop1.getAttribute('aria-hidden')).to.equal('true');
			expect(elem.querySelector('#target1').getAttribute('aria-hidden')).to.equal(null);
			expect(elem.querySelector('#target1Sibling').getAttribute('aria-hidden')).to.equal('true');
			expect(elem.querySelector('#target1').parentNode.getAttribute('aria-hidden')).to.equal(null);
		});

	});

});
