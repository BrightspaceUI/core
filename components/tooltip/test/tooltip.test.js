import '../tooltip.js';
import { aTimeout, expect, fixture, html, oneEvent, triggerBlurFor, triggerFocusFor } from '@open-wc/testing';
import { runConstructor } from '../../../tools/constructor-test-helper.js';

const basicFixture = html`
	<div>
		<div id="implicit-target" tabindex="-1">
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

		it('should pass all aXe tests (hide)', async() => {
			await expect(tooltip).to.be.accessible;
		});

		[
			'info',
			'error'
		].forEach(state => {
			it(`should pass all aXe tests for state ${state} (show)`, async() => {
				tooltip.setAttribute('state', state);
				tooltip.setAttribute('showing', 'showing');
				await tooltip.updateComplete;
				await expect(tooltip).to.be.accessible;
			});
		});

		it('should add aria-labelledby to its target if for-type is \'label\'', async() => {
			const tooltipLabelFixture = await fixture(labelFixture);
			const target = tooltipLabelFixture.querySelector('#label-target');
			expect(target.hasAttribute('aria-labelledby')).to.be.true;
		});

		it('should add aria-describedby to its target if for-type is \'descriptor\'', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			expect(target.hasAttribute('aria-describedby')).to.be.true;
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
			{ case: 'hovered and focused', hover: true, focus: true},
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
	});

	describe('delay', () => {

		beforeEach(async() => {
			tooltip.setAttribute('delay', 100);
			await tooltip.updateComplete;
		});

		it('should not show if hover is lost before tooltip delay finishes', async() => {

			oneEvent(tooltipFixture, 'd2l-tooltip-show').then(() => {
				expect.fail('tooltip should not have been shown');
			});
			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await aTimeout(tooltip.delay / 2);
			target.dispatchEvent(new Event('mouseleave'));
			await aTimeout(tooltip.delay);
			expect(tooltip.showing).to.be.false;
		});

		it('should not show if hover is gained and lost multiple times before tooltip delay finishes', async() => {

			oneEvent(tooltipFixture, 'd2l-tooltip-show').then(() => {
				expect.fail('tooltip should not have been shown');
			});
			const target = tooltipFixture.querySelector('#explicit-target');
			for (let i = 0; i < 5; i++) {
				target.dispatchEvent(new Event('mouseenter'));
				await aTimeout(tooltip.delay / 2);
				target.dispatchEvent(new Event('mouseleave'));
				await aTimeout(tooltip.delay / 2);
			}
			await aTimeout(tooltip.delay);
			expect(tooltip.showing).to.be.false;
		});

		it('should show if hover is maintained for the tooltip delay', async() => {
			const target = tooltipFixture.querySelector('#explicit-target');
			target.dispatchEvent(new Event('mouseenter'));
			await aTimeout(tooltip.delay * 0.9);
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
			eventObj.initEvent('keyup', true, true);
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
			await triggerFocusFor(target);

			setTimeout(() => target.dispatchEvent(new Event('mouseleave')));
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});
	});
});
