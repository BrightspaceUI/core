import '../../button/button.js';
import '../../button/button-subtle.js';
import '../../menu/menu.js';
import '../../menu/menu-item.js';
import '../../dropdown/dropdown-button.js';
import '../../dropdown/dropdown-button-subtle.js';
import '../../dropdown/dropdown-context-menu.js';
import '../../dropdown/dropdown-menu.js';
import '../../dropdown/dropdown.js';
import '../../link/link.js';
import '../overflow-group.js';
import { clickElem, expect, fixture, html, waitUntil } from '@brightspace-ui/testing';
import { ifDefined } from 'lit/directives/if-defined.js';

function createOverflowGroup(numButtons, opts) {
	const { minToShow, maxToShow, hideButton, noShow, openerStyle, openerType } = { hideButton: false, noShow: false, ...opts };
	return html`
		<d2l-overflow-group
			min-to-show="${ifDefined(minToShow)}"
			max-to-show="${ifDefined(maxToShow)}"
			opener-style="${ifDefined(openerStyle)}"
			opener-type="${ifDefined(openerType)}">
			${Array.from(Array(numButtons).keys()).map((key) => (openerStyle === 'subtle' ? html`
				<d2l-button-subtle text="Button ${key + 1}"></d2l-button-subtle>
			` : html`
				<d2l-button
					style="${ifDefined(hideButton && key === 0 ? 'display: none;' : undefined)}"
					class="${ifDefined(noShow && key === 1 ? 'd2l-button-group-no-show' : undefined)}"
					><span>${`Button ${key + 1}`}</span>
				</d2l-button>
			`))}
		</d2l-overflow-group>
	`;
}
function createAutoShowOverflowGroup(opts) {
	const { width } = { width: '500px', ...opts };
	return html`
		<d2l-overflow-group auto-show style="width: ${width}">
			<d2l-button>Button 1</d2l-button>
			<d2l-button class="d2l-button-group-show">Button 2</d2l-button>
			<d2l-button>Button 3</d2l-button>
			<d2l-button id="last" class="d2l-button-group-no-show">Button 4</d2l-button>
		</d2l-overflow-group>
	`;
}

async function clickOverflowMenu(elem, selector) {
	await waitUntil(() => elem.shadowRoot.querySelector(selector));
	await clickElem(elem.shadowRoot.querySelector(selector));
}

describe('overflow-group', () => {
	[
		{ name: 'more-than-max-to-show', template: createOverflowGroup(5, { minToShow: 2, maxToShow: 3 }) },
		{ name: 'less-than-min-to-show', template: createOverflowGroup(2, { minToShow: 3 }) },
		{ name: 'between-min-max-to-show', template: createOverflowGroup(3, { minToShow: 2, maxToShow: 4 }) },
		{ name: 'exactly-max-to-show', template: createOverflowGroup(4, { minToShow: 2, maxToShow: 4 }) },
		{ name: 'ignores-hidden-button', template: createOverflowGroup(3, { hideButton: true, minToShow: 1, maxToShow: 2 }) },
		{ name: 'auto-show-small', template: createAutoShowOverflowGroup({ width: '200px' }), action: elem => clickOverflowMenu(elem, '.d2l-overflow-dropdown-mini') },
		{ name: 'auto-show', template: createAutoShowOverflowGroup(), action: elem => clickOverflowMenu(elem, '.d2l-overflow-dropdown') },
		{ name: 'auto-show-add-later', template: createOverflowGroup(3, { noShow: true }), action: async(elem) => {
			elem.setAttribute('auto-show', 'auto-show');
			await elem.updateComplete;
		} },
		{ name: 'opener-type-mini-menu', template: createOverflowGroup(3, { openerType: 'icon' }) },
		{ name: 'opener-type-overflow-open-menu', template: createOverflowGroup(3, { openerType: 'icon', maxToShow: 2 }), action: elem => clickOverflowMenu(elem, '.d2l-overflow-dropdown-mini') },
		{ name: 'opener-type-subtle-overflow-menu', template: createOverflowGroup(3, { openerStyle: 'subtle', maxToShow: 2 }) },
		{ name: 'opener-type-subtle-icon', template: createOverflowGroup(3, { openerType: 'icon', openerStyle: 'subtle', maxToShow: 2 }) },
		{ name: 'all-item-types', action: elem => clickOverflowMenu(elem, '.d2l-overflow-dropdown'), template: html`
			<d2l-overflow-group style="padding-left: 40px;" min-to-show="0" max-to-show="0">
				<d2l-button>Button 1</d2l-button>
				<d2l-button-subtle text="Button subtle"></d2l-button-subtle>
				<d2l-dropdown>
					<d2l-dropdown-button text="dropdown" class="d2l-dropdown-opener"></d2l-dropdown-button>
					<d2l-dropdown-menu id="dropdown">
						<d2l-menu label="Astronomy">
							<d2l-menu-item text="Introduction"></d2l-menu-item>
							<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
							<d2l-menu-item text="The Solar System"></d2l-menu-item>
							<d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
							<d2l-menu-item text="The Night Sky"></d2l-menu-item>
							<d2l-menu-item text="The Universe"></d2l-menu-item>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown>
				<d2l-dropdown>
					<d2l-dropdown-button-subtle text="dropdown subtle" class="d2l-dropdown-opener"></d2l-dropdown-button-subtle>
					<d2l-dropdown-menu id="dropdown">
						<d2l-menu label="Astronomy">
							<d2l-menu-item text="Introduction"></d2l-menu-item>
							<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
							<d2l-menu-item text="The Solar System"></d2l-menu-item>
							<d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
							<d2l-menu-item text="The Night Sky"></d2l-menu-item>
							<d2l-menu-item text="The Universe"></d2l-menu-item>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown>
				<d2l-dropdown-context-menu text="dropdown context menu" class="d2l-dropdown-opener">
					<d2l-dropdown-menu id="dropdown">
						<d2l-menu label="Astronomy">
							<d2l-menu-item text="Introduction"></d2l-menu-item>
							<d2l-menu-item text="Searching for the Heavens "></d2l-menu-item>
							<d2l-menu-item text="The Solar System"></d2l-menu-item>
							<d2l-menu-item text="Stars &amp; Galaxies"></d2l-menu-item>
							<d2l-menu-item text="The Night Sky"></d2l-menu-item>
							<d2l-menu-item text="The Universe"></d2l-menu-item>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown-context-menu>
				<div role="separator"></div>
				<d2l-link text="link" href="https://d2l.com">Link</d2l-link>
			</d2l-overflow-group>
		` }
	].forEach(({ name, template, action }) => {
		it(name, async() => {
			const elem = await fixture(template);
			if (action) await action(elem);
			await expect(elem).to.be.golden();
		});
	});
});
