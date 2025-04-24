import '../button-split.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import { expect, fixture, html } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

describe('d2l-button-split', () => {

	const getTemplate = (options) => {
		return html`
			<d2l-button-split 
				description="${ifDefined(options?.description)}"
				?disabled="${options?.disabled}"
				disabled-tooltip="${ifDefined(options?.disabledTooltip)}"
				?primary="${options?.primary}"
				text="Save">
				<d2l-menu label="Other Options" slot="menu">
					<d2l-menu-item text="Save as Draft"></d2l-menu-item>
					<d2l-menu-item text="Save and Close"></d2l-menu-item>
					<d2l-menu-item text="Save and New"></d2l-menu-item>
				</d2l-menu>
			</d2l-button-split>
		`;
	};

	it('normal', async() => {
		const el = await fixture(getTemplate());
		await expect(el).to.be.accessible();
	});

	it('primary', async() => {
		const el = await fixture(getTemplate({ primary: true }));
		await expect(el).to.be.accessible();
	});

	it('description', async() => {
		const el = await fixture(getTemplate({ description: 'Mmmmm... donuts' }));
		await expect(el).to.be.accessible();
	});

	it('disabled', async() => {
		const el = await fixture(getTemplate({ disabled: true }));
		await expect(el).to.be.accessible();
	});

	it('disabled with tooltip', async() => {
		const el = await fixture(getTemplate({ disabled: true, disabledTooltip: 'Mmmmm... more donuts' }));
		await expect(el).to.be.accessible();
	});

});
