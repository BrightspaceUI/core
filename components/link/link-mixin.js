import '../icons/icon.js';
import { css, html, nothing } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';

/**
 * A menu item component used for navigating.
 * @fires click - Dispatched when the link is clicked
 * @slot supporting - Allows supporting information to be displayed on the right-most side of the menu item
 */
export const LinkMixin = superclass => class extends LocalizeCoreElement(superclass) {

	static get properties() {
		return {
			/**
			 * Prompts the user to save the linked URL instead of navigating to it.
			 * Must be to a resource on the same origin.
			 * Can be used with or without a value, when set the value becomes the filename.
			 * @type {string}
			 */
			download: { type: String },
			/**
			 * REQUIRED: URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String }
		};
	}

	static get styles() {
		return [offscreenStyles, css`
			#new-window {
				line-height: 0;
				white-space: nowrap;
			}
			d2l-icon {
				color: inherit;
				height: calc(1em - 1px);
				margin-inline-start: 0.315em;
				transform: translateY(0.1em);
				vertical-align: inherit;
				width: calc(1em - 1px);
			}

			@media print {
				d2l-icon {
					display: none;
				}
			}
		`];
	}

	_render(inner, { rel = undefined, ariaLabel = undefined, linkClasses = {}, tabindex = undefined } = {}) {
		/*
		* NOTICE:
		* All html template whitespace within this component is critical to proper rendering and wrapping.
		* Do not modify for readability!
		*/
		return html`<a
			aria-label="${ifDefined(ariaLabel)}"
			class="${classMap(linkClasses)}"
			download="${this.download}"
			href="${ifDefined(this.href)}"
			target="${ifDefined(this.target)}"
			rel="${ifDefined(rel)}"
			tabindex="${ifDefined(tabindex)}"
			>${inner}</a>`;
	}

	_renderNewWindowIcon() {
		if (this.target !== '_blank') return nothing;
		return html`<span id="new-window"><span style="font-size: 0;">&nbsp;</span><d2l-icon icon="tier1:new-window"></d2l-icon></span><span class="d2l-offscreen">${this.localize('components.link.open-in-new-window')}</span>`;
	}
};
