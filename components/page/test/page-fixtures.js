import '../page.js';
import '../page-footer.js';
import '../page-header-custom.js';
import '../page-header-immersive.js';
import '../page-main.js';
import '../page-side-nav.js';
import '../page-supporting.js';
import { html, nothing } from 'lit';

const footer = html`
	<d2l-page-footer slot="footer">
		Footer
		<div slot="end">End</div>
	</d2l-page-footer>
`;

const fullHeader = html`
	<d2l-page-header-custom slot="header">
		<div slot="top" style="align-items: center; display: flex; height: 90px;">Full Header</div>
	</d2l-page-header-custom>
`;

const immersiveHeader = html`
	<d2l-page-header-immersive slot="header" title-text="Assignment 1" subtitle-text="Introduction to Economics"></d2l-page-header-immersive>
`;

const panelContents = (color, height, label) => {
	return html`
		<div style="border: 5px solid ${color}; box-sizing: border-box; height: ${height}; padding: 10px;">${label}</div>
	`;
};

const panelHeader = (name) => {
	return html`
		<div slot="header-start">${name} Header</div><div slot="header-end">End</div>
	`;
};

export function createPage({
	header = 'full',
	hasFooter = false,
	hasMainHeader = false,
	hasSideNavHeader = false,
	hasSupportingHeader = false,
	layout = 'main-only',
	mainHeight = '200px',
	sideNavHeight = '250px',
	supportingHeight = '250px',
	widthType = 'normal',
	overrides = {}
} = {}) {
	return html`
		<d2l-page width-type="${widthType}">
			${header === 'full' ? fullHeader : immersiveHeader}
			${layout === 'side-nav' ? html`
				<d2l-page-side-nav slot="side-nav">
					${hasSideNavHeader ? panelHeader('Side Nav') : nothing}
					${overrides.sideNav || panelContents('green', sideNavHeight, 'Side Nav')}
				</d2l-page-side-nav>
			` : nothing}
			<d2l-page-main>
				${hasMainHeader ? panelHeader('Main') : nothing}
				${overrides.main || panelContents('blue', mainHeight, 'Main Content')}
			</d2l-page-main>
			${layout === 'supporting' ? html`
				<d2l-page-supporting slot="supporting">
					${hasSupportingHeader ? panelHeader('Supporting') : nothing}
					${overrides.supporting || panelContents('purple', supportingHeight, 'Supporting')}
				</d2l-page-supporting>
			` : nothing}
			${hasFooter ? footer : nothing}
		</d2l-page>
	`;
}

