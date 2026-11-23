import '../tooltip.js';
import { aTimeout, defineCE, expect, fixture, focusElem, hoverElem, html, oneEvent, runConstructor, sendKeys } from '@brightspace-ui/testing';
import { LitElement } from 'lit';

const basicFixture = html`
	<div>
		<div id="implicit-target" tabindex="-1" role="button">
			<button id="explicit-target">Hover me for tips</button>
			<d2l-tooltip for="explicit-target" for-type="descriptor">If I got a problem then a problem's got a problem.</d2l-tooltip>
		</div>
		<div style="margin-top: 100px">
			<button id="another-element">Another Button</button>
		</div>
	</div>
`;

const labelFixture = html`
	<div>
		<button id="label-target">Hover me for tips</button>
		<d2l-tooltip for="label-target" for-type="label">If I got a problem then a problem's got a problem.</d2l-tooltip>
	</div>
`;

const elementTag = defineCE(class Iterator extends LitElement {
	render() {
		return html`
			<div style="padding: 20px;">
				<button id="prev" type="button">Prev</button>
				<button id="next" type="button">Next</button>
				<d2l-tooltip for="prev">Previous</d2l-tooltip>
				<d2l-tooltip for="next">Next</d2l-tooltip>
			</div>
		`;
	}
});

