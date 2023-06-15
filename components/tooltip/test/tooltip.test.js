import '../tooltip.js';
import { aTimeout, expect, fixture, html, oneEvent } from '@open-wc/testing';
import { focusWithKeyboard } from '@brightspace-ui/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = html`
	<div>
		<div id="implicit-target" tabindex="-1" role="button">
			<button id="explicit-target">Hover me for tips</button>
			<d2l-tooltip for="explicit-target" for-type="descriptor">If I got a problem then a problem's got a problem.</d2l-tooltip>
		</div>
	</div>
`;

const labelFixture = html`
	<div>
		<button id="label-target">Hover me for tips</button>
		<d2l-tooltip for="label-target" for-type="label">If I got a problem then a problem's got a problem.</d2l-tooltip>
	</div>
`;

describe('d2l-tooltip', () => {

	let tooltipFixture, tooltip;

	beforeEach(async() => {
		tooltipFixture = await fixture(basicFixture);
		tooltip = tooltipFixture.querySelector('d2l-tooltip');
	});

	describe('accessibility', () => {

		it('should add aria-labelledby to its target if for-type is \'label\'', async() => {
			const tooltipLabelFixture = await fixture(labelFixture);
			const target = tooltipLabelFixture.querySelector('#label-target');
			const tooltip = tooltipLabelFixture.querySelector('d2l-tooltip');
			expect(target.getAttribute('aria-labelledby')).to.equal(tooltip.id);
		});

		it('should remove aria-labelledby from its target when tooltip is removed', async() => {
			const tooltipLabelFixture = await fixture(labelFixture);
			const target = tooltipLabelFixture.querySelector('#label-target');
			const tooltip = tooltipLabelFixture.querySelector('d2l-tooltip');
			tooltip.remove();
			expect(target.hasAttribute('aria-labelledby')).to.be.false;
		});

		it('should add aria-describedby to its target if for-type is \'descriptor\'', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			const tooltip = tooltipFixture.querySelector('d2l-tooltip');
			expect(target.getAttribute('aria-describedby')).to.equal(tooltip.id);
		});

		it('should remove aria-describedby from its target when tooltip is removed', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			const tooltip = tooltipFixture.querySelector('d2l-tooltip');
			tooltip.remove();
			expect(target.hasAttribute('aria-describedby')).to.be.false;
		});

	});

	describe('constructor', () => {

		it('should construct', () => {
			runConstructor('d2l-tooltip');
		});

	});

	describe('events', () => {

		it('doesnt fire show event when already showing', async() => {
			tooltip.showing = true;
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			oneEvent(tooltipFixture, 'd2l-tooltip-show').then(() => {
				expect.fail('d2l-tooltip-hide hide should not have been fired');
			});
			tooltip.showing = true;
			await aTimeout(100);
		});

		it('doesnt fire hide event when already hidden', async() => {
			oneEvent(tooltipFixture, 'd2l-tooltip-hide').then(() => {
				expect.fail('d2l-tooltip-hide hide should not have been fired');
			});
			tooltip.showing = false;
			await aTimeout(100);
		});
	});

	describe('explict target', () => {

		it('should find target using for attribute', async() => {
			const expectedTarget = tooltipFixture.querySelector('#explicit-target');
			expect(tooltip._target).to.equal(expectedTarget);
		});
	});

	describe('implicit target', () => {

		beforeEach(async() => {
			tooltip.removeAttribute('for');
			await tooltip.updateComplete;
		});

		it('should find parent target', async() => {
			const expectedTarget = tooltipFixture.querySelector('#implicit-target');
			expect(tooltip._target).to.equal(expectedTarget);
		});
	});

	describe('show-hide', () => {

		it('should show when target is focused', async() => {
			await focusWithKeyboard(tooltipFixture.querySelector('#explicit-target'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;
		});

		it('should show event when target is hovered', async() => {
			tooltipFixture.querySelector('#explicit-target').dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;
		});

		it('should hide from blur when target is focused', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			await focusWithKeyboard(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');

			setTimeout(() => target.blur());
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});

		it('should hide from mouseleave when target is hovered', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');

			setTimeout(() => target.dispatchEvent(new Event('mouseleave')));
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});

		it('should not hide from mouseleave when target is focused', async() => {

			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await focusWithKeyboard(target);

			target.dispatchEvent(new Event('mouseleave'));
			await aTimeout(100);
			expect(tooltip.showing).to.be.true;
		});

		it('should not hide from blur when target is hovered', async() => {

			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await focusWithKeyboard(target);

			target.blur();
			await aTimeout(100);
			expect(tooltip.showing).to.be.true;
		});

		[
			{ case: 'hovered and focused', hover: true, focus: true },
			{ case: 'hovered', hover: true, focus: false },
			{ case: 'focused', hover: false, focus: true }
		].forEach((testCase) => {
			it(`should hide when ESC key is pressed while ${testCase.case}`, async() => {
				const target = tooltipFixture.querySelector('#explicit-target');
				setTimeout(() => {
					if (testCase.focus) {
						focusWithKeyboard(target);
					}
					if (testCase.hover) {
						target.dispatchEvent(new Event('mouseenter'));
					}
				}, 0);
				await oneEvent(tooltipFixture, 'd2l-tooltip-show');
				await aTimeout();

				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keydown', true, true);
				eventObj.keyCode = 27;

				setTimeout(() => document.dispatchEvent(eventObj));
				await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
				expect(tooltip.showing).to.be.false;
			});
		});

		it('should show if added to a target that already has focus', async() => {

			const target = tooltipFixture.querySelector('#explicit-target');
			await focusWithKeyboard(target);

			const dynamicTooltip = document.createElement('d2l-tooltip');
			dynamicTooltip.for = target.id;
			tooltipFixture.appendChild(dynamicTooltip);

			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(dynamicTooltip.showing).to.be.true;
		});
	});

	describe('delay', () => {

		it('should not show if hover is lost before tooltip delay finishes', async() => {
			let shown = false;
			oneEvent(tooltipFixture, 'd2l-tooltip-show').then(() => shown = true);
			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await aTimeout(tooltip.delay / 2);
			target.dispatchEvent(new Event('mouseleave'));
			await aTimeout(tooltip.delay);
			expect(tooltip.showing).to.be.false;
			expect(shown).to.be.false;

		});

		it('should not show if hover is gained and lost multiple times before tooltip delay finishes', async() => {
			let shown = false;
			oneEvent(tooltipFixture, 'd2l-tooltip-show').then(() => shown = true);
			const target = tooltipFixture.querySelector('#explicit-target');
			for (let i = 0; i < 5; i++) {
				target.dispatchEvent(new Event('mouseenter'));
				await aTimeout(tooltip.delay / 2);
				target.dispatchEvent(new Event('mouseleave'));
				await aTimeout(tooltip.delay / 2);
			}
			await aTimeout(tooltip.delay);
			expect(tooltip.showing).to.be.false;
			expect(shown).to.be.false;
		});

		it('should show if hover is maintained for the tooltip delay', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;
		});
	});

	describe('force-show', () => {

		beforeEach(async() => {
			tooltip.setAttribute('force-show', 'force-show');
			await tooltip.updateComplete;
		});

		it('should display the tooltip by default', () => {
			expect(tooltip.showing).to.be.true;
		});

		it('should not hide when ESC key is pressed ', async() => {

			const eventObj = document.createEvent('Events');
			eventObj.initEvent('keydown', true, true);
			eventObj.keyCode = 27;
			document.dispatchEvent(eventObj);
			await aTimeout(100);

			expect(tooltip.showing).to.be.true;
		});
	});

	describe('disable-focus-lock', () => {

		beforeEach(async() => {
			tooltip.setAttribute('disable-focus-lock', 'disable-focus-lock');
			await tooltip.updateComplete;
		});

		it('should hide on mouseleave even when focused', async() => {

			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await focusWithKeyboard(target);

			setTimeout(() => target.dispatchEvent(new Event('mouseleave')));
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});
	});
});
