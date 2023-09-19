import '../switch-visibility.js';
import { expect, fixture, focusElem, html, oneEvent } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';
import { nothing } from 'lit';

function create(opts) {
	const { conditions, on, text, textPosition } = { conditions: false, on: false, ...opts };
	const conditionsMarkup = conditions ? html`
		These are some conditions that must be met for the activity to be visible.
		<ul>
			<li> Condition 1 </li>
			<li> Condition 2 </li>
			<li> Condition 3 </li>
		</ul>
	` : nothing;
	return html`
		<d2l-switch-visibility
			?on="${on}"
			text="${ifDefined(text)}"
			text-position="${ifDefined(textPosition)}">${conditionsMarkup}</d2l-switch-visibility> 
	`;
}

describe('d2l-switch-visibility', () => {

	['ltr', 'rtl'].forEach(dir => {

		describe(dir, () => {

			[
				{ name: 'off', template: create() },
				{ name: 'on', template: create({ on: true }) },
				{ name: 'off with conditions', template: create({ conditions: true }) },
				{ name: 'on with conditions', template: create({ conditions: true, on: true }) },
				{
					name: 'on with conditions text position start',
					template: create({ conditions: true, on: true, textPosition: 'start' })
				},
				{
					name: 'on text-position hidden',
					template: create({ on: true, textPosition: 'hidden' })
				},
				{
					name: 'on with conditions text-position hidden',
					template: create({ conditions: true, on: true, textPosition: 'hidden' })
				},
				{
					name: 'off text overridden',
					template: create({ text: 'Label text has been overridden.' })
				},
				{
					name: 'on text overridden',
					template: create({ on: true, text: 'Label text has been overridden.' })
				},
				{
					name: 'off with conditons text overridden',
					template: create({ conditions: true, text: 'Label text has been overridden.' })
				},
				{
					name: 'on with conditions text overridden',
					template: create({ conditions: true, on: true, text: 'Label text has been overridden.' })
				},
				{
					name: 'on with conditions text-position start text overridden',
					template: create({ conditions: true, on: true, text: 'Label text has been overridden.', textPosition: 'start' })
				},
				{
					name: 'on text-position hidden text overridden',
					template: create({ on: true, text: 'Label text has been overridden.', textPosition: 'hidden' })
				},
				{
					name: 'on with conditions text-position hidden text overridden',
					template: create({ conditions: true, on: true, text: 'Label text has been overridden.', textPosition: 'hidden' })
				},
				{
					name: 'off with only whitespace conditions',
					template: html`
						<d2l-switch-visibility>
						</d2l-switch-visibility>
					`
				},
				{
					name: 'on with only whitespace conditions',
					template: html`
						<d2l-switch-visibility on>
						</d2l-switch-visibility>
					`
				},
				{
					name: 'on with only lots of whitespace conditions',
					template: html`
						<d2l-switch-visibility on>
											
						</d2l-switch-visibility> 
					`
				},
				{
					name: 'on with only loooots of whitespace conditions',
					template: html`
						<d2l-switch-visibility on>
			                                                                                            					




























			</d2l-switch-visibility>
					`
				}
			].forEach(({ name, template }) => {
				it(name, async() => {
					const elem = await fixture(template, { rtl: dir === 'rtl' });
					await expect(elem).to.be.golden();
				});
			});

			it('on with conditions and conditions focused', async() => {
				const elem = await fixture(create({ conditions: true, on: true }), { rtl: dir === 'rtl' });
				const tooltip = elem.shadowRoot.querySelector('#conditions-help');
				focusElem(tooltip);
				await oneEvent(tooltip, 'd2l-tooltip-show');
				await expect(elem).to.be.golden();
			});

		});

	});

});
