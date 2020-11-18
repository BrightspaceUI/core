import '../tooltip.js';
import { aTimeout, expect, fixture, html, oneEvent, triggerBlurFor, triggerFocusFor } from '@open-wc/testing';

const basicFixture = html`
	<div>
		<div id="implicit-target" tabindex="-1" role="button">
			<button id="explicit-target">Hover me for tips</button>
			<d2l-tooltip for="explicit-target" for-type="descriptor">If I got a problem then a problem's got a problem.</d2l-tooltip>
		</div>
	</div>
`;
describe('d2l-tooltip', () => {

	let tooltipFixture, tooltip;

	beforeEach(async() => {
		tooltipFixture = await fixture(basicFixture);
		tooltip = tooltipFixture.querySelector('d2l-tooltip');
	});

	describe('show-hide', () => {

		it('should show when target is focused', async() => {
			await triggerFocusFor(tooltipFixture.querySelector('#explicit-target'));
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
			await triggerFocusFor(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');

			setTimeout(() => triggerBlurFor(target));
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
			await triggerFocusFor(target);

			target.dispatchEvent(new Event('mouseleave'));
			await aTimeout(100);
			expect(tooltip.showing).to.be.true;
		});

		it('should not hide from blur when target is hovered', async() => {

			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await triggerFocusFor(target);

			await triggerBlurFor(target);
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
						triggerFocusFor(target);
					}
					if (testCase.hover) {
						target.dispatchEvent(new Event('mouseenter'));
					}
				}, 0);
				await oneEvent(tooltipFixture, 'd2l-tooltip-show');
				await aTimeout();

				const eventObj = document.createEvent('Events');
				eventObj.initEvent('keyup', true, true);
				eventObj.keyCode = 27;

				setTimeout(() => document.dispatchEvent(eventObj));
				await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
				expect(tooltip.showing).to.be.false;
			});
		});

		it('should show if added to a target that already has focus', async() => {

			const target = tooltipFixture.querySelector('#explicit-target');
			await triggerFocusFor(target);

			const dynamicTooltip = document.createElement('d2l-tooltip');
			dynamicTooltip.for = target.id;
			tooltipFixture.appendChild(dynamicTooltip);

			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(dynamicTooltip.showing).to.be.true;
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
			await triggerFocusFor(target);

			setTimeout(() => target.dispatchEvent(new Event('mouseleave')));
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});
	});
});
