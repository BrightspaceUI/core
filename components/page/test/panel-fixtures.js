import '../../button/button.js';
import '../../button/button-icon.js';
import '../../button/button-subtle.js';
import '../../switch/switch-visibility.js';
import '../page-main.js';
import '../page-side-nav.js';
import '../page-supporting.js';
import { html, nothing } from 'lit';

const content = html`<div style="border: 2px solid green; height: 100px; padding: 10px;">Content</div>`;

export function createMain({
	hasHeaderStart = false,
	hasHeaderEnd = false,
} = {}) {
	return html`
		<d2l-page-main>
			${!hasHeaderStart ? nothing : html`
				<d2l-switch-visibility slot="header-start"></d2l-switch-visibility>
				<d2l-button-subtle slot="header-start" text="Settings" icon="tier1:gear"></d2l-button-subtle>
			`}
			${!hasHeaderEnd ? nothing : html`
				<d2l-button slot="header-end" primary>Add Existing</d2l-button>
				<d2l-button slot="header-end">Create New</d2l-button>
			`}
			${content}
		</d2l-page-main>
	`;
}

export function createSideNav({
	hasHeaderStart = false,
	hasHeaderEnd = false,
} = {}) {
	return html`
		<d2l-page-side-nav>
			${!hasHeaderStart ? nothing : html`
				<d2l-button-subtle slot="header-start" text="Add Topic" icon="tier1:plus-default"></d2l-button-subtle>
				<d2l-button-subtle slot="header-start" text="Import"></d2l-button-subtle>
			`}
			${!hasHeaderEnd ? nothing : html`
				<d2l-button-icon slot="header-end" text="Collapse All" icon="tier1:arrow-collapse"></d2l-button-icon>
				<d2l-button-icon slot="header-end" text="Settings" icon="tier1:gear"></d2l-button-icon>
			`}
			${content}
		</d2l-page-side-nav>
	`;
}

export function createSupporting({
	hasHeaderStart = false,
	hasHeaderEnd = false,
} = {}) {
	return html`
		<d2l-page-supporting>
			${!hasHeaderStart ? nothing : html`
				<d2l-button slot="header-start" primary>Save</d2l-button>
				<d2l-button slot="header-start">Cancel</d2l-button>
			`}
			${!hasHeaderEnd ? nothing : html`
				<d2l-button-icon slot="header-end" text="More Actions" icon="tier1:more"></d2l-button-icon>
				<d2l-button-icon slot="header-end" text="Close" icon="tier1:close-default"></d2l-button-icon>
			`}
			${content}
		</d2l-page-supporting>
	`;
}

export const panelFixtures = {
	main: createMain(),
	mainHeaderStart: createMain({ hasHeaderStart: true }),
	mainHeaderEnd: createMain({ hasHeaderEnd: true }),
	mainHeaderStartEnd: createMain({ hasHeaderStart: true, hasHeaderEnd: true }),
	sideNav: createSideNav(),
	sideNavHeaderStart: createSideNav({ hasHeaderStart: true }),
	sideNavHeaderEnd: createSideNav({ hasHeaderEnd: true }),
	sideNavHeaderStartEnd: createSideNav({ hasHeaderStart: true, hasHeaderEnd: true }),
	supporting: createSupporting(),
	supportingHeaderStart: createSupporting({ hasHeaderStart: true }),
	supportingHeaderEnd: createSupporting({ hasHeaderEnd: true }),
	supportingHeaderStartEnd: createSupporting({ hasHeaderStart: true, hasHeaderEnd: true }),
};