describe('d2l-tooltip', () => {

	let anotherElement, target, tooltipFixture, tooltip;

	beforeEach(async() => {
		tooltipFixture = await fixture(basicFixture);
		target = tooltipFixture.querySelector('#explicit-target');
		anotherElement = tooltipFixture.querySelector('#another-element');
		tooltip = tooltipFixture.querySelector('d2l-tooltip[for="explicit-target"]');
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
			expect(target.getAttribute('aria-describedby')).to.equal(tooltip.id);
		});

		it('should remove aria-describedby from its target when tooltip is removed', async() => {
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

	describe('explicit target', () => {

		it('should find target using for attribute', () => {
			expect(tooltip._getTarget()).to.equal(target);
		});

		it('should update target if current target is removed', async() => {
			target.remove();
			await aTimeout(1);
			expect(tooltip._getTarget()).to.be.null;
		});

		it('should update target if current target id changes', async() => {
			target.id = '';
			await aTimeout(1);
			expect(tooltip._getTarget()).to.be.null;
		});

		it('should not error if target is not found while announced', async() => {
			const elem = await fixture(html`<d2l-tooltip for="unknown" announced>Tooltip</d2l-tooltip>`);

			let unhandledRejectionReason;
			const handleUnhandledRejection = event => unhandledRejectionReason = event.reason;
			window.addEventListener('unhandledrejection', handleUnhandledRejection);

			elem.show();
			await oneEvent(elem, 'd2l-tooltip-show');
			await aTimeout(100);
			expect(unhandledRejectionReason).to.be.undefined;

			window.removeEventListener('unhandledrejection', handleUnhandledRejection);
		});

	});

	describe('implicit target', () => {

		beforeEach(async() => {
			tooltip.removeAttribute('for');
			await tooltip.updateComplete;
		});

		it('should find parent target', async() => {
			const expectedTarget = tooltipFixture.querySelector('#implicit-target');
			expect(tooltip._getTarget()).to.equal(expectedTarget);
		});
	});

	describe('show-hide', () => {

		it('should show when target is focused', async() => {
			focusElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;
		});

		it('should show when target is hovered', async() => {
			hoverElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;
		});

		it('should hide from blur when target is focused', async() => {
			await focusElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');

			sendKeys('press', 'Tab');
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});

		it('should hide from mouseleave when target is hovered', async() => {
			hoverElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');

			hoverElem(anotherElement);
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});

		it('should not hide from mouseleave when target is focused', async() => {
			hoverElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await focusElem(target);

			hoverElem(anotherElement);
			await aTimeout(100);
			expect(tooltip.showing).to.be.true;
		});

		it('should not hide from blur when target is hovered', async() => {
			hoverElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await focusElem(target);

			target.blur();
			await aTimeout(100);
			expect(tooltip.showing).to.be.true;
		});

		it('should hide when another tooltip is shown when tooltip is hovered within a custom element', async() => {
			const elem = await fixture(`<${elementTag}></${elementTag}>`);
			const prev = elem.shadowRoot.querySelector('#prev');
			const prevTooltip = elem.shadowRoot.querySelector('d2l-tooltip[for="prev"]');
			const next = elem.shadowRoot.querySelector('#next');
			focusElem(prev);
			await oneEvent(elem, 'd2l-tooltip-show');

			prevTooltip.dispatchEvent(new Event('mouseenter'));

			focusElem(next);
			await oneEvent(elem, 'd2l-tooltip-show');

			expect(prevTooltip.showing).to.be.false;
		});

		[
			{ case: 'hovered and focused', hover: true, focus: true },
			{ case: 'hovered', hover: true, focus: false },
			{ case: 'focused', hover: false, focus: true }
		].forEach((testCase) => {
			it(`should hide when ESC key is pressed while ${testCase.case}`, async() => {
				setTimeout(() => {
					if (testCase.focus) {
						focusElem(target);
					}
					if (testCase.hover) {
						hoverElem(target);
					}
				}, 0);
				await oneEvent(tooltipFixture, 'd2l-tooltip-show');
				await aTimeout();

				setTimeout(() => sendKeys('press', 'Escape'));
				await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
				expect(tooltip.showing).to.be.false;
			});
		});

		it('should show if added to a target that already has focus', async() => {
			await focusElem(target);

			const dynamicTooltip = document.createElement('d2l-tooltip');
			dynamicTooltip.for = target.id;
			tooltipFixture.appendChild(dynamicTooltip);

			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(dynamicTooltip.showing).to.be.true;
		});

		it('should show if added to a target with a nested element that already has focus', async() => {

			const targetTag = defineCE(class extends LitElement {
				render() {return html`<button>nested target</button>`; }
			});
			const elem = await fixture(`<div><${targetTag} id="target"></${targetTag}></div>`);
			const target = elem.querySelector(targetTag);

			await focusElem(target.shadowRoot.querySelector('button'));

			const tooltip = document.createElement('d2l-tooltip');
			tooltip.announced = true;
			elem.appendChild(tooltip);

			await oneEvent(elem, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;

		});

		it('should not show if added to a disabled target that already has focus', async() => {
			target.disabled = true;
			await focusElem(target);

			const dynamicTooltip = document.createElement('d2l-tooltip');
			dynamicTooltip.for = target.id;
			tooltipFixture.appendChild(dynamicTooltip);

			await aTimeout(100);
			expect(dynamicTooltip.showing).to.be.false;
		});

		it('should show after the tooltip is disconnected and reconnected', async() => {
			const parentElement = target.parentElement;

			// remove the tooltip from the dom
			tooltip.remove();
			expect(parentElement.querySelector('d2l-tooltip')).to.not.exist;

			// re-add the tooltip to the dom
			parentElement.appendChild(tooltip);
			expect(parentElement.querySelector('d2l-tooltip')).to.exist;

			// show the tooltip
			await focusElem(target);
			await aTimeout(100);
			expect(tooltip.showing).to.be.true;
		});

	});

	describe('delay', () => {

		it('should not show if hover is lost before tooltip delay finishes', async() => {
			let shown = false;
			oneEvent(tooltipFixture, 'd2l-tooltip-show').then(() => shown = true);
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
			target.dispatchEvent(new Event('mouseenter'));
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			expect(tooltip.showing).to.be.true;
		});

		it('should show second tooltip without delay after hovering over first tooltip for greater than delay', async() => {
			const doubleTooltipFixture = html`
				<div>
					<button id="explicit-target1">Hover me for tips</button>
					<d2l-tooltip for="explicit-target1" for-type="descriptor">If I got a problem then a problem's got a problem.</d2l-tooltip>
					<button id="explicit-target2">Hover me for tips</button>
					<d2l-tooltip for="explicit-target2" for-type="descriptor">There might be another problem.</d2l-tooltip>
				</div>
			`;

			const testFixture = await fixture(doubleTooltipFixture);

			const target1 = testFixture.querySelector('#explicit-target1');
			const target2 = testFixture.querySelector('#explicit-target2');

			const tooltips = testFixture.querySelectorAll('d2l-tooltip');
			const tooltip1 = tooltips[0];
			const tooltip2 = tooltips[1];

			// display tooltip 1 then leave
			target1.dispatchEvent(new Event('mouseenter'));
			await oneEvent(testFixture, 'd2l-tooltip-show');
			expect(tooltip1.showing).to.be.true;
			target1.dispatchEvent(new Event('mouseleave'));

			// don't wait delay, enter target2, tooltip 2 should show without having to wait for delay
			target2.dispatchEvent(new Event('mouseenter'));
			await aTimeout(tooltip.delay / 2);
			expect(tooltip2.showing).to.be.true;
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

		it('should not hide when ESC key is pressed', async() => {
			await sendKeys('press', 'Escape');
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
			hoverElem(target);
			await oneEvent(tooltipFixture, 'd2l-tooltip-show');
			await focusElem(target);

			hoverElem(anotherElement);
			await oneEvent(tooltipFixture, 'd2l-tooltip-hide');
			expect(tooltip.showing).to.be.false;
		});
	});

});
