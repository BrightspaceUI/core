import '../../button/button.js';
import '../tooltip.js';
import { expect, fixture, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { styleMap } from 'lit/directives/style-map.js';

const shortText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
const additionalText = 'Aliquam ut porttitor leo a diam sollicitudin tempor id eu.';

function createTooltip(tooltipOpts, target) {
	const { content, align, boundary, bounded, dark, position, offset, state, wrapped } = {
		content: 'Lorem ipsum dolor sit amet.',
		bounded: false,
		dark: false,
		wrapped: false,
		...tooltipOpts
	};
	const pageStyles = {
		backgroundColor: dark ? 'black' : 'white',
		boxSizing: 'border-box',
		height: '400px',
		padding: '30px',
		position: 'relative'
	};
	const targetStyles = {
		backgroundColor: 'gray',
		border: '2px solid black',
		borderRadius: '50%',
		boxSizing: 'border-box',
		height: '30px',
		position: 'absolute',
		width: '30px',
		...target };

	const tooltip = html`
		<d2l-tooltip
			for="${ifDefined(wrapped ? undefined : 'target')}"
			align="${ifDefined(align)}"
			position="${ifDefined(position)}"
			boundary="${ifDefined(boundary)}"
			offset="${ifDefined(offset)}"
			state="${ifDefined(state)}">
			${content}
		</d2l-tooltip>
	`;
	return html`
		<div style="${styleMap(pageStyles)}">
			<div style="${ifDefined(bounded ? 'overflow: hidden; width: 200px;' : undefined)}">
				${wrapped ? html`
					<div style="${styleMap(targetStyles)}">${tooltip}</div>
				` : html`
					<div id="target" style="${styleMap(targetStyles)}"></div>
					${tooltip}
				`}
			</div>
		</div>
	`;
}

describe('tooltip', () => {
	const edge = '30px';
	const mid = 'calc(50% - 15px)';

	[
		{ name: 'position-top', opts: { content: longText, position: 'top' }, targetStyles: { left: mid, top: mid } },
		{ name: 'position-bottom', opts: { content: longText, position: 'bottom', wrapped: true }, targetStyles: { left: mid, top: mid } },
		{ name: 'position-right', opts: { content: longText, position: 'right' }, targetStyles: { left: mid, top: mid } },
		{ name: 'position-left', opts: { content: longText, position: 'left', wrapped: true }, targetStyles: { left: mid, top: mid } },
		{ name: 'position-right-rtl', rtl: true, opts: { content: longText, position: 'right' }, targetStyles: { left: mid, top: mid } },
		{ name: 'position-left-rtl', rtl: true, opts: { content: longText, position: 'left', wrapped: true }, targetStyles: { left: mid, top: mid } },
		{ name: 'top-left', targetStyles: { left: edge, top: edge } },
		{ name: 'top-middle', targetStyles: { left: mid, top: edge } },
		{ name: 'top-right', opts: { wrapped: true }, targetStyles: { right: edge, top: edge } },
		{ name: 'bottom-left', opts: { wrapped: true }, targetStyles: { bottom: edge, left: edge } },
		{ name: 'bottom-middle', opts: { wrapped: true }, targetStyles: { bottom: edge, left: mid } },
		{ name: 'bottom-right', targetStyles: { bottom: edge, right: edge } },
		{ name: 'middle-left', opts: { wrapped: true }, targetStyles: { left: edge, top: mid } },
		{ name: 'middle-right', targetStyles: { right: edge, top: mid } },
		{ name: 'boundary-top-right', opts: { content: longText, boundary: '{"top":150, "right":165}' }, targetStyles: { left: mid, top: mid } },
		{ name: 'boundary-bottom-left', opts: { content: longText, boundary: '{"bottom":150, "left":165}' }, targetStyles: { left: mid, top: mid } },
		{ name: 'min-width', opts: { content: ':)', offset: '0', state: 'error', wrapped: true }, targetStyles: { left: mid, top: mid } },
		{ name: 'max-width', opts: { content: `${longText} ${additionalText}`, offset: '0', state: 'error' }, targetStyles: { left: mid, top: mid } },
		{ name: 'horizontal', opts: { content: shortText, boundary: '{"top":175, "bottom":145}' }, targetStyles: { left: mid, top: mid } },
		{ name: 'horizontal-rtl', rtl: true, opts: { content: shortText, boundary: '{"top":175, "bottom":145}' }, targetStyles: { left: mid, top: mid } },
		{ name: 'wide-target-horizontal', opts: { wrapped: true }, targetStyles: { left: edge, right: edge, borderRadius: '5px', width: undefined } },
		{ name: 'wide-target-vertical', opts: { content: `${longText} ${additionalText}` }, targetStyles: { bottom: edge, top: edge, borderRadius: '5px', height: undefined } },
		{ name: 'too-big-for-space', opts: { content: additionalText, boundary: '{"bottom":180, "top":160, "left":65, "right":150}' }, targetStyles: { left: mid, top: mid } },
		{ name: 'align-start', opts: { align: 'start' }, targetStyles: { left: edge, right: edge, borderRadius: '5px', width: undefined } },
		{ name: 'align-start-narrow', opts: { align: 'start' }, targetStyles: { left: mid, top: mid } },
		{ name: 'align-start-rtl', rtl: true, opts: { align: 'start', wrapped: true }, targetStyles: { left: edge, right: edge, borderRadius: '5px', width: undefined } },
		{ name: 'align-end', opts: { align: 'end' }, targetStyles: { left: edge, right: edge, borderRadius: '5px', width: undefined } },
		{ name: 'align-end-narrow', opts: { align: 'end' }, targetStyles: { left: mid, top: mid } },
		{ name: 'align-end-rtl', rtl: true, opts: { align: 'end', wrapped: true }, targetStyles: { left: edge, right: edge, borderRadius: '5px', width: undefined } },
		{ name: 'bounded', opts: { content: longText, bounded: true }, targetStyles: { left: edge, top: edge } },
		{ name: 'dark-background-position-top', opts: { dark: true, content: longText, position: 'top' }, targetStyles: { left: mid, top: mid } },
		{ name: 'dark-background-position-bottom', opts: { dark: true, content: longText, position: 'bottom', wrapped: true }, targetStyles: { left: mid, top: mid } },
		{ name: 'dark-background-position-right', opts: { dark: true, content: longText, position: 'right' }, targetStyles: { left: mid, top: mid } },
		{ name: 'dark-background-position-left', opts: { dark: true, content: longText, position: 'left', wrapped: true }, targetStyles: { left: mid, top: mid } }
	].forEach(({ name, opts = {}, targetStyles = {}, rtl }) => {
		it(name, async() => {
			const elem = await fixture(createTooltip(opts, targetStyles), { rtl, viewport: { width: 400, height: 400 }, pagePadding: false });
			const tooltip = elem.querySelector('d2l-tooltip');
			tooltip.show();
			await oneEvent(tooltip, 'd2l-tooltip-show');
			await expect(document).to.be.golden();
		});
	});

	describe('scrolling', () => {

		const content = html`
			<p style="width: 500px;">
				Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sit amet mattis vulputate enim nulla aliquet. Nunc consequat interdum varius sit amet. Ac orci phasellus egestas tellus rutrum tellus pellentesque eu tincidunt.
			</p>
			<d2l-button id="target">Target</d2l-button>
			<d2l-tooltip for="target">
				${shortText}
			</d2l-tooltip>
			<p>
				Suscipit adipiscing bibendum est ultricies. At risus viverra adipiscing at in tellus. Cursus risus at ultrices mi tempus.
			</p>
		`;

		[{
			name: 'offsetParent',
			template: html`
				<div style="max-height: 250px; max-width: 450px; overflow: auto; position: relative;">
					${content}
				</div>
			`
		},
		{
			name: 'boundingContainer',
			template: html`
				<div style="max-height: 250px; max-width: 450px; overflow: auto;">
					<div style="position: relative;">
						${content}
					</div>
				</div>
			`
		}].forEach(({ name, template }) => {
			[
				{ x: 0, y: 100 },
				{ x: 25, y: 100 },
				{ x: 50, y: 100 }
			].forEach(({ x, y }) => {

				it(`${name}: ${x}, ${y}`, async() => {
					const elem = await fixture(template);
					elem.scrollTo(x, y);
					const tooltip = elem.querySelector('d2l-tooltip');
					tooltip.show();
					await oneEvent(tooltip, 'd2l-tooltip-show');
					expect(elem).to.be.golden();
				});

			});
		});

	});

});
