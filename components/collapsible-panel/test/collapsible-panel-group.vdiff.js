import '../collapsible-panel.js';
import '../collapsible-panel-summary-item.js';
import '../collapsible-panel-group.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

function createCollapsiblePanel(opts) {
	const { summary, type } = { summary: false, ...opts };
	return html`
		<d2l-collapsible-panel panel-title="Availability Dates and Conditions" type="${ifDefined(type)}">
			${ summary ? html`<d2l-collapsible-panel-summary-item slot="summary" text="Availability starts 8/16/2022 and ends 8/12/2022"></d2l-collapsible-panel-summary-item>` : nothing}
			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas odio ligula, aliquam efficitur sollicitudin non, dignissim quis nisl. Nullam rutrum, lectus sed finibus consectetur, dolor leo blandit lorem, vitae consectetur arcu enim ornare tortor.
		</d2l-collapsible-panel>
	`;
}

describe('collapsible-panel-group', () => {
	[true, false].forEach(rtl => {
		[
			{ name: 'default' },
			{ name: 'subtle', type: 'subtle' },
			{ name: 'inline', type: 'inline' },
		].forEach(({ name, type }) => {
			it(`${name}${rtl ? '-rtl' : ''}`, async() => {
				const elem = await fixture(html`
					<div style="padding: 1rem; width: 600px;">
						<d2l-collapsible-panel-group>
							${createCollapsiblePanel({ type })}
							${createCollapsiblePanel({ type, summary: true })}
							${createCollapsiblePanel({ type })}
						</d2l-collapsible-panel-group>
					</div>
				`, { rtl });
				await expect(elem).to.be.golden();
			});
		});

		it(`heading-levels${rtl ? '-rtl' : ''}`, async() => {
			const elem = await fixture(html`
				<div style="padding: 1rem; width: 600px;">
					<d2l-collapsible-panel-group>
						${['1', '2', '3', '4', '5', '6'].map(level => html`
							<d2l-collapsible-panel heading-level="${level}" panel-title="Heading Level ${level}">
								Panel content
							</d2l-collapsible-panel>	
						`)}
						<d2l-collapsible-panel heading-style="2" panel-title="Heading Style 2">
							Panel content
						</d2l-collapsible-panel>
						<d2l-collapsible-panel heading-style="4" heading-level="2" panel-title="Heading Style 4">
							Panel content
						</d2l-collapsible-panel>
					</d2l-collapsible-panel-group>
				</div>
			`, { rtl });
			await expect(elem).to.be.golden();
		});
	});
});
