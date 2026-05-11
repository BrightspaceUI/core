import '../page-header-button.js';
import { html } from 'lit';

export const pageHeaderButtonFixtures = {
	disabled: html`<d2l-page-header-button icon="tier3:classes" text="Classes" disabled></d2l-page-header-button>`,
	iconText: html`<d2l-page-header-button icon="tier3:classes" text="Classes"></d2l-page-header-button>`,
	flipIcon: html`<d2l-page-header-button icon="tier3:classes" text="Classes" icon-position="end"></d2l-page-header-button>`,
	noHighlightBorder: html`<d2l-page-header-button icon="tier3:classes" text="Classes" no-highlight-border></d2l-page-header-button>`,
	textHidden: html`<d2l-page-header-button icon="tier3:classes" text="Classes" text-hidden></d2l-page-header-button>`,
	textHiddenDisabled: html`<d2l-page-header-button disabled icon="tier3:classes" text="Classes" text-hidden></d2l-page-header-button>`,
};
