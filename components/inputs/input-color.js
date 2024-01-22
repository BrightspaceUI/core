import '../dropdown/dropdown.js';
import '../dropdown/dropdown-content.js';
import '../tooltip/tooltip.js';
import { css, html, LitElement, nothing, unsafeCSS } from 'lit';
import { buttonStyles } from '../button/button-styles.js';
import { classMap } from 'lit/directives/class-map.js';
import { FocusMixin } from '../../mixins/focus/focus-mixin.js';
import { FormElementMixin } from '../form/form-element-mixin.js';
import { getFocusPseudoClass } from '../../helpers/focus.js';
import { getUniqueId } from '../../helpers/uniqueId.js';
import { getValidHexColor } from '../../helpers/color.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { InputInlineHelpMixin } from './input-inline-help-mixin.js';
import { inputLabelStyles } from './input-label-styles.js';
import { LocalizeCoreElement } from '../../helpers/localize-core-element.js';
import { PropertyRequiredMixin } from '../../mixins/property-required/property-required-mixin.js';
import { styleMap } from 'lit/directives/style-map.js';

const DEFAULT_VALUE = '#000000';
const DEFAULT_VALUE_BG = '#FFFFFF';
const ICON_BACKGROUND = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" viewBox="0 0 16 13">
<g fill="#202122" clip-path="url(#a)">
  <path fill-rule="evenodd" d="M1.609 5.356c-2.706 2.706 4.329 9.741 7.035 7.035l4.87-4.87C15.897 5.137 8.862-1.898 6.48.486l-4.87 4.87Zm5.945 5.297L12 6.207a1.774 1.774 0 0 0-.116-.42c-.231-.613-.766-1.41-1.514-2.157-.748-.748-1.545-1.283-2.158-1.515A1.774 1.774 0 0 0 7.793 2L3.347 6.446c.988.286 1.898.863 2.62 1.586.724.723 1.301 1.633 1.587 2.62Zm.154-8.65c-.001-.002.011-.006.04-.006-.024.008-.038.008-.04.006Zm4.289 4.289c-.002-.002-.002-.016.005-.04 0 .029-.003.041-.005.04Z" clip-rule="evenodd"/>
  <path d="M12.994 11c0 1 .506 1.5 1.506 1.5S16 12 16 11c0-2-1-4.5-1.794-4.526 0 2.526-1.211 2.851-1.212 4.525Z"/>
  <path fill-rule="evenodd" d="M7.544 4.205a.55.55 0 0 1-.004-.01c-.334-.785-.925-1.602-1.603-2.218C5.244 1.347 4.543 1 4 1a.227.227 0 0 0-.086.011.208.208 0 0 0-.027.073c-.039.162-.02.44.066.8.081.343.205.694.312.964a9.174 9.174 0 0 0 .174.41l.01.022.002.005v.001a.5.5 0 0 1-.903.428L4 3.5l-.452.214v-.001l-.002-.002-.003-.008-.013-.028a10.168 10.168 0 0 1-.195-.46 8.313 8.313 0 0 1-.355-1.1c-.092-.39-.161-.86-.066-1.262.05-.21.153-.436.355-.606C3.475.073 3.731 0 4 0c.914 0 1.849.545 2.61 1.237a7.784 7.784 0 0 1 1.719 2.278 1 1 0 1 1-.784.69ZM3.91 1.014l.003-.002-.003.002Z" clip-rule="evenodd"/>
</g>
<defs>
  <clipPath id="a">
	<path fill="#fff" d="M0 0h16v13H0z"/>
  </clipPath>
</defs>
</svg>`;
const ICON_FOREGROUND = html`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="13" fill="none" viewBox="0 0 16 13">
<g clip-path="url(#a)">
  <path fill="#202122" d="M10.325 8.086 8.74 3.757a9.472 9.472 0 0 1-.243-.684 22.281 22.281 0 0 1-.252-.855c-.078.306-.16.594-.243.864-.084.264-.165.495-.243.693L6.185 8.086h4.14ZM14.6 13h-1.872a.815.815 0 0 1-.513-.153 1.016 1.016 0 0 1-.297-.396l-.972-2.655H5.555l-.972 2.655a.863.863 0 0 1-.28.378.779.779 0 0 1-.512.171H1.9L7.02-.014h2.467L14.6 13Z"/>
