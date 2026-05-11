import '../page-header-link.js';
import { html } from 'lit';

export const pageHeaderLinkFixtures = {
	iconText: html`<d2l-page-header-link href="/settings" icon="tier3:gear" text="Settings"></d2l-page-header-link>`,
	textHidden: html`<d2l-page-header-link href="/settings" icon="tier3:gear" text="Settings" text-hidden></d2l-page-header-link>`
};
