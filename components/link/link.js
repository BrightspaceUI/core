import '../colors/colors.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		color: var(--d2l-color-celestine);
		cursor: pointer;
		outline-style: none;
		text-decoration: none;
	}
	:host([skeleton-active]) .d2l-link.d2l-skeletize::before {
		bottom: 0.2rem;
		top: 0.2rem;
	}
	.d2l-link:hover {
		color: var(--d2l-color-celestine-minus-1);
		text-decoration: underline;
	}
	.d2l-link:${unsafeCSS(getFocusPseudoClass())} {
		border-radius: 2px;
		outline: 2px solid var(--d2l-color-celestine);
		outline-offset: 1px;
		text-decoration: underline;
	}
	.d2l-link.d2l-link-main {
		font-weight: 700;
	}
	.d2l-link.d2l-link-small {
		font-size: 0.7rem;
		letter-spacing: 0.01rem;
		line-height: 1.05rem;
	}
	:host([skeleton-active]) .d2l-link.d2l-link-small.d2l-skeletize::before {
		bottom: 0.15rem;
		top: 0.15rem;
	}
	@media print {
		.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
			color: var(--d2l-color-ferrite);
		}
	}
`;

/**
 * This component can be used just like the native anchor tag.
 * @slot - The content (e.g., text) that when selected causes navigation
 */
class Link extends FocusMixin(LitElement) {

	static get properties() {
		return {
			/**
			 * Sets an accessible label
			 * @type {string}
			 */
			ariaLabel: { type: String, attribute: 'aria-label' },
			/**
			 * Download a URL instead of navigating to it
			 * @type {boolean}
			 */
			download: { type: Boolean },
			/**
			 * REQUIRED: URL or URL fragment of the link
			 * @type {string}
			 */
			href: { type: String },
			/**
			 * Whether to apply the "main" link style
			 * @type {boolean}
			 */
			main: { type: Boolean, reflect: true },
			/**
			 * Whether to truncate the link with ellipsis
			 * @type {boolean}
			 */
			overflowEllipsis: { type: Boolean, attribute: 'overflow-ellipsis', reflect: true },
			/**
			 * Whether to apply the "small" link style
			 * @type {boolean}
			 */
			small: { type: Boolean, reflect: true },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String }
		};
	}

	static get styles() {
		return [ linkStyles,
			css`
				:host {
					display: inline;
				}
				:host([hidden]) {
					display: none;
				}
				:host([small]) {
					/* needed to keep host element same height as link */
					font-size: 0.7rem;
					line-height: 1.05rem;
				}
				:host([overflow-ellipsis]) {
					display: inline-block;
					max-width: 100%;
				}
				:host([overflow-ellipsis]) .d2l-link {
					display: inline-block;
					max-width: 100%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
			`
		];
	}

	constructor() {
		super();
		this.download = false;
		this.main = false;
		this.small = false;
	}

	static get focusElementSelector() {
		return '.d2l-link';
	}

	render() {
		const linkClasses = {
			'd2l-link': true,
			'd2l-link-main': this.main,
			'd2l-link-small': this.small
		};
		return html`<a
				aria-label="${ifDefined(this.ariaLabel)}"
				class="${classMap(linkClasses)}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				target="${ifDefined(this.target)}"><slot></slot></a>`;
	}

}
customElements.define('d2l-link', Link);
