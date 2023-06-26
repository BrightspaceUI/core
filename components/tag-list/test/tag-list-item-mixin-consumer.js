import '../../dropdown/dropdown.js';
import '../../dropdown/dropdown-content.js';
import { css, html, LitElement } from 'lit';
import { TagListItemMixin } from '../tag-list-item-mixin.js';

class TagListItemMixinConsumer extends TagListItemMixin(LitElement) {

	static get properties() {
		return {
			name: { type: String }
		};
	}

	static get styles() {
		return [super.styles, css`
			.color-block {
				background-color: purple;
				border-radius: 6px;
				display: inline-block;
				height: 1.2rem;
				left: 0.15rem;
				position: absolute;
				top: 50%;
				transform: translate(0, -50%);
				width: 1.2rem;
			}
			:host([dir="rtl"]) .color-block {
				left: unset;
				right: 0.15rem;
			}
			.text {
				padding-left: calc(1.55rem - 0.6rem);
				vertical-align: middle;
			}
			:host([dir="rtl"]) .text {
				padding-left: 0;
				padding-right: calc(1.55rem - 0.6rem);
			}
			d2l-dropdown {
				min-width: 0;
			}
		`];
	}

	firstUpdated(changedProperties) {
		super.firstUpdated(changedProperties);

		this.addEventListener('focus', this._toggleDropdown);
		this.addEventListener('blur', this._toggleDropdown);
	}

	render() {
		const tagContent = html`
			<div class="color-block"></div>
			<span class="text">${this.name}</span>
		`;

		return html`
			<d2l-dropdown open-on-hover>
				${this._renderTag(tagContent, { focusableClass: 'd2l-dropdown-opener', labelText: this.name })}
				<d2l-dropdown-content no-auto-focus>Custom</d2l-dropdown-content>
			</d2l-dropdown>
		`;
	}

	_toggleDropdown() {
		const dropdown = this.shadowRoot.querySelector('d2l-dropdown');
		if (dropdown) dropdown.toggleOpen();
	}
}

customElements.define('d2l-tag-list-item-mixin-consumer', TagListItemMixinConsumer);
