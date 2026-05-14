import '../page-header-button.js';
import '../page-header-immersive.js';
import '../page-header-separator.js';
import '../page.js';
import '../../dropdown/dropdown-content.js';
import '../../dropdown/dropdown-more.js';
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

export const pageHeaderImmersiveDemo = html`
	<d2l-page-header-immersive slot="header" title-text="Assignment 1" subtitle-text="Introduction to Economics">
		<d2l-switch-visibility slot="actions"></d2l-switch-visibility>
		<d2l-dropdown-more slot="actions" text="More options">
			<d2l-dropdown-content>Actions go here</d2l-dropdown-content>
		</d2l-dropdown-more>
		<div slot="actions" style="height: 100%">
			<d2l-page-header-button icon="tier3:chevron-left-circle" text="Previous" text-hidden></d2l-page-header-button>
			<d2l-page-header-separator style="margin: 0;"></d2l-page-header-separator>
			<d2l-page-header-button icon="tier3:chevron-right-circle" text="Next" text-hidden></d2l-page-header-button>
		</div>
	</d2l-page-header-immersive>
`;

export const pageHeaderImmersiveFixtures = {
	actions: wrap(pageHeaderImmersiveDemo),
	backCustomText: wrap(html`<d2l-page-header-immersive slot="header" back-custom-text="Back to Course"></d2l-page-header-immersive>`),
	backHref: wrap(html`<d2l-page-header-immersive slot="header" back-href="/go/back"></d2l-page-header-immersive>`),
	backOnly: wrap(html`<d2l-page-header-immersive slot="header"></d2l-page-header-immersive>`),
	subtitleOnly: wrap(html`<d2l-page-header-immersive slot="header" subtitle-text="Introduction to Economics"></d2l-page-header-immersive>`),
	titleCustom: wrap(html`<d2l-page-header-immersive slot="header"><h1 slot="title" style="align-items: center; display: flex; height: 100%; margin: 0;">Custom Title</h1></d2l-page-header-immersive>`),
	titleOnly: wrap(html`<d2l-page-header-immersive slot="header" title-text="Assignment 1"></d2l-page-header-immersive>`),
	titleSubtitle: wrap(html`<d2l-page-header-immersive slot="header" title-text="Assignment 1" subtitle-text="Introduction to Economics"></d2l-page-header-immersive>`),
	titlesOverflow: wrap(html`<d2l-page-header-immersive slot="header" title-text="Title with a very long title that should overflow and be truncated with an ellipsis" subtitle-text="Subtitle with a very very extra long subtitle that should overflow and be truncated with an ellipsis"></d2l-page-header-immersive>`)
};
