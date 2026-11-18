import '../page-header-button.js';
import { html } from 'lit';

export const pageHeaderButtonFixtures = {
	iconText: html`<d2l-page-header-button icon="tier3:classes" text="Classes"></d2l-page-header-button>`,
	flipIcon: html`<d2l-page-header-button icon="tier3:classes" text="Classes" icon-position="end"></d2l-page-header-button>`,
	textHidden: html`<d2l-page-header-button icon="tier3:classes" text="Classes" text-hidden></d2l-page-header-button>`,
};