</g>
<defs>
  <clipPath id="a">
	<path fill="#fff" d="M0 0h16v13H0z"/>
  </clipPath>
</defs>
</svg>`;
const SWATCH_TRANSPARENT = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" fill="none" viewBox="0 0 24 20">
<mask id="a" width="24" height="20" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
  <path fill="#fff" d="M0 0h24v20H0z"/>
  <path stroke="#000" stroke-opacity=".42" d="M.5.5h23v19H.5z"/>
</mask>
<g mask="url(#a)">
  <path fill="#000" fill-opacity=".1" d="M0 0h4v4H0z"/>
  <path fill="#fff" fill-opacity=".6" d="M4 0h4v4H4z"/>
  <path fill="#000" fill-opacity=".1" d="M8 0h4v4H8z"/>
  <path fill="#fff" fill-opacity=".6" d="M12 0h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M16 0h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M20 0h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M0 16h4v4H0z"/>
  <path fill="#fff" fill-opacity=".6" d="M4 16h4v4H4z"/>
  <path fill="#000" fill-opacity=".1" d="M8 16h4v4H8z"/>
  <path fill="#fff" fill-opacity=".6" d="M12 16h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M16 16h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M20 16h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M20 4h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M0 4h4v4H0z"/>
  <path fill="#000" fill-opacity=".1" d="M4 4h4v4H4z"/>
  <path fill="#fff" fill-opacity=".6" d="M8 4h4v4H8z"/>
  <path fill="#000" fill-opacity=".1" d="M12 4h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M16 4h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M0 8h4v4H0z"/>
  <path fill="#fff" fill-opacity=".6" d="M4 8h4v4H4z"/>
  <path fill="#000" fill-opacity=".1" d="M8 8h4v4H8z"/>
  <path fill="#fff" fill-opacity=".6" d="M12 8h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M16 8h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M20 8h4v4h-4z"/>
  <path fill="#000" fill-opacity=".1" d="M20 12h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M0 12h4v4H0z"/>
  <path fill="#000" fill-opacity=".1" d="M4 12h4v4H4z"/>
  <path fill="#fff" fill-opacity=".6" d="M8 12h4v4H8z"/>
  <path fill="#000" fill-opacity=".1" d="M12 12h4v4h-4z"/>
  <path fill="#fff" fill-opacity=".6" d="M16 12h4v4h-4z"/>
</g>
</svg>`;

/**
 * This component allows for inputting a HEX color value.
 * @fires change - Dispatched when an alteration to the value is committed by the user.
 */
class InputColor extends InputInlineHelpMixin(PropertyRequiredMixin(FocusMixin(FormElementMixin(LocalizeCoreElement(LitElement))))) {

	static get properties() {
		return {
			/**
			 * Value of an associated color as a HEX which will be used for color contrast analysis
			 * @type {string}
			 */
			associatedValue: { attribute: 'associated-value', type: String },
			/**
			 * Puts the input into a disabled state
			 * @type {boolean}
			 */
			disabled: { reflect: true, type: Boolean },
			/**
			 * Disallows the user from selecting "None" as a color value
			 * @type {boolean}
			 */
			disallowNone: { attribute: 'disallow-none', type: Boolean },
			/**
			 * REQUIRED: Label for the input, comes with a default value for background & foreground types.
			 * @type {string}
			 */
			label: {
				type: String,
				required: {
					dependentProps: ['type'],
					validator: (_value, elem, hasValue) => elem.type !== 'custom' || hasValue
				}
			},
			/**
			 * Hides the label visually
			 * @type {boolean}
			 */
			labelHidden: { attribute: 'label-hidden', type: Boolean },
			/**
			 * Puts the input into a read-only state
			 * @type {boolean}
			 */
			readonly: { type: Boolean },
			/**
			 * Type of color being chosen
			 * @type {'background'|'foreground'|'custom'}
			 * @default end
			 */
			type: { reflect: true, type: String },
			/**
			 * Value of the input as a HEX color
			 * @type {string}
			 */
			value: { type: String },
			/**
			 * @ignore
			 */
			launchType: { attribute: 'launch-type', type: String },
			_opened: { state: true },
		};
	}

