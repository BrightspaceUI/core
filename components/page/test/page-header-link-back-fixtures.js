import '../page-header-link-back.js';
import { html } from 'lit';

export const pageHeaderLinkBackFixtures = {
	default: html`<d2l-page-header-link-back href="/back"></d2l-page-header-link-back>`,
	customBackText: html`<d2l-page-header-link-back href="/back" text="Custom Back"></d2l-page-header-link-back>`,
};
