import '../colors/colors.js';
import { css, html, LitElement, unsafeCSS } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { RtlMixin } from '../../mixins/rtl/rtl-mixin.js';
import { SkeletonMixin } from '../skeleton/skeleton-mixin.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

class Tab extends SkeletonMixin(RtlMixin(LitElement)) {

	static get properties() {
		return {
			ariaSelected: { type: String, reflect: true, attribute: 'aria-selected' },
			controlsPanel: { type: String, reflect: true, attribute: 'controls-panel' },
			// eslint-disable-next-line lit/no-native-attributes
			role: { type: String, reflect: true },
			text: { type: String }
		};
	}

	static get styles() {
		return [super.styles, css`
			:host {
				box-sizing: border-box;
				display: inline-block;
				max-width: 200px;
				outline: none;
				position: relative;
				vertical-align: middle;
			}
			.d2l-tab-text {
				margin: 0.5rem;
				overflow: hidden;
				padding: 0.1rem;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			:host([skeleton]) .d2l-tab-text.d2l-skeletize::before {
				bottom: 0.15rem;
				top: 0.15rem;
			}
			:host(:first-child) .d2l-tab-text {
				margin-left: 0;
			}
			:host([dir="rtl"]:first-child) .d2l-tab-text {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			.d2l-tab-selected-indicator {
				border-top: 4px solid var(--d2l-color-celestine);
				border-top-left-radius: 4px;
				border-top-right-radius: 4px;
				bottom: 0;
				display: none;
				margin: 1px 0.6rem 0 0.6rem;
				position: absolute;
				-webkit-transition: box-shadow 0.2s;
				transition: box-shadow 0.2s;
				width: calc(100% - 1.2rem);
			}
			:host([skeleton]) .d2l-tab-selected-indicator {
				position: absolute; /* make sure skeleton styles do not override this */
			}
			.d2l-tab-text-skeletize-override {
				min-width: 50px;
			}
			:host(:first-child) .d2l-tab-selected-indicator {
				margin-left: 0;
				width: calc(100% - 0.6rem);
			}
			:host([dir="rtl"]:first-child) .d2l-tab-selected-indicator {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			:host(:${unsafeCSS(getFocusPseudoClass())}) > .d2l-tab-text {
				border-radius: 0.3rem;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine);
				color: var(--d2l-color-celestine);
			}
			:host([aria-selected="true"]:focus) {
				text-decoration: none;
			}
			:host(:hover) {
				color: var(--d2l-color-celestine);
				cursor: pointer;
			}
			:host([aria-selected="true"]:hover) {
				color: inherit;
				cursor: default;
			}
			:host([aria-selected="true"]) .d2l-tab-selected-indicator {
				display: block;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-tab-selected-indicator {
					-webkit-transition: none;
					transition: none;
				}
			}
		`];
	}

	constructor() {
		super();
		this.ariaSelected = 'false';
		this.role = 'tab';
		this.tabIndex = -1;
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);
		this.addEventListener('click', () => {
			this.ariaSelected = 'true';
		});
		this.addEventListener('keydown', (e) => {
			if (e.keyCode !== keyCodes.SPACE) return;
			e.stopPropagation();
			e.preventDefault();
		});
		this.addEventListener('keyup', (e) => {
			if (e.keyCode !== keyCodes.ENTER && e.keyCode !== keyCodes.SPACE) return;
			this.ariaSelected = 'true';
		});
	}

	render() {
		const overrideSkeletonText = this.skeleton && (!this.text || this.text.length === 0);
		const textClasses = {
			'd2l-tab-text': true,
			'd2l-skeletize': true,
			'd2l-tab-text-skeletize-override': overrideSkeletonText
		};

		return html`
			<div class="${classMap(textClasses)}">${overrideSkeletonText ? html`&nbsp;` : this.text}</div>
			<div class="d2l-tab-selected-indicator d2l-skeletize-container"></div>
		`;
	}

	update(changedProperties) {
		super.update(changedProperties);
		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'ariaSelected' && this.ariaSelected === 'true') {
				this.dispatchEvent(new CustomEvent(
					'd2l-tab-selected', { bubbles: true, composed: true }
				));
			} else if (prop === 'text') {
				this.title = this.text;
			}
		});
	}

}

customElements.define('d2l-tab-internal', Tab);
