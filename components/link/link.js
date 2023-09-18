import '../colors/colors.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { styleMap } from 'lit/directives/style-map.js';

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		color: var(--d2l-color-celestine);
		cursor: pointer;
		outline-style: none;
		text-decoration: none;
	}
	:host([skeleton]) .d2l-link.d2l-skeletize::before {
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
class Link extends LocalizeCoreElement(FocusMixin(LitElement)) {

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
			 * The number of lines to display before truncating text with an ellipsis. The text will not be truncated unless a value is specified.
			 * @type {number}
			 */
			lines: { type: Number },
			/**
			 * Whether to apply the "small" link style
			 * @type {boolean}
			 */
			small: { type: Boolean, reflect: true },
			/**
			 * Where to display the linked URL
			 * @type {string}
			 */
			target: { type: String },
			/**
			 * Whether to display the open in new window icon
			 * @type {boolean}
			 */
			newWindow: { type: Boolean, attribute: 'new-window', reflect: true }
		};
	}

	static get styles() {
		return [ linkStyles, offscreenStyles,
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
				a {
					display: inherit;
				}
				a.truncate {
					-webkit-box-orient: vertical;
					display: -webkit-box;
					overflow: hidden;
					overflow-wrap: anywhere;
				}
				@media screen {
					:host([new-window]) a::after {
						content: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2218%22%20height%3D%2218%22%20viewBox%3D%220%200%2018%2018%22%20mirror-in-rtl%3D%22true%22%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23006fbf%22%20d%3D%22M12.1.6a.944.944%200%200%200%20.2%201.04l1.352%201.353L10.28%206.37a.956.956%200%200%200%201.35%201.35l3.382-3.38%201.352%201.352a.944.944%200%200%200%201.04.2.958.958%200%200%200%20.596-.875V.96a.964.964%200%200%200-.96-.96h-4.057a.958.958%200%200%200-.883.6z%22%2F%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23006fbf%22%20d%3D%22M14%2011v5a2.006%202.006%200%200%201-2%202H2a2.006%202.006%200%200%201-2-2V6a2.006%202.006%200%200%201%202-2h5a1%201%200%200%201%200%202H2v10h10v-5a1%201%200%200%201%202%200z%22%2F%3E%0A%3C%2Fsvg%3E%0A");
						margin-inline-start: 6px;
						vertical-align: inherit;
					}
					:host([new-window][small]) a::after {
						content: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2214%22%20height%3D%2214%22%20viewBox%3D%220%200%2018%2018%22%20mirror-in-rtl%3D%22true%22%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23006fbf%22%20d%3D%22M12.1.6a.944.944%200%200%200%20.2%201.04l1.352%201.353L10.28%206.37a.956.956%200%200%200%201.35%201.35l3.382-3.38%201.352%201.352a.944.944%200%200%200%201.04.2.958.958%200%200%200%20.596-.875V.96a.964.964%200%200%200-.96-.96h-4.057a.958.958%200%200%200-.883.6z%22%2F%3E%0A%20%20%20%20%3Cpath%20fill%3D%22%23006fbf%22%20d%3D%22M14%2011v5a2.006%202.006%200%200%201-2%202H2a2.006%202.006%200%200%201-2-2V6a2.006%202.006%200%200%201%202-2h5a1%201%200%200%201%200%202H2v10h10v-5a1%201%200%200%201%202%200z%22%2F%3E%0A%3C%2Fsvg%3E%0A");
					}
				}
			`
		];
	}

	constructor() {
		super();
		this.download = false;
		this.main = false;
		this.small = false;
		this.lines = 0;
		this.newWindow = false;
	}

	static get focusElementSelector() {
		return '.d2l-link';
	}

	render() {
		const linkClasses = {
			'd2l-link': true,
			'd2l-link-main': this.main,
			'd2l-link-small': this.small,
			'truncate': this.lines > 0
		};
		const styles = (this.lines > 0) ? { '-webkit-line-clamp': this.lines } : {};
		const target = this.newWindow && this.target === undefined
			? '_blank'
			: this.target;
		const newWindowMessage = (target === '_blank')
			? html`<span class="d2l-offscreen">${this.localize('components.link.open-in-new-window')}</span>`
			: nothing;

		return html`<a
				aria-label="${ifDefined(this.ariaLabel)}"
				class="${classMap(linkClasses)}"
				style="${styleMap(styles)}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				target="${ifDefined(target)}"
			><slot></slot>${newWindowMessage}</a>`;
	}

}
customElements.define('d2l-link', Link);
