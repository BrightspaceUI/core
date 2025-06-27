import '../colors/colors.js';
import '../icons/icon.js';
import { css, html, LitElement, nothing } from 'lit';
import { getOverflowDeclarations, overflowEllipsisDeclarations } from '../../helpers/overflow.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { getFlag } from '../../helpers/flags.js';
import { getFocusRingStyles } from '../../helpers/focus.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { offscreenStyles } from '../offscreen/offscreen.js';
import { styleMap } from 'lit/directives/style-map.js';

const overflowClipEnabled = getFlag('GAUD-7887-core-components-overflow-clipping', true);

export const linkStyles = css`
	.d2l-link, .d2l-link:visited, .d2l-link:active, .d2l-link:link {
		--d2l-focus-ring-offset: 1px;
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
	${getFocusRingStyles('.d2l-link', { extraStyles: css`border-radius: 2px; text-decoration: underline;` })}
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
			 * ACCESSIBILITY: Label to provide more context for screen reader users when the link text is not enough
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
			target: { type: String }
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
				:host([lines]) a {
					display: flex;
					align-items: baseline;
				}
				a span.truncate {
					${overflowClipEnabled ? getOverflowDeclarations({ lines: 1 }) : css`
						-webkit-box-orient: vertical;
						display: -webkit-box;
						overflow: hidden;
						overflow-wrap: anywhere;
					`}
				}
				a span.truncate-one {
					${overflowEllipsisDeclarations}
				}
				#new-window {
					white-space: nowrap;
					line-height: 0;
					position: relative;
					top: 0.12em;
				}
				d2l-icon {
					color: var(--d2l-color-celestine);
					height: 0.95em;
					margin-inline-start: 0.315em;
					vertical-align: inherit;
					width: 0.95em;
				}

				a:hover d2l-icon {
					--d2l-icon-fill-color: var(--d2l-color-celestine-minus-1);
				}

				@media print {
					d2l-icon {
						display: none;
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
		const spanClasses = {
			'truncate': this.lines > 1,
			'truncate-one': this.lines === 1
		};
		const styles = { webkitLineClamp: this.lines || null };
		const newWindowElements = (this.target === '_blank')
			? html`<span id="new-window"><span style="font-size: 0;">&nbsp;</span><d2l-icon icon="tier1:new-window"></d2l-icon></span><span class="d2l-offscreen">${this.localize('components.link.open-in-new-window')}</span>`
			: nothing;

		/*
		* NOTICE:
		* All html template whitespace within this component is critical to proper rendering and wrapping.
		* Do not modify for readability!
		*/
		return html`<a
				aria-label="${ifDefined(this.ariaLabel)}"
				class="${classMap(linkClasses)}"
				?download="${this.download}"
				href="${ifDefined(this.href)}"
				target="${ifDefined(this.target)}"
				><span
					class="${classMap(spanClasses)}"
					style="${styleMap(styles)}"><slot></slot></span>${newWindowElements}</a>`;
	}

}
customElements.define('d2l-link', Link);
