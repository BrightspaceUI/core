import '../colors/colors.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		color: var(--d2l-color-celestine);
		cursor: pointer;
		text-decoration: none;
	}
	:host([skeleton]) .d2l-link.d2l-skeletize::before {
		bottom: 0.2rem;
		top: 0.2rem;
	}
	.d2l-link:hover, .d2l-link:focus {
		color: var(--d2l-color-celestine-minus-1);
		outline-width: 0;
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
	:host([skeleton]) .d2l-link.d2l-link-small.d2l-skeletize::before {
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
class Link extends LitElement {

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
			`
		];
	}

	constructor() {
		super();
		this.download = false;
		this.main = false;
		this.small = false;
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

	focus() {
		const link = this.shadowRoot && this.shadowRoot.querySelector('.d2l-link');
		if (link) link.focus();
	}
}
customElements.define('d2l-link', Link);
