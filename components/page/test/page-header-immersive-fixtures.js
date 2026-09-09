import '../page-header-immersive.js';
import '../page.js';
import '../../button/button-icon.js';
import '../../button/button-iterator.js';
import '../../overflow-group/overflow-group.js';
import '../../switch/switch-visibility.js';
import { html } from 'lit';

function wrap(header) {
	return html`<d2l-page>${header}</d2l-page>`;
}

export function getBackLink(page) {
	return page
		.querySelector('d2l-page-header-immersive')
		.shadowRoot.querySelector('.back > a.d2l-page-header-highlight-link');
}

export const pageHeaderImmersiveActionsDemo = html`
	<d2l-switch-visibility slot="actions" text-position="hidden"></d2l-switch-visibility>
	<d2l-overflow-group slot="actions" min-to-show="0">
		<d2l-button-icon icon="tier1:edit" text="Edit"></d2l-button-icon>
		<d2l-button-icon icon="tier1:delete" text="Delete"></d2l-button-icon>
	</d2l-overflow-group>
	<d2l-button-iterator slot="actions"></d2l-button-iterator>
`;

export const pageHeaderImmersiveCustomTitleDemo = html`<h1 slot="title" style="align-items: center; display: flex; height: 100%; margin: 0;">Custom Title</h1>`;

export const pageHeaderImmersiveFixtures = {
	actionsTitle: wrap(html`<d2l-page-header-immersive slot="header" title-text="Assignment 1" subtitle-text="Introduction to Economics">${pageHeaderImmersiveActionsDemo}</d2l-page-header-immersive>`),
	actionsNoTitle: wrap(html`<d2l-page-header-immersive slot="header">${pageHeaderImmersiveActionsDemo}</d2l-page-header-immersive>`),
	backCustomText: wrap(html`<d2l-page-header-immersive slot="header" back-custom-text="Back to Course"></d2l-page-header-immersive>`),
	backHref: wrap(html`<d2l-page-header-immersive slot="header" back-href="/go/back"></d2l-page-header-immersive>`),
	backOnly: wrap(html`<d2l-page-header-immersive slot="header"></d2l-page-header-immersive>`),
	subtitleOnly: wrap(html`<d2l-page-header-immersive slot="header" subtitle-text="Introduction to Economics"></d2l-page-header-immersive>`),
	titleCustom: wrap(html`<d2l-page-header-immersive slot="header">${pageHeaderImmersiveCustomTitleDemo}</d2l-page-header-immersive>`),
	titleOnly: wrap(html`<d2l-page-header-immersive slot="header" title-text="Assignment 1"></d2l-page-header-immersive>`),
	titleSubtitle: wrap(html`<d2l-page-header-immersive slot="header" title-text="Assignment 1" subtitle-text="Introduction to Economics"></d2l-page-header-immersive>`),
	titleOverflow: wrap(html`<d2l-page-header-immersive slot="header" title-text="Title with a very long title that should overflow and be truncated with an ellipsis" subtitle-text="Subtitle with a very very extra long subtitle that should overflow and be truncated with an ellipsis"></d2l-page-header-immersive>`)
};