	static get styles() {
		return [ super.styles, buttonStyles, inputLabelStyles,
			css`
				:host {
					display: inline-block;
				}
				:host([hidden]) {
					display: none;
				}

				button {
					align-items: center;
					background-color: var(--d2l-color-gypsum);
					display: flex;
					gap: 0.15rem;
					min-height: auto;
					padding: 0.55rem;
					position: relative;
				}
				button:not([aria-disabled]):hover,
				button:not([aria-disabled]):focus,
				button.opened {
					background-color: var(--d2l-color-mica);
				}
				:host([disabled]) button {
					cursor: default;
					opacity: 0.5;
				}
				/* Firefox includes a hidden border which messes up button dimensions */
				button::-moz-focus-inner {
					border: 0;
				}

				.d2l-input-label {
					margin-bottom: 0;
					padding-bottom: 7px; /* prevent margin-collapse with readonly swatch margins */
				}

				.swatch {
					border: 1px inset rgba(0, 0, 0, 0.42);
					border-radius: 0.1rem;
					box-sizing: border-box;
					display: inline-block;
					height: 0.3rem;
					width: 1.2rem;
				}
				:host([type="custom"]) .swatch {
					border-radius: 0.15rem;
					height: 1rem;
				}
				.swatch-transparent {
					background-image: url("data:image/svg+xml;base64,${unsafeCSS(btoa(SWATCH_TRANSPARENT))}");
					background-position-y: -1.5px;
					background-size: cover;
				}
				:host([type="custom"]) .swatch-transparent {
					background-position-y: 0;
				}

				.icon-wrapper {
					align-items: center;
					display: flex;
					flex-direction: column;
					gap: 0.1rem;
				}
				.icon-wrapper > svg {
					height: 0.6rem;
				}

				.readonly-wrapper {
					border-radius: 0.1rem;
					display: block;
					line-height: 0;
					margin: 0.55rem 0;
					outline: none;
					width: 1.2rem;
				}
				.readonly-wrapper:focus {
					outline: none;
				}
				.readonly-wrapper:${unsafeCSS(getFocusPseudoClass())} {
					box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px var(--d2l-color-celestine);
				}
			`
		];
	}

	constructor() {
		super();
		this.disabled = false;
		this.disallowNone = false;
		this.labelHidden = false;
		this.launchType = 'dialog';
		this.readonly = false;
		this.type = 'custom';
		this._associatedValue = undefined;
		this._missingLabelErrorHasBeenThrown = false;
		this._opened = false;
		this._value = undefined;
		this._inlineHelpId = getUniqueId();
	}

	get associatedValue() { return this._associatedValue; }
	set associatedValue(val) {
		const oldVal = this._associatedValue;
		this._associatedValue = getValidHexColor(val);
		this.requestUpdate('associatedValue', oldVal);
	}

	get value() {
		if (this._value === undefined && this.disallowNone) {
			return this.type === 'background' ? DEFAULT_VALUE_BG : DEFAULT_VALUE;
		}
		return this._value;
	}
	set value(val) {
		const oldVal = this._value;
		this._value = getValidHexColor(val);
		this.requestUpdate('value', oldVal);
	}

	static get focusElementSelector() {
		return '#opener';
	}

	render() {

		const label = !this.labelHidden ? html`<div class="d2l-input-label">${this._getLabel()}</div>` : nothing;
		const tooltip = !this._opened ? html`<d2l-tooltip for="opener" for-type="label" class="vdiff-target">${this._getTooltipLabel()}</d2l-tooltip>` : nothing;
		const opener = this._getOpener();

		return html`
			${label}${opener}${tooltip}
			${this._renderInlineHelp(this._inlineHelpId)}
		`;

	}

	async updated(changedProperties) {

		super.updated(changedProperties);

		if (changedProperties.has('value') || changedProperties.has('type') || changedProperties.has('disallowNone')) {
			this.setFormValue(this.value);
		}

	}

	_getLabel() {
		if (this.label !== undefined) return this.label;
		if (this.type === 'background') return this.localize('components.input-color.backgroundColor');
		if (this.type === 'foreground') return this.localize('components.input-color.foregroundColor');
		return '';
	}

