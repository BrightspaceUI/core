import '../hierarchical-view.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
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
	});

	it('root view is initially active', () => {
		expect(view1.isActive()).to.be.true;
		expect(view1.getRootView()).to.equal(view1);
		expect(view1.getActiveView()).to.equal(view1);
	});

	it('child view is initially inactive', () => {
		expect(view2.isActive()).to.be.false;
	});

	it('resize on root view triggers resize event', async() => {
		setTimeout(() => view1.resize());
		await oneEvent(view1, 'd2l-hierarchical-view-resize');
	});

	it('resize on child view triggers resize event', async() => {
		setTimeout(() => view2.resize());
		await oneEvent(view1, 'd2l-hierarchical-view-resize');
	});

	it('resizes when light-dom is mutated', async() => {
		const initialHeight = view1.getBoundingClientRect().height;
		const content = document.createElement('p');
		content.appendChild(document.createTextNode('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'));
		setTimeout(() => view1.appendChild(content));
		await oneEvent(view1, 'd2l-hierarchical-view-resize');
		await aTimeout(400);
		expect(view1.getBoundingClientRect().height).to.above(initialHeight);
	});

	it('show on child view triggers show-start event', async() => {
		setTimeout(() => view2.show());
		const { detail } = await oneEvent(view1, 'd2l-hierarchical-view-show-start');
		expect(detail.sourceView).to.equal(view2);
	});

	it('show on child view triggers show-complete event', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
	});

	it('show data argument is passed to show-start and show-complete event handlers', async() => {
		setTimeout(() => view2.show({ some: 'thing' }));
		const e1 = await oneEvent(view1, 'd2l-hierarchical-view-show-start');
		const e2 = await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		expect(e1.detail.data.some).to.equal('thing');
		expect(e2.detail.data.some).to.equal('thing');
	});

	it('show on child view makes it active view', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		expect(view1.isActive()).to.be.false;
		expect(view2.isActive()).to.be.true;
	});

	it('hide on child view triggers hide-start event', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		setTimeout(() => view2.hide());
		const { detail } = await oneEvent(view1, 'd2l-hierarchical-view-hide-start');
		expect(detail.sourceView).to.equal(view2);
	});

	it('hide on child view triggers hide-complete event', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		setTimeout(() => view2.hide());
		await oneEvent(view1, 'd2l-hierarchical-view-hide-complete');
		expect(view1.isActive()).to.be.true;
	});

	it('hide data argument is passed to hide-start and hide-complete event handlers', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		setTimeout(() => view2.hide({ some: 'thing' }));
		const e1 = await oneEvent(view1, 'd2l-hierarchical-view-hide-start');
		expect(e1.detail.data.some).to.equal('thing');
		const e2 = await oneEvent(view1, 'd2l-hierarchical-view-hide-complete');
		expect(e2.detail.data.some).to.equal('thing');
	});

	it('pressing Escape in child view context hides view', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		const view2_content = document.getElementById('view2_content');
		const eventObj = document.createEvent('Events');
		eventObj.initEvent('keydown', true, true);
		eventObj.keyCode = 27;
		setTimeout(() => view2_content.dispatchEvent(eventObj));
		await oneEvent(view1, 'd2l-hierarchical-view-hide-complete');
		expect(view1.isActive()).to.be.true;
	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-hierarchical-view');
		});

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

	it('hide on child view triggers hide-complete event when not displayed', async() => {
		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		document.getElementById('parent').style.display = 'none';
		setTimeout(() => view2.hide());
		await oneEvent(view1, 'd2l-hierarchical-view-hide-complete');
		expect(view1.isActive()).to.be.true;
	});

	it('hide on child view triggers hide-complete event for cancelled hide animations when not displayed', async() => {

		setTimeout(() => view2.show());
		await oneEvent(view1, 'd2l-hierarchical-view-show-complete');
		setTimeout(() => view2.hide());
		setTimeout(() => document.getElementById('parent').style.display = 'none');
		setTimeout(() => view2.hide());
		const twoEvent = new Promise((resolve) => {
			let count = 0;
			const receivedEvent = () => {
				if (++count === 2) { resolve(); }
			};
			view1.addEventListener('d2l-hierarchical-view-hide-complete', receivedEvent);
		});
		await twoEvent;
		expect(view1.isActive()).to.be.true;
	});
});
