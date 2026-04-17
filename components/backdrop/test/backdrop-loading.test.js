import '../backdrop-loading.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

const backdropLoadingFixture = html`
	<div>
		<div id="parent">
			<div id="expected-inert"></div>
			<div id="unrelated-div"></div>
			<d2l-backdrop-loading for="expected-inert"></d2l-backdrop-loading>
		</div>
	</div>
`;
const backdropLoadingMismatchedForFixture = html`
	<div>
		<div id="parent">
			<div id="expected-inert"></div>
			<div id="unrelated-div"></div>
			<d2l-backdrop-loading for="does-not-exist"></d2l-backdrop-loading>
		</div>
	</div>
`;
const backdropLoadingNoForFixture = html`
	<div>
		<div id="parent">
			<div id="expected-inert"></div>
			<div id="unrelated-div"></div>
			<d2l-backdrop-loading></d2l-backdrop-loading>
		</div>
	</div>
`;

describe('d2l-backdrop-loading', () => {
	let elem, backdropLoading, composedParent, targetedSibling, otherSibling;

	async function loadWithFixture(fixtureName) {
		elem = await fixture(fixtureName);

		backdropLoading = elem.querySelector('d2l-backdrop-loading');
		composedParent = elem.querySelector('#parent');
		targetedSibling = elem.querySelector('#expected-inert');
		otherSibling = elem.querySelector('#unrelated-div');
	}

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-backdrop-loading');
		});

	});

	describe('show and hide', () => {

		it('toggles inert property on sibling with for ID', async() => {
			await loadWithFixture(backdropLoadingFixture);

			backdropLoading.shown = true;
			await backdropLoading.updateComplete;

			expect(backdropLoading.hasAttribute('inert')).to.be.false;
			expect(composedParent.hasAttribute('inert')).to.be.false;
			expect(otherSibling.hasAttribute('inert')).to.be.false;
			expect(targetedSibling.hasAttribute('inert')).to.be.true;

			backdropLoading.shown = false;
			await backdropLoading.updateComplete;

			expect(targetedSibling.hasAttribute('inert')).to.be.false;
		});

		it('maintains inertness property on for target', async() => {
			await loadWithFixture(backdropLoadingFixture);

			targetedSibling.setAttribute('inert', 'inert');

			backdropLoading.shown = true;
			await backdropLoading.updateComplete;

			expect(targetedSibling.hasAttribute('inert')).to.be.true;

			backdropLoading.shown = false;
			await backdropLoading.updateComplete;

			expect(targetedSibling.hasAttribute('inert')).to.be.true;
		});

		it('throws an error when for does not match any sibling', async() => {
			await loadWithFixture(backdropLoadingMismatchedForFixture);

			try {
				backdropLoading.shown = true;
				await backdropLoading.updateComplete;
			} catch (e) {
				expect(e.message).to.equal('Backdrop cannot find sibling identified by \'for\' property with value does-not-exist');
			}
		});

		it('throws an error when for is not passed', async() => {
			await loadWithFixture(backdropLoadingNoForFixture);

			try {
				backdropLoading.shown = true;
				await backdropLoading.updateComplete;
			} catch (e) {
				expect(e.message).to.equal('Backdrop cannot find sibling identified by \'for\' property with value undefined');
			}
		});
	});
});
