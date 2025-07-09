import '../../typography/typography.js';
import '../tooltip-help.js';
import '../../icons/icon-custom.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html, oneEvent } from '@brightspace-ui/testing';

function wrapTooltip(content) {
	return html`<div style="padding-left: 12px;">${content}</div>`;
}

describe('tooltip-help', () => {
	[
		{ name: 'hidden' },
		{ name: 'hovered and focused', action: elem => {
			focusElem(elem);
			hoverElem(elem);
		} },
		{ name: 'hovered', action: hoverElem },
		{ name: 'focused', action: focusElem },
		{ name: 'clicked', action: clickElem },
		{ name: 'skeleton', skeleton: true },
		{ name: 'skeleton and hovered', skeleton: true, action: hoverElem },
		{ name: 'skeleton and focused', skeleton: true, action: focusElem },
		{ name: 'skeleton and hovered and focused', skeleton: true, action: async(elem) => {
			await focusElem(elem);
			await hoverElem(elem);
		} }
	].forEach(({ name, action, skeleton }) => {
		it(name, async() => {
			const elem = await fixture(wrapTooltip(html`
				<d2l-tooltip-help text="More information." ?skeleton="${skeleton}">
					Here is some more information
				</d2l-tooltip-help>
			`));
			const tooltip = elem.querySelector('d2l-tooltip-help');

			if (action) {
				if (skeleton) await action(tooltip);
				else {
					action(tooltip);
					await oneEvent(tooltip, 'd2l-tooltip-show');
				}
			}

			await expect(tooltip).to.be.golden();
		});
	});

	[
		{ name: 'unordered-list', template: html`
			<d2l-tooltip-help text="More information.">
				Unordered List
				<ul>
					<li> Bullet 1 </li>
					<li> Bullet 2 </li>
					<li> Bullet 3 </li>
				</ul>
			</d2l-tooltip-help>
		` },
		{ name: 'ordered-list', template: html`
			<d2l-tooltip-help text="More information.">
				Ordered List
				<ol>
					<li> Point 1 </li>
					<li> Point 2 </li>
					<li> Point 3 </li>
				</ol>
			</d2l-tooltip-help>
		` }
	].forEach(({ name, template }) => {
		it(name, async() => {
			const elem = await fixture(wrapTooltip(template));
			const tooltip = elem.querySelector('d2l-tooltip-help');

			clickElem(tooltip);
			await oneEvent(tooltip, 'd2l-tooltip-show');
			await expect(tooltip).to.be.golden();
		});

	});

	describe('inherit-font-style', () => {
		function createInlineTooltip(paragraph) {
			const tooltip = html`<d2l-tooltip-help class="vdiff-include" text="Helpful label." inherit-font-style>Contents should elaborate on the label (be short and concise)</d2l-tooltip-help>`;
			return html`
				<div class="d2l-typography">
					<p style="padding-inline-start: 10px; width: 270px;" class="${paragraph ? 'd2l-body-compact' : 'd2l-body-small'}">
						${ paragraph ? html`
							This is some sample text. This is some more text.
							${tooltip}
							Now we have some more text. And here's a bit more text.
						` : html`
							This is some sample text.
							${tooltip}
						`}
					</p>
				</div>
			`;
		}

		[
			{ name: 'in-sentence-en', lang: 'en' },
			{ name: 'in-paragraph-en', paragraph: true, lang: 'en' },
			{ name: 'in-sentence-ar', lang: 'ar' }
		].forEach(({ name, lang, paragraph }) => {
			it(name, async() => {
				const elem = await fixture(createInlineTooltip(paragraph), { lang });
				const tooltip = elem.querySelector('d2l-tooltip-help');

				focusElem(tooltip);
				await oneEvent(tooltip, 'd2l-tooltip-show');
				await expect(elem.querySelector('p')).to.be.golden();
			});
		});
	});

	describe('icon', () => {
		it('property icon', async() => {
			const elem = await fixture(html`<d2l-tooltip-help icon="tier1:edit" text="Helpful label">Contents should elaborate on the label (be short and concise)</d2l-tooltip-help>`);
			await expect(elem).to.be.golden();
		});
		it('slotted icon', async() => {
			const elem = await fixture(html`<d2l-tooltip-help icon="tier1:edit" text="Helpful label">
				Contents should elaborate on the label (be short and concise)
				<d2l-icon-custom slot="icon">
					<svg xmlns="http://www.w3.org/2000/svg" mirror-in-rtl="true">
						<path fill="#494c4e" d="M18 12v5a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-5a1 1 0 0 1 2 0v4h14v-4a1 1 0 0 1 2 0z"/>
						<path fill="#494c4e" d="M13.85 3.15l-2.99-3A.507.507 0 0 0 10.5 0H5.4A1.417 1.417 0 0 0 4 1.43v11.14A1.417 1.417 0 0 0 5.4 14h7.2a1.417 1.417 0 0 0 1.4-1.43V3.5a.47.47 0 0 0-.15-.35zM7 2h1a1 1 0 0 1 0 2H7a1 1 0 0 1 0-2zm4 10H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2zm0-4H7a1 1 0 0 1 0-2h4a1 1 0 0 1 0 2z"/>
					</svg>
				</d2l-icon-custom>
			</d2l-tooltip-help>`);
			await expect(elem).to.be.golden();
		});
	});

	describe('wrapping text', () => {
		it('default', async() => {
			const elem = await fixture(html`
				<div style="width: 200px;">
					<d2l-tooltip-help text="Due: Saturday, January 1, 2022 at 11:59 PM">
						Here is some more information that is wrapped in a tooltip.
					</d2l-tooltip-help>
				</div>
			`);
			await expect(elem).to.be.golden();
		});

		it('hover', async() => {
			const elem = await fixture(html`
				<div style="width: 200px;">
					<d2l-tooltip-help text="Due: Saturday, January 1, 2022 at 11:59 PM">
						Here is some more information that is wrapped in a tooltip.
					</d2l-tooltip-help>
				</div>
			`);
			const tooltip = elem.querySelector('d2l-tooltip-help');
			hoverElem(tooltip);
			await oneEvent(tooltip, 'd2l-tooltip-show');
			await expect(tooltip).to.be.golden();
		});
	});
});
