import '../colors/colors.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { css, html, LitElement } from 'lit';
import { FocusVisiblePolyfillMixin } from '../../mixins/focus-visible-polyfill-mixin.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const keyCodes = {
	ENTER: 13,
	SPACE: 32
};

class Tab extends RtlMixin(FocusVisiblePolyfillMixin(LitElement)) {

	static get properties() {
		return {
			activeFocusable: { type: Boolean, attribute: 'active-focusable' },
			selected: { type: String, reflect: true, attribute: 'selected' },
			controlsPanel: { type: String, reflect: true, attribute: 'controls-panel' },
			text: { type: String },
			href: { type: String }
		};
	}
	static get styles() {
		return css`
			:host {
				box-sizing: border-box;
				display: inline-block;
				max-width: 200px;
				position: relative;
				vertical-align: middle;
			}
			[role="tab"] {
				color: unset;
				outline: none;
				text-decoration: unset;
			}
			.d2l-tab-text {
				margin: 0.5rem;
				overflow: hidden;
				padding: 0.1rem;
				text-overflow: ellipsis;
				white-space: nowrap;
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
			:host(:first-child) .d2l-tab-selected-indicator {
				margin-left: 0;
				width: calc(100% - 0.6rem);
			}
			:host([dir="rtl"]:first-child) .d2l-tab-selected-indicator {
				margin-left: 0.6rem;
				margin-right: 0;
			}
			.focus-visible > .d2l-tab-text {
				border-radius: 0.3rem;
				box-shadow: 0 0 0 2px var(--d2l-color-celestine);
				color: var(--d2l-color-celestine);
			}
			:host([selected="true"]), [role="tab"]:focus {
				text-decoration: none;
			}
			:host(:hover) {
				color: var(--d2l-color-celestine);
				cursor: pointer;
			}
			:host([selected="true"]:hover) {
				color: inherit;
				cursor: default;
			}
			:host([selected="true"]) .d2l-tab-selected-indicator {
				display: block;
			}

			@media (prefers-reduced-motion: reduce) {
				.d2l-tab-selected-indicator {
					-webkit-transition: none;
					transition: none;
				}
			}
		`;
	}

	tabRef = createRef();

	constructor() {
		super();
		this.selected = 'false';
	}

	firstUpdated(changedProperties) {

		super.firstUpdated(changedProperties);
		this.tabRef.value.addEventListener('click', () => {
			this.selected = 'true';
		});
		this.tabRef.value.addEventListener('keydown', (e) => {
			if (e.keyCode !== keyCodes.SPACE) return;
			e.stopPropagation();
			e.preventDefault();
		});
		this.tabRef.value.addEventListener('keyup', (e) => {
			if (e.keyCode !== keyCodes.ENTER && e.keyCode !== keyCodes.SPACE) return;
			this.tabRef.value.click();
		});
	}

	render() {
		return this.href ? html`
		<a
			href="${this.href}"
		 role="tab"
		 tabindex="${this.activeFocusable ? 0 : -1}"
		 aria-selected="${this.selected ? 'true' : 'false'}"
		 ${ref(this.tabRef)}>
			<div class="d2l-tab-text">${this.text}</div>
			<div class="d2l-tab-selected-indicator"></div>
		</a>
		` : html`
		<span
		 role="tab"
		 tabindex="${this.activeFocusable ? 0 : -1}"
		 aria-selected="${this.selected ? 'true' : 'false'}"
		 ${ref(this.tabRef)}>
			<div class="d2l-tab-text">${this.text}</div>
			<div class="d2l-tab-selected-indicator"></div>
		</span>`;
	}

	update(changedProperties) {
		super.update(changedProperties);
		changedProperties.forEach((oldVal, prop) => {
			if (prop === 'selected' && this.selected === 'true') {
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
