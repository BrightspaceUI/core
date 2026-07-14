import { createPage } from './page-fixtures.js';
import { html } from 'lit';

export function createDivider({
	currentSize = 450,
	maxSize = 600,
	minSize = 320,
	panelType = 'panel',
	panelPosition = 'start'
} = {}) {
	return html`
		<d2l-page-divider-internal
			label="Resize"
			current-size="${currentSize}"
			min-size="${minSize}"
			max-size="${maxSize}"
			panel-type="${panelType}"
			panel-position="${panelPosition}">
		</d2l-page-divider-internal>
	`;
}

export function getDivider(elem, panelKey) {
	return elem.shadowRoot.querySelector(`d2l-page-divider-internal[data-panel-key="${panelKey}"]`);
}

export const pageDividerFixtures = {
	sideNavBothHeaders: createPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true }),
	sideNavBothHeadersFooter: createPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavLongMainBothHeaders: createPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, mainHeight: '600px' }),
	sideNavImmersiveFooter: createPage({ layout: 'side-nav', header: 'immersive', hasFooter: true }),
	sideNavImmersiveLongFooter: createPage({ layout: 'side-nav', header: 'immersive', hasFooter: true, sideNavHeight: '600px' }),
	supportingLongFooter: createPage({ layout: 'supporting', hasFooter: true, supportingHeight: '600px' }),
	supportingImmersiveLongMain: createPage({ layout: 'supporting', header: 'immersive', mainHeight: '600px' }),
	supportingImmersiveFooter: createPage({ layout: 'supporting', header: 'immersive', hasFooter: true }),
	supportingImmersiveBothHeaders: createPage({ layout: 'supporting', header: 'immersive', hasMainHeader: true, hasSupportingHeader: true }),
};
