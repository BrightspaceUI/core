import '../backdrop-loading.js';
import { expect, fixture, html, runConstructor } from '@brightspace-ui/testing';

const backdropLoadingFixture = html`
	<div>
		<div>
			<div id="containing-block-parent">
				<div id="containing-block" style="position:relative">
					<div id="skipped-static-position-div">
						<d2l-backdrop-loading></d2l-backdrop-loading>
					</div>
				</div>
				<div id="containing-block-sibling"></div>
			</div>
		</div>
	</div>
`;

describe('d2l-backdrop-loading', () => {

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-backdrop-loading');
		});

	});

	describe('showing', () => {

		it('makes containing block inert', async() => {
			const elem = await fixture(backdropLoadingFixture);

			const backdropLoading = elem.querySelector('d2l-backdrop-loading');
			const containingBlock = elem.querySelector('#containing-block');
			const containingBlockSibling = elem.querySelector('#containing-block-sibling');
			const containingBlockParent = elem.querySelector('#containing-block-parent');

			backdropLoading.shown = true;
			await backdropLoading.updateComplete;

			expect(containingBlock.hasAttribute('inert')).to.be.true;
			expect(containingBlockSibling.hasAttribute('inert')).to.be.false;
			expect(containingBlockParent.hasAttribute('inert')).to.be.false;
		});
	});

	describe('hiding', () => {
		it('removes inertness property from containing block if it did not start inert', async() => {
			const elem = await fixture(backdropLoadingFixture);

			const backdropLoading = elem.querySelector('d2l-backdrop-loading');
			const containingBlock = elem.querySelector('#containing-block');
			containingBlock.removeAttribute('inert');

			expect(containingBlock.hasAttribute('inert')).to.be.false;

			backdropLoading.shown = true;
			await backdropLoading.updateComplete;

			expect(containingBlock.hasAttribute('inert')).to.be.true;

			backdropLoading.shown = false;
			await backdropLoading.updateComplete;

			expect(containingBlock.hasAttribute('inert')).to.be.false;
		});

		it('Maintains inertness property of containing block after fading if it started inert', async() => {
			const elem = await fixture(backdropLoadingFixture);

			const backdropLoading = elem.querySelector('d2l-backdrop-loading');
			const containingBlock = elem.querySelector('#containing-block');
			containingBlock.setAttribute('inert', 'inert');

			expect(containingBlock.hasAttribute('inert')).to.be.true;

			backdropLoading.shown = true;
			await backdropLoading.updateComplete;

			expect(containingBlock.hasAttribute('inert')).to.be.true;

			backdropLoading.shown = false;
			await backdropLoading.updateComplete;

			expect(containingBlock.hasAttribute('inert')).to.be.true;
		});
	});
});
