import '../hierarchical-view.js';
import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { spy } from 'sinon';

const viewsFixture = html`
	<div>
		<div id="parent">
			<a id="previous_focusable" tabindex="0"></a>
			<d2l-hierarchical-view id="view1">
				<div id="view1_content" tabindex="0">view 1</div>
				<d2l-hierarchical-view id="view2">
					<div id="view2_content" tabindex="0">view 2</div>
				</d2l-hierarchical-view>
			</d2l-hierarchical-view>
		</div>
	</div>
`;

describe('d2l-hierarchical-view', () => {

	let view1, view2;
	beforeEach(async() => {
		const el = await fixture(viewsFixture);
		view1 = el.querySelector('#view1');
		view2 = el.querySelector('#view2');
		await oneEvent(view1, 'd2l-hierarchical-view-resize');
	});

	describe('focus management', () => {

		it('applies focus using focus override if provided', async() => {
			setTimeout(() => view2.show());
			await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
			const view1_content = document.getElementById('view1_content');
			const mockFocusHandler = spy(view2, 'focus');
			view1_content.focus();
			expect(mockFocusHandler).to.have.been.called;
		});

		it('applies focus to next focusable element in active view', async() => {
			setTimeout(() => view2.show());
			await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
			document.getElementById('view1_content').focus();
			expect(document.activeElement).to.equal(document.getElementById('view2_content'));
		});

		it('applies focus to previous focusable element outside hierarchy', async() => {
			setTimeout(() => view2.show());
			await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
			document.getElementById('view2_content').focus();
			document.getElementById('view1_content').focus();
			expect(document.activeElement).to.equal(document.getElementById('previous_focusable'));
		});

	});
});
