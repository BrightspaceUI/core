import { createPage } from './page-fixtures.js';
import { html } from 'lit';

export function createDivider({
	collapsed = false,
	currentSize = 450,
	maxSize = 600,
	minSize = 320,
	panelType = 'panel',
	panelPosition = 'start'
} = {}) {
	return html`
		<d2l-page-divider-internal
			style="height: 300px; margin-inline: 30px;"
			label="Resize"
			?collapsed="${collapsed}"
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

export function getDividerArrow(elem, position) {
	return elem.shadowRoot.querySelector(`.divider-arrow.${position}`);
}

export function getSlider(elem) {
	return elem.shadowRoot.querySelector('.slider');
}

export const pageDividerFixtures = {
	sideNavBothHeaders: createDividerPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true }),
	sideNavBothHeadersFooter: createDividerPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavLongMainBothHeaders: createDividerPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, mainHeight: '400px' }),
	sideNavLongMainLongFooter: createDividerPage({ layout: 'side-nav', mainHeight: '400px', sideNavHeight: '400px', hasFooter: true }),
	sideNavImmersiveFooter: createDividerPage({ layout: 'side-nav', header: 'immersive', hasFooter: true }),
	sideNavImmersiveLongFooter: createDividerPage({ layout: 'side-nav', header: 'immersive', hasFooter: true, sideNavHeight: '400px' }),
	supportingLongFooter: createDividerPage({ layout: 'supporting', hasFooter: true, supportingHeight: '400px' }),
	supportingImmersiveLongMain: createDividerPage({ layout: 'supporting', header: 'immersive', mainHeight: '400px' }),
	supportingImmersiveFooter: createDividerPage({ layout: 'supporting', header: 'immersive', hasFooter: true }),
	supportingImmersiveBothHeaders: createDividerPage({ layout: 'supporting', header: 'immersive', hasMainHeader: true, hasSupportingHeader: true }),
	supportingImmersiveLongMainLongBothHeaders: createDividerPage({ layout: 'supporting', header: 'immersive', hasMainHeader: true, hasSupportingHeader: true, mainHeight: '400px', supportingHeight: '400px' }),
	// Alternate width-type iterations
	sideNavBothHeadersWide: createDividerPage({ widthType: 'wide', layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true }),
	supportingLongFooterWide: createDividerPage({ widthType: 'wide', layout: 'supporting', hasFooter: true, supportingHeight: '400px' }),
	// With state-storage-key set
	sideNavBothHeadersStorageKey: createDividerPage({ setStateStorageKey: true, layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true }),
	sideNavBothHeadersFooterStorageKey: createDividerPage({ setStateStorageKey: true, layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	supportingLongFooterStorageKey: createDividerPage({ setStateStorageKey: true, layout: 'supporting', hasFooter: true, supportingHeight: '400px' }),
	supportingImmersiveBothHeadersStorageKey: createDividerPage({ setStateStorageKey: true, layout: 'supporting', header: 'immersive', hasMainHeader: true, hasSupportingHeader: true }),
};