	_getOpener() {
		if (this.readonly) {
			return html`<div class="readonly-wrapper" id="opener" role="img" tabindex="0">${this._getSwatch()}</div>`;
		}
		const buttonClass = {
			'd2l-button': true,
			'd2l-dropdown-opener': this.launchType === 'dropdown',
			'opened': this._opened
		};
		const ariaLabel = this._opened ? this._getTooltipLabel() : undefined;
		const button = html`
			<button
				id="opener"
				class="${classMap(buttonClass)}"
				aria-describedby="${ifDefined(this._hasInlineHelp ? this._inlineHelpId : undefined)}"
				aria-disabled="${ifDefined(this.disabled ? 'true' : undefined)}"
				aria-label="${ifDefined(ariaLabel)}"
				@click="${this._handleOpenDialog}"
			>
				${this._getSwatch()}
				<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6" fill="none" viewBox="0 0 10 6">
					<path fill="#202122" d="M4.792 5.528a.733.733 0 0 1-.537-.223L.224 1.282a.745.745 0 0 1 0-1.065.751.751 0 0 1 1.057 0l3.51 3.511L8.303.218A.751.751 0 0 1 9.36 1.281L5.337 5.305a.753.753 0 0 1-.535.223h-.01Z"/>
				</svg>
			</button>`;
		if (this.launchType === 'dialog') {
			return button;
		}
		return html`
			<d2l-dropdown @d2l-dropdown-close="${this._handleClose}" @d2l-dropdown-open="${this._handleOpenDropdown}">
				${button}
				<d2l-dropdown-content max-width="350" mobile-tray="left" no-padding ?opened="${this._opened}">
					<slot @d2l-input-color-dropdown-close="${this._handleCloseRequest}"><div style="padding: 10px">Currently, color inputs only support a "launch-type" of "dropdown" from within the MVC framework. Use "launch-type" of "dialog" instead.</div></slot>
				</d2l-dropdown-content>
			</d2l-dropdown>`;
	}

	_getSwatch() {
		const styles = {
			backgroundColor: this.value ?? 'transparent'
		};
		const swatchClass = {
			'swatch': true,
			'swatch-transparent': (this.value === undefined)
		};
		const swatch = html`<div class="${classMap(swatchClass)}" style="${styleMap(styles)}"></div>`;
		if (this.type === 'background' || this.type === 'foreground') {
			const icon = (this.type === 'background') ? ICON_BACKGROUND : ICON_FOREGROUND;
			return html`<div class="icon-wrapper">${icon}${swatch}</div>`;
		}
		return swatch;
	}

	_getTooltipLabel() {
		const valueLabel = this.value !== undefined ? this.value : this.localize('components.input-color.none');
		return `${this._getLabel()}: ${valueLabel}.`;
	}

	_handleClose() {
		this._opened = false;
		/** @ignore */
		this.dispatchEvent(new CustomEvent(
			'd2l-input-color-close', { bubbles: false, composed: false }
		));
	}

	_handleCloseRequest(e) {
		if (this.launchType !== 'dropdown') return;
		this._opened = false;
		if (!e.detail) return;
		this._updateValueAndDispatchEvent(e.detail.newValue);
	}

	_handleOpenDialog() {
		if (this.launchType !== 'dialog') return;
		if (window?.D2L?.LP?.Web?.UI?.Desktop?.MasterPages?.Dialog?.Open === undefined) {
			console.warn('<d2l-color-input>: when "launch-type" is "dialog", component must be hosted in a LMS page.');
			return;
		}
		let url = new D2L.LP.Web.Http.UrlLocation('/d2l/lp/colourSelector')
			.WithQueryString('type', this.type);
		if (this.value !== undefined) {
			url = url.WithQueryString('value', this.value);
		}
		if (this.associatedValue !== undefined) {
			url = url.WithQueryString('associatedValue', this.associatedValue);
		}
		const callback = (val) => {
			if (val === undefined) return; // cancel from dialog
			this._updateValueAndDispatchEvent(val);
		};
		const dialogResult = D2L.LP.Web.UI.Desktop.MasterPages.Dialog.Open(this, url);
		dialogResult.AddReleaseListener(callback);
		dialogResult.AddListener(callback);
	}

	_handleOpenDropdown() {
		this._opened = true;
		/** @ignore */
		this.dispatchEvent(new CustomEvent(
			'd2l-input-color-open', { bubbles: false, composed: false }
		));
	}

	_updateValueAndDispatchEvent(newVal) {
		newVal = (typeof newVal === 'string') ? newVal.toUpperCase() : undefined;
		if (newVal === this.value) return;
		this.value = newVal;
		this.dispatchEvent(new CustomEvent(
			'change', { bubbles: true, composed: false }
		));
	}

}
customElements.define('d2l-input-color', InputColor);
