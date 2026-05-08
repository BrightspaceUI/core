import '../page-header-custom.js';
import { html } from 'lit';

export function createTabs(numTabs) {
	return html`
		<div slot="band" style="display: flex; flex-wrap: nowrap; font-size: 0.6rem; gap: 6px; line-height: 0.6rem; max-height: 1.5rem; white-space: nowrap;">
			${Array.from({ length: numTabs }, (_, i) => html`
				<div style="background-color: white; color: var(--d2l-color-celestine); margin-top: 2px; padding: 3px;">
					Tab ${i + 1}
				</div>
			`)}
		</div>
	`;
}

export const pageHeaderCustomFixtures = {
	bottom: html`<d2l-page-header-custom><div slot="bottom">Stuff in the bottom</div></d2l-page-header-custom>`,
	topBottomSkipNav: html`
		<d2l-page-header-custom has-skip-nav>
			<div slot="top">Stuff in the top</div>
			<div slot="bottom">Stuff in the bottom</div>
		</d2l-page-header-custom>
	`,
	top: html`<d2l-page-header-custom><div slot="top">Stuff in the top</div></d2l-page-header-custom>`
};
