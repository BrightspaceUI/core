import '../button-split.js';
import '../button-split-item.js';
import { clickElem, expect, fixture, focusElem, hoverElem, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('button-split', () => {

	const getTemplate = (options) => {
		const content = html`
			<d2l-button-split
				description="${ifDefined(options?.description)}"
				?disabled="${options?.disabled}"
				disabled-tooltip="${ifDefined(options?.disabledTooltip)}"
				key="save"
				?primary="${options?.primary}"
				text="Save">
				<d2l-button-split-item key="saveAsDraft" text="Save as Draft"></d2l-button-split-item>
				<d2l-button-split-item key="saveAndClose" text="Save and Close"></d2l-button-split-item>
			</d2l-button-split>
		`;
		if (options?.wrap) return html`<div style="display: inline-block; height:${options.wrap.height}; width: ${options.wrap.width};">${content}</div>`;
		else return content;
	};

	[
		{ category: 'normal', template: getTemplate() },
		{ category: 'primary', template: getTemplate({ primary: true }) }
	].forEach(({ category, template }) => {

		describe(category, () => {
			[
				{ name: 'normal' },
				{ name: 'hover-main', action: elem => hoverElem(elem.shadowRoot.querySelector('.main-action')) },
				{ name: 'focus-main', action: elem => focusElem(elem.shadowRoot.querySelector('.main-action')) },
				{ name: 'hover-opener', action: elem => hoverElem(elem.shadowRoot.querySelector('.d2l-dropdown-opener')) },
				{ name: 'focus-opener', action: elem => focusElem(elem.shadowRoot.querySelector('.d2l-dropdown-opener')) },
				{ name: 'disabled', action: elem => elem.disabled = true }
			].forEach(({ action, name }) => {
				it(name, async() => {
					const elem = await fixture(template);
					if (action) await action(elem);
					await expect(elem).to.be.golden();
				});
			});
		});

	});

	it('open', async() => {
		const container = await fixture(getTemplate({ wrap: { height: '175px', width: '225px' } }));
		const elem = container.querySelector('d2l-button-split');
		await clickElem(elem.shadowRoot.querySelector('.d2l-dropdown-opener'));
		await expect(container).to.be.golden();
	});

	it('disabled-tooltip', async() => {
		const container = await fixture(getTemplate({ disabled: true, disabledTooltip: 'Donuts', wrap: { height: '95px', width: '145px' } }));
		const elem = container.querySelector('d2l-button-split');
		await focusElem(elem.shadowRoot.querySelector('.main-action'));
		await expect(container).to.be.golden();
	});

});
