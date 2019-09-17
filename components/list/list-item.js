import { css, html, LitElement } from 'lit-element/lit-element.js';
import { checkboxStyles } from '../inputs/checkbox-shared-styles.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import ResizeObserver from 'resize-observer-polyfill';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

const ro = new ResizeObserver(entries => {
	entries.forEach(entry => {
		if (!entry || !entry.target || !entry.target.resizedCallback) {
			return;
		}
		entry.target.resizedCallback(entry.contentRect && entry.contentRect.width);
	});
});

class ListItem extends RtlMixin(LitElement) {
	static get properties() {
		return {
			breakpoints: { type: Array },
			selected: { type: Boolean, reflect: true },
			illustrationOutside: { type: Boolean, attribute: 'illustration-outside'},
			role: { type: String, reflect: true },
			selectable: {type: Boolean },
			_breakpoint: { type: Number }
		};
	}

	static get styles() {
		const layout = css`
			:host {
				display: block;
				margin: 0.05rem 0;
			}
			:host[hidden] {
				display: none;
			}
			.d2l-list-item-flex {
				display: flex;
				position: relative;
			}
			.d2l-list-item-content {
				background: var(--d2l-list-item-background, none);
				border-bottom: var(--d2l-list-item-divider-bottom, 1px solid var(--d2l-color-mica));
				border-top: var(--d2l-list-item-divider-top, 1px solid var(--d2l-color-mica));
				box-sizing: content-box;
				margin-bottom: -0.05rem;
				margin-top: -0.05rem;
				padding-bottom: var(--d2l-list-item-divider-padding-bottom, 0);
				padding-top: var(--d2l-list-item-divider-padding-top, 0);
				position: relative;
				width: 100%;
			}
			.d2l-list-item-flex:hover .d2l-list-item-content {
				background: var(--d2l-list-item-hover-background, none);
			}
			.d2l-list-item-content-flex {
				display: flex;
				flex-grow: 1;
				justify-content: stretch;
				padding: 0.55rem var(--d2l-list-item-content-padding-side, 0);
			}
			::slotted([slot="illustration"]) {
				display: flex;
				flex-grow: 0;
				flex-shrink: 0;
				margin: 0.15rem 0;
				margin-right: 0.9rem;
				max-height: 2.6rem;
				max-width: 4.5rem;
				overflow:hidden;
			}
			:host([dir="rtl"]) ::slotted([slot="illustration"]) {
				margin-left: 0.9rem;
				margin-right: 0;
			}
			::slotted([slot="actions"]) {
				align-self: flex-start;
				display: grid;
				flex-grow: 0;
				grid-auto-columns: 1fr;
				grid-auto-flow: column;
				grid-gap: 0.3rem;
				margin: 0.15rem 0;
				position: relative;
				z-index: 150;
			}
			.d2l-list-item-main {
				flex-grow: 1;
				margin-top: 0.05rem;
			}
			.d2l-list-item-link,
			.d2l-list-item-label {
				height: 100%;
				position: absolute;
				width: 100%;
				z-index: 100;
			}
			input[type="checkbox"] {
				flex-shrink: 0;
				margin: 0.6rem 0.9rem;
				margin-left: 0;
			}
			:host([dir="rtl"]) input[type="checkbox"] {
				margin-left: 0.9rem;
				margin-right: 0;
			}
		`;
		const illustrationOutside = css`
			:host([illustration-outside]) .d2l-list-item-content-flex {
				padding: 0.55rem 0;
			}
			:host([illustration-outside]) ::slotted([slot="illustration"]) {
				margin-bottom: 0.7rem;
				margin-top: 0.7rem;
			}
			:host([illustration-outside]) input[type="checkbox"] {
				margin-bottom: 1.15rem;
				margin-top: 1.15rem;
			}
		`;

		const primaryAction = css`
			:host([href]) .d2l-list-item-label {
				width: 3.0rem;
				z-index: 150;
			}
			:host([href]) {
				--d2l-list-item-content-text-color: var(--d2l-color-celestine);
			}
			:host([href]) .d2l-list-item-link:hover + .d2l-list-item-content {
				--d2l-list-item-content-text-decoration: underline;
			}
		`;

		const breakPoint1 = css`
			.d2l-list-item-flex[breakpoint="1"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 3.55rem;
				max-width: 6rem;
			}
			:host([dir="rtl"]) .d2l-list-item-flex[breakpoint="1"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}
		`;

		const breakPoint2 = css`
			.d2l-list-item-flex[breakpoint="2"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 5.1rem;
				max-width: 9rem;
			}
			:host([dir="rtl"]) .d2l-list-item-flex[breakpoint="2"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}
		`;

		const breakPoint3 = css`
			.d2l-list-item-flex[breakpoint="3"] ::slotted([slot="illustration"]) {
				margin-right: 1rem;
				max-height: 6rem;
				max-width: 10.8rem;
			}
			:host([dir="rtl"]) .d2l-list-item-flex[breakpoint="3"] ::slotted([slot="illustration"]) {
				margin-left: 1rem;
				margin-right: 0;
			}
		`;
		return [ checkboxStyles, layout, primaryAction, breakPoint1, breakPoint2, breakPoint3, illustrationOutside];
	}

	constructor() {
		super();
		this._breakpoint = 0;
		this.breakpoints = [842, 636, 580, 0];
		this.role = 'listitem';
		this.selected = false;
		this._contentId = getUniqueId();
		this._checkBoxId = getUniqueId();
	}

	get breakpoints() {
		return this._breakpoints;
	}

	set breakpoints(val) {
		const oldVal = this._breakpoints;
		this._breakpoints = val.sort((a, b) => b - a).slice(0, 4);
		this.requestUpdate('breakpoints', oldVal);
	}

	render() {
		let label, checkbox = html``;
		if (this.selectable) {
			label = html`<label class="d2l-list-item-label" for="${this._checkBoxId}" aria-labelledby="${this._contentId}"></label>`;
			checkbox = html`<input @change="${this._handleChange}" type="checkbox" id="${this._checkBoxId}">`;
		}
		const link = html`
			<a class="d2l-list-item-link" href="${ifDefined(this.href)}" aria-labelledby="${this._contentId}"></a>
		`;
		const illustrationSlot = html`
			${checkbox}
			<slot name="illustration"></slot>
		`;
		return html`
			<div class="d2l-list-item-flex d2l-visible-on-ancestor-target" breakpoint="${this._breakpoint}">
				${label}
				${this.illustrationOutside ? illustrationSlot : null}
				${this.href ? link : null}
				<div class="d2l-list-item-content" id="${this._contentId}">
					<div class="d2l-list-item-content-flex">
						${this.illustrationOutside ? null : illustrationSlot}
						<div class="d2l-list-item-main"><slot></slot></div>
						<slot name="actions"></slot>
					</div>
				</div>
			</div>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('breakpoints')) {
			this.resizedCallback(this.offsetWidth);
		}
	}

	connectedCallback() {
		super.connectedCallback();
		ro.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		ro.unobserve(this);
	}

	resizedCallback(width) {
		const lastBreakpointIndexToCheck = 3;
		this.breakpoints.some((breakpoint, index) => {
			if (width >= breakpoint || index > lastBreakpointIndexToCheck) {
				this._breakpoint = lastBreakpointIndexToCheck - index - (lastBreakpointIndexToCheck - this.breakpoints.length + 1) * index;
				return true;
			}
		});
	}
	_handleChange(e) {
		this.selected = e.target.checked;
	}
}

customElements.define('d2l-list-item', ListItem);
