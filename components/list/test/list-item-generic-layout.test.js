import '../list.js';
import '../list-item.js';
import '../../button/button-icon.js';

import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { getComposedActiveElement } from '../../../helpers/focus.js';
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

const longFixture = html`
	<d2l-list grid>
		<d2l-list-item selectable href="http://d2l.com" key="item1">
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
			</div>
		</d2l-list-item>
		<d2l-list-item selectable href="http://d2l.com" key="item2">
			<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
			</div>
		</d2l-list-item>
		<d2l-list-item selectable href="http://d2l.com" key="item3">
			<div class="d2l-list-item-text d2l-body-compact">Retain objects of various shapes and sizes in different ways, while moving around others and equipment</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.2</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
			</div>
		</d2l-list-item>
		<d2l-list-item selectable key="item4">
			<div class="d2l-list-item-text d2l-body-compact">Identify categories of physical activities</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation A1.2</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
				<d2l-button-icon text="My Button" icon="tier1:preview"></d2l-button-icon>
				<d2l-button-icon text="My Button" icon="tier1:preview"></d2l-button-icon>
				<d2l-button-icon text="My Button" icon="tier1:preview"></d2l-button-icon>
			</div>
		</d2l-list-item>
		<d2l-list-item selectable href="http://d2l.com" key="item5">
			<div class="d2l-list-item-text d2l-body-compact">Apply a decision-making process to assess risks and make safe decisions in a variety of situations</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.1</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
			</div>
		</d2l-list-item>
		<d2l-list-item selectable key="item6">
			<div class="d2l-list-item-text d2l-body-compact">Retain objects of various shapes and sizes in different ways, while moving around others and equipment</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.2</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
			</div>
		</d2l-list-item>
		<d2l-list-item selectable key="item7">
			<div class="d2l-list-item-text d2l-body-compact">Retain objects of various shapes and sizes in different ways, while moving around others and equipment</div>
			<div class="d2l-list-item-text-secondary d2l-body-small">Specific Expectation B2.2</div>
			<div slot="actions">
				<d2l-button-icon text="My Button" icon="tier1:more"></d2l-button-icon>
			</div>
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

	describe('focus', () => {
		let el, layout;
		beforeEach(async() => el = await fixture(longFixture));

		const tests = [
			{
				key: { name: 'ArrowRight', code: keyCodes.RIGHT },
				desc: 'focuses the next item in the next area',
				itemKey: 'item1',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(layout, 'focusin'),
				expected: () => layout.querySelector('[slot="content-action"]')
			},
			{
				key: { name: 'ArrowRight', code: keyCodes.RIGHT },
				desc: 'focuses the next item within the action area',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(1)'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(layout, 'focusin'),
				expected: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(2)')
			},
			{
				key: { name: 'ArrowLeft', code: keyCodes.LEFT },
				desc: 'focuses the previous item in the previous area',
				itemKey: 'item1',
				initial: () => layout.querySelector('[slot="content-action"]'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(layout, 'focusin'),
				expected: () => layout.querySelector('.d2l-input-checkbox')
			},
			{
				key: { name: 'ArrowLeft', code: keyCodes.LEFT },
				desc: 'focuses the previous item within the action area',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(2)'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(layout, 'focusin'),
				expected: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(1)')
			},
			{
				key: { name: 'ArrowUp', code: keyCodes.UP },
				desc: 'focuses the item in the same cell of the above row',
				itemKey: 'item2',
				initial: () => layout.querySelector('[slot="content-action"]'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item1"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout [slot="content-action"]')
			},
			{
				key: { name: 'ArrowUp', code: keyCodes.UP },
				desc: 'focuses item in same position of same cell of above row',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(2)'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item3"] d2l-button-icon:nth-child(2)')
			},
			{
				key: { name: 'ArrowUp', code: keyCodes.UP },
				desc: 'focuses last item in same cell of above row if position not available',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(4)'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item3"] d2l-button-icon:last-child')
			},
			{
				key: { name: 'ArrowDown', code: keyCodes.DOWN },
				desc: 'focuses item in same cell of below row',
				itemKey: 'item1',
				initial: () => layout.querySelector('[slot="content-action"]'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item2"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout [slot="content-action"]')
			},
			{
				key: { name: 'ArrowDown', code: keyCodes.DOWN },
				desc: 'focuses item in same position of same cell of below row',
				itemKey: 'item3',
				initial: () => el.querySelector('[key="item3"] d2l-button-icon:nth-child(2)'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(2)')
			},
			{
				key: { name: 'ArrowDown', code: keyCodes.DOWN },
				desc: 'focuses last item in same cell of below row if position not available',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(4)'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item5"] d2l-button-icon:last-child')
			},
			{
				key: { name: 'Home', code: keyCodes.HOME },
				desc: 'focuses first item in current row',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(2)'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(layout, 'focusin'),
				expected: () => layout.querySelector('.d2l-input-checkbox')
			},
			{
				key: { name: 'Home+CTRL', code: keyCodes.HOME, ctrl: true },
				desc: 'focuses first item of first row',
				itemKey: 'item4',
				initial: () => el.querySelector('[key="item4"] d2l-button-icon:nth-child(2)'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item1"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout .d2l-input-checkbox')
			},
			{
				key: { name: 'End', code: keyCodes.END },
				desc: 'focuses last item in current row',
				itemKey: 'item4',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(layout, 'focusin'),
				expected: () => el.querySelector('[key="item4"] d2l-button-icon:last-child')
			},
			{
				key: { name: 'End+CTRL', code: keyCodes.END, ctrl: true },
				desc: 'focuses last item of last row',
				itemKey: 'item4',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: () => document.activeElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item7"] d2l-button-icon:last-child')
			},
			{
				key: { name: 'PageUp', code: keyCodes.PAGEUP },
				desc: 'focuses item in same cell five rows up',
				itemKey: 'item7',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item2"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout .d2l-input-checkbox')
			},
			{
				key: { name: 'PageUp', code: keyCodes.PAGEUP },
				desc: 'focuses item in same cell of first row if fewer than five rows above',
				itemKey: 'item4',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item1"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout .d2l-input-checkbox')
			},
			{
				key: { name: 'PageDown', code: keyCodes.PAGEDOWN },
				desc: 'focuses item in same cell five rows down',
				itemKey: 'item1',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item6"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout .d2l-input-checkbox')
			},
			{
				key: { name: 'PageDown', code: keyCodes.PAGEDOWN },
				desc: 'focuses item in same cell of last row if fewer than five rows below',
				itemKey: 'item4',
				initial: () => layout.querySelector('.d2l-input-checkbox'),
				activeElement: getComposedActiveElement,
				event: () => oneEvent(el, 'focusin'),
				expected: () => el.querySelector('[key="item7"]')
					.shadowRoot.querySelector('d2l-list-item-generic-layout .d2l-input-checkbox')
			}
		];

		for (const test of tests) {
			it(`${test.desc} when ${test.key.name} pressed`, async() => {
				layout = el.querySelector(`[key="${test.itemKey}"]`)
					.shadowRoot.querySelector('d2l-list-item-generic-layout');
				test.initial().focus();
				let event = null;
				setTimeout(() => event = dispatchKeyEvent(layout, test.key));
				await test.event();
				expect(test.activeElement()).to.equal(test.expected());
				expect(event.preventDefault).to.have.been.calledOnce;
			});
		}

		it('does not preventDefault when Tab is pressed', async() => {
			el = el.querySelector('[key="item4"]');
			layout = el.shadowRoot.querySelector('d2l-list-item-generic-layout');
			layout.querySelector('.d2l-input-checkbox').focus();
			setTimeout(() => dispatchKeyEvent(layout, { code: keyCodes.TAB }));
			const event = await oneEvent(layout, 'keyup');
			expect(event.preventDefault).to.not.have.been.called;
		});

		describe('preventing focus move for end of content', () => {
			const tests = [
				{
					key: { name: 'ArrowRight', code: keyCodes.RIGHT },
					desc: 'does not move focus when rightmost area reached',
					itemKey: 'item1',
					initial: () => el.querySelector('[key="item1"] d2l-button-icon'),
					activeElement: () => document.activeElement
				},
				{
					key: { name: 'ArrowLeft', code: keyCodes.LEFT },
					desc: 'does not move focus when leftmove area reached',
					itemKey: 'item1',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'ArrowUp', code: keyCodes.UP },
					desc: 'does not move focus when first row already focused',
					itemKey: 'item1',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'ArrowUp', code: keyCodes.UP },
					desc: 'does not move focus when above row does not contain same cell',
					itemKey: 'item5',
					initial: () => layout.querySelector('[slot="content-action"]'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'ArrowDown', code: keyCodes.DOWN },
					desc: 'does not move focus when last row already focused',
					itemKey: 'item7',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'ArrowDown', code: keyCodes.DOWN },
					desc: 'does not move focus when above row does not contain same cell',
					itemKey: 'item3',
					initial: () => layout.querySelector('[slot="content-action"]'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'Home', code: keyCodes.HOME },
					desc: 'does not move focus when first area in row already focused',
					itemKey: 'item3',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'Home+CTRL', code: keyCodes.HOME, ctrl: true },
					desc: 'does not move focus when first area in first row already focused',
					itemKey: 'item1',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'End', code: keyCodes.END },
					desc: 'does not move focus when last area in row already focused',
					itemKey: 'item4',
					initial: () => el.querySelector('[key="item4"] d2l-button-icon:last-child'),
					activeElement: () => document.activeElement
				},
				{
					key: { name: 'End+CTRL', code: keyCodes.END, ctrl: true },
					desc: 'does not move focus when last area in last row already focused',
					itemKey: 'item7',
					initial: () => el.querySelector('[key="item7"] d2l-button-icon:last-child'),
					activeElement: () => document.activeElement
				},
				{
					key: { name: 'PageUp', code: keyCodes.PAGEUP },
					desc: 'does not move focus when first row already focused',
					itemKey: 'item1',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
				{
					key: { name: 'PageDown', code: keyCodes.PAGEDOWN },
					desc: 'does not move focus when last row already focused',
					itemKey: 'item7',
					initial: () => layout.querySelector('.d2l-input-checkbox'),
					activeElement: getComposedActiveElement
				},
			];

			for (const test of tests) {
				it(`${test.desc} when ${test.key.name} pressed`, async() => {
					layout = el.querySelector(`[key="${test.itemKey}"]`)
						.shadowRoot.querySelector('d2l-list-item-generic-layout');
					test.initial().focus();
					setTimeout(() => dispatchKeyEvent(layout, test.key));
					await aTimeout(1);
					expect(test.activeElement()).to.equal(test.initial());
				});
			}
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