export const pageFixtures = {
	// Layout iterations
	main: createPage(),
	mainHeader: createPage({ hasMainHeader: true }),
	mainFooter: createPage({ hasFooter: true }),
	mainHeaderFooter: createPage({ hasMainHeader: true, hasFooter: true }),
	mainLong: createPage({ mainHeight: '600px' }),
	mainLongHeader: createPage({ hasMainHeader: true, mainHeight: '600px' }),
	mainLongFooter: createPage({ hasFooter: true, mainHeight: '600px' }),
	mainLongHeaderFooter: createPage({ hasMainHeader: true, hasFooter: true, mainHeight: '600px' }),
	mainImmersive: createPage({ header: 'immersive' }),
	mainImmersiveHeader: createPage({ header: 'immersive', hasMainHeader: true }),
	mainImmersiveFooter: createPage({ header: 'immersive', hasFooter: true }),
	mainImmersiveHeaderFooter: createPage({ header: 'immersive', hasMainHeader: true, hasFooter: true }),
	mainImmersiveLong: createPage({ header: 'immersive', mainHeight: '600px' }),
	mainImmersiveLongHeader: createPage({ header: 'immersive', hasMainHeader: true, mainHeight: '600px' }),
	mainImmersiveLongFooter: createPage({ header: 'immersive', hasFooter: true, mainHeight: '600px' }),
	mainImmersiveLongHeaderFooter: createPage({ header: 'immersive', hasMainHeader: true, hasFooter: true, mainHeight: '600px' }),
	sideNav: createPage({ layout: 'side-nav' }),
	sideNavHeader: createPage({ layout: 'side-nav', hasSideNavHeader: true }),
	sideNavFooter: createPage({ layout: 'side-nav', hasFooter: true }),
	sideNavHeaderFooter: createPage({ layout: 'side-nav', hasSideNavHeader: true, hasFooter: true }),
	sideNavBothHeaders: createPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true }),
	sideNavBothHeadersFooter: createPage({ layout: 'side-nav', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavLong: createPage({ layout: 'side-nav', sideNavHeight: '600px' }),
	sideNavLongHeader: createPage({ layout: 'side-nav', hasSideNavHeader: true, sideNavHeight: '600px' }),
	sideNavLongFooter: createPage({ layout: 'side-nav', hasFooter: true, sideNavHeight: '600px' }),
	sideNavLongHeaderFooter: createPage({ layout: 'side-nav', hasSideNavHeader: true, hasFooter: true, sideNavHeight: '600px' }),
	sideNavImmersive: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px' }),
	sideNavImmersiveHeader: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasSideNavHeader: true }),
	sideNavImmersiveFooter: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasFooter: true }),
	sideNavImmersiveHeaderFooter: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasSideNavHeader: true, hasFooter: true }),
	sideNavImmersiveBothHeaders: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasMainHeader: true, hasSideNavHeader: true }),
	sideNavImmersiveBothHeadersFooter: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavImmersiveLong: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', sideNavHeight: '600px' }),
	sideNavImmersiveLongHeader: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasSideNavHeader: true, sideNavHeight: '600px' }),
	sideNavImmersiveLongFooter: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasFooter: true, sideNavHeight: '600px' }),
	sideNavImmersiveLongHeaderFooter: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasSideNavHeader: true, hasFooter: true, sideNavHeight: '600px' }),
	sideNavImmersiveLongBothHeaders: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasMainHeader: true, hasSideNavHeader: true, sideNavHeight: '600px' }),
	sideNavImmersiveLongBothHeadersFooter: createPage({ header: 'immersive', layout: 'side-nav', mainHeight: '600px', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true, sideNavHeight: '600px' }),
	supporting: createPage({ layout: 'supporting', mainHeight: '600px' }),
	supportingHeader: createPage({ layout: 'supporting', mainHeight: '600px', hasSupportingHeader: true }),
	supportingFooter: createPage({ layout: 'supporting', mainHeight: '600px', hasFooter: true }),
	supportingHeaderFooter: createPage({ layout: 'supporting', mainHeight: '600px', hasSupportingHeader: true, hasFooter: true }),
	supportingBothHeaders: createPage({ layout: 'supporting', mainHeight: '600px', hasMainHeader: true, hasSupportingHeader: true }),
	supportingBothHeadersFooter: createPage({ layout: 'supporting', mainHeight: '600px', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true }),
	supportingLong: createPage({ layout: 'supporting', mainHeight: '600px', supportingHeight: '600px' }),
	supportingLongHeader: createPage({ layout: 'supporting', mainHeight: '600px', hasSupportingHeader: true, supportingHeight: '600px' }),
	supportingLongFooter: createPage({ layout: 'supporting', mainHeight: '600px', hasFooter: true, supportingHeight: '600px' }),
	supportingLongHeaderFooter: createPage({ layout: 'supporting', mainHeight: '600px', hasSupportingHeader: true, hasFooter: true, supportingHeight: '600px' }),
	supportingLongBothHeaders: createPage({ layout: 'supporting', mainHeight: '600px', hasMainHeader: true, hasSupportingHeader: true, supportingHeight: '600px' }),
	supportingLongBothHeadersFooter: createPage({ layout: 'supporting', mainHeight: '600px', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true, supportingHeight: '600px' }),
	supportingImmersive: createPage({ header: 'immersive', layout: 'supporting' }),
	supportingImmersiveHeader: createPage({ header: 'immersive', layout: 'supporting', hasSupportingHeader: true }),
	supportingImmersiveFooter: createPage({ header: 'immersive', layout: 'supporting', hasFooter: true }),
	supportingImmersiveHeaderFooter: createPage({ header: 'immersive', layout: 'supporting', hasSupportingHeader: true, hasFooter: true }),
	supportingImmersiveBothHeaders: createPage({ header: 'immersive', layout: 'supporting', hasMainHeader: true, hasSupportingHeader: true }),
	supportingImmersiveBothHeadersFooter: createPage({ header: 'immersive', layout: 'supporting', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true }),
	supportingImmersiveLong: createPage({ header: 'immersive', layout: 'supporting', supportingHeight: '600px' }),
	supportingImmersiveLongHeader: createPage({ header: 'immersive', layout: 'supporting', hasSupportingHeader: true, supportingHeight: '600px' }),
	supportingImmersiveLongFooter: createPage({ header: 'immersive', layout: 'supporting', hasFooter: true, supportingHeight: '600px' }),
	supportingImmersiveLongHeaderFooter: createPage({ header: 'immersive', layout: 'supporting', hasSupportingHeader: true, hasFooter: true, supportingHeight: '600px' }),
	// Alternate width-type iterations
	mainHeaderFooterWide: createPage({ widthType: 'wide', hasMainHeader: true, hasFooter: true }),
	mainHeaderFooterFullscreen: createPage({ widthType: 'fullscreen', hasMainHeader: true, hasFooter: true }),
	mainLongHeaderFooterWide: createPage({ widthType: 'wide', hasMainHeader: true, hasFooter: true, mainHeight: '600px' }),
	mainLongHeaderFooterFullscreen: createPage({ widthType: 'fullscreen', hasMainHeader: true, hasFooter: true, mainHeight: '600px' }),
	mainImmersiveHeaderFooterWide: createPage({ header: 'immersive', widthType: 'wide', hasMainHeader: true, hasFooter: true }),
	mainImmersiveHeaderFooterFullscreen: createPage({ header: 'immersive', widthType: 'fullscreen', hasMainHeader: true, hasFooter: true }),
	mainImmersiveLongHeaderFooterWide: createPage({ header: 'immersive', widthType: 'wide', hasMainHeader: true, hasFooter: true, mainHeight: '600px' }),
	mainImmersiveLongHeaderFooterFullscreen: createPage({ header: 'immersive', widthType: 'fullscreen', hasMainHeader: true, hasFooter: true, mainHeight: '600px' }),
	sideNavBothHeadersFooterWide: createPage({ layout: 'side-nav', widthType: 'wide', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavBothHeadersFooterFullscreen: createPage({ layout: 'side-nav', widthType: 'fullscreen', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavImmersiveBothHeadersFooterWide: createPage({ header: 'immersive', layout: 'side-nav', widthType: 'wide', mainHeight: '600px', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	sideNavImmersiveBothHeadersFooterFullscreen: createPage({ header: 'immersive', layout: 'side-nav', widthType: 'fullscreen', mainHeight: '600px', hasMainHeader: true, hasSideNavHeader: true, hasFooter: true }),
	supportingBothHeadersFooterWide: createPage({ layout: 'supporting', widthType: 'wide', mainHeight: '600px', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true }),
	supportingBothHeadersFooterFullscreen: createPage({ layout: 'supporting', widthType: 'fullscreen', mainHeight: '600px', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true }),
	supportingImmersiveBothHeadersFooterWide: createPage({ header: 'immersive', layout: 'supporting', widthType: 'wide', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true }),
	supportingImmersiveBothHeadersFooterFullscreen: createPage({ header: 'immersive', layout: 'supporting', widthType: 'fullscreen', hasMainHeader: true, hasSupportingHeader: true, hasFooter: true })
};
