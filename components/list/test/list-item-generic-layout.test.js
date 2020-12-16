import '../list.js';
import '../list-item.js';
import '../../button/button-icon.js';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';
import sinon from 'sinon';

const normalFixture = html`
	<d2l-list grid>
		<d2l-list-item selectable key="item1">
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
		</d2l-list-item>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
		</d2l-list-item>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Retain objects of various shapes and sizes in different ways, while moving around others and equipment</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.2</div>
		</d2l-list-item>
	</d2l-list>
`;

const nonGridFixture = html`
	<d2l-list>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
		</d2l-list-item>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
		</d2l-list-item>
		<d2l-list-item>
			<div class="d2l-list-item-text d2l-body-compact">Retain objects of various shapes and sizes in different ways, while moving around others and equipment</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.2</div>
		</d2l-list-item>
	</d2l-list>
`;

describe('d2l-list-item-generic-layout', () => {
	const keyCodes = {
		DOWN: 40,
		END: 35,
		ENTER: 13,
		HOME: 36,
		LEFT: 37,
		PAGEUP: 33,
		PAGEDOWN: 34,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	};

	function dispatchKeyEvent(el, { code, ctrl }) {
		const eventObj = document.createEvent('Events');
		eventObj.initEvent('keyup', true, true);
		eventObj.which = code;
		eventObj.keyCode = code;
		eventObj.ctrlKey = ctrl;
		eventObj.preventDefault = sinon.spy();
		el.dispatchEvent(eventObj);
		return eventObj;
	}

	describe('constructor', () => {
		it('should construct the generic layout', () => {
			runConstructor('d2l-list-item-generic-layout');
		});
	});

	describe('grid enabling', () => {
		it('enables grid on list-item-generic-layout elements', async() => {
			const el = await fixture(normalFixture);
			el._getItems().forEach(item => {
				expect(item.shadowRoot.querySelector('d2l-list-item-generic-layout').gridActive).to.be.true;
			});
		});

		it('disables grid on list-item-generic-layout elements', async() => {
			const el = await fixture(nonGridFixture);
			el._getItems().forEach(item => {
				expect(item.shadowRoot.querySelector('d2l-list-item-generic-layout').gridActive).to.be.undefined;
			});
		});
	});

	describe('events', () => {
		let actionable, layout;
		beforeEach(async() => {
			layout = (await fixture(normalFixture)).querySelector('[selectable]')
				.shadowRoot.querySelector('d2l-list-item-generic-layout');
			actionable = layout.querySelector('.d2l-input-checkbox');
			actionable.focus();
		});

		const tests = [
			{ desc: 'performs a click action when space pressed', key: keyCodes.SPACE },
			{ desc: 'performs a click action when enter pressed', key: keyCodes.ENTER }
		];

		for (const test of tests) {
			it(test.desc, async() => {
				setTimeout(() => dispatchKeyEvent(layout, { code: test.key }));
				await oneEvent(actionable, 'click');
			});
		}
	});
});
