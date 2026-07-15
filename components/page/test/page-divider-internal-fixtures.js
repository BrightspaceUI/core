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

function createDividerPage(options) {
	return createPage({
		mainHeight: '100px',
		sideNavHeight: '100px',
		supportingHeight: '100px',
		...options
	});
}

export function getDivider(elem, panelKey) {
	return elem.shadowRoot.querySelector(`d2l-page-divider-internal[data-panel-key="${panelKey}"]`);
}

export function getSlider(elem) {
	return elem.shadowRoot.querySelector('.slider');
}

export const pageDividerFixtures = {
	sideNavBothHeaders: createDividerPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true }),
	sideNavBothHeadersFooter: createDividerPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavLongMainBothHeaders: createDividerPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, mainHeight: '400px' }),
	sideNavImmersiveFooter: createDividerPage({ layout: 'side-nav', header: 'immersive', hasFooter: true }),
	sideNavImmersiveLongFooter: createDividerPage({ layout: 'side-nav', header: 'immersive', hasFooter: true, sideNavHeight: '400px' }),
	supportingLongFooter: createDividerPage({ layout: 'supporting', hasFooter: true, supportingHeight: '400px' }),
	supportingImmersiveLongMain: createDividerPage({ layout: 'supporting', header: 'immersive', mainHeight: '400px' }),
	supportingImmersiveFooter: createDividerPage({ layout: 'supporting', header: 'immersive', hasFooter: true }),
	supportingImmersiveBothHeaders: createDividerPage({ layout: 'supporting', header: 'immersive', hasMainHeader: true, hasSupportingHeader: true }),
};
