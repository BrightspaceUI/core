import { clickElem, dragElemBy, focusElem, hoverElem, nextFrame, sendKeysElem } from '@brightspace-ui/testing';
import { createPage, getDivider } from './page-fixtures.js';
import { html } from 'lit';

/* Page Helpers */
export function dispatchDividerResize(elem, panelKey, requestedSize) {
	getDivider(elem, panelKey).dispatchEvent(new CustomEvent('d2l-page-divider-resize', { detail: { requestedSize } }));
}
export function dispatchDividerToggle(elem, panelKey) {
	getDivider(elem, panelKey).dispatchEvent(new CustomEvent('d2l-page-divider-toggle'));
}

export async function clickDivider(elem, panelKey) {
	await clickElem(getDivider(elem, panelKey));
	await nextFrame();
}
export async function clickDividerArrow(elem, panelKey, arrowPosition) {
	const divider = getDivider(elem, panelKey);
	await focusElem(divider);
	await clickElem(getDividerArrow(divider, arrowPosition));
}
export async function clickDividerHandle(elem, panelKey) {
	await clickElem(getSlider(getDivider(elem, panelKey)));
	await nextFrame();
}

export async function focusDivider(elem, panelKey) {
	await focusElem(getDivider(elem, panelKey));
}

export async function hoverDivider(elem, panelKey) {
	await hoverElem(getDivider(elem, panelKey));
}
export async function hoverDividerArrow(elem, panelKey, arrowPosition) {
	const divider = getDivider(elem, panelKey);
	await focusElem(divider);
	await hoverElem(getDividerArrow(divider, arrowPosition));
}
export async function hoverDividerHandle(elem, panelKey) {
	await hoverElem(getSlider(getDivider(elem, panelKey)));
}

export async function pressKeyDivider(elem, panelKey, key) {
	const divider = getDivider(elem, panelKey);
	await sendKeysElem(divider, 'press', key);
}

/* Divider Helpers */
export function getDividerArrow(elem, position) {
	return elem.shadowRoot.querySelector(`.divider-arrow.${position}`);
}
export function getSlider(elem) {
	return elem.shadowRoot.querySelector('.slider');
}

export async function clickArrow(elem, arrowPosition) {
	await focusElem(elem);
	await clickElem(getDividerArrow(elem, arrowPosition));
}
export async function clickHandle(elem) {
	await clickElem(getSlider(elem));
}

export async function dragArrow(elem, arrowPosition, { x = 0, y = 0 } = {}) {
	await focusElem(elem);
	await dragElemBy(getDividerArrow(elem, arrowPosition), x, y);
}
export async function dragDivider(elem, { x = 0, y = 0 } = {}) {
	await dragElemBy(elem, x, y);
}
export async function dragHandle(elem, { x = 0, y = 0 } = {}) {
	await dragElemBy(getSlider(elem), x, y);
}

export function createDivider({
	collapsed = false,
	collapsedSize = 14,
	currentSize = 450,
	maxSize = 600,
	minSize = 320,
	panelType = 'panel',
	panelPosition = 'start',
	margin = 30
} = {}) {
	const drawerStyles = `width: 300px; margin-block: ${margin}px;`;
	const panelStyles = `height: 300px; margin-inline: ${margin}px;`;

	return html`
		<d2l-page-divider-internal
			style="${panelType === 'drawer' ? drawerStyles : panelStyles}"
			label="Resize"
			?collapsed="${collapsed}"
			collapsed-size="${collapsedSize}"
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
