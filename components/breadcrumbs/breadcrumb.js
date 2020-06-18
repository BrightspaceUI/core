import '../icons/icon.js';
import '../link/link.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class BreadCrumb extends RtlMixin(LitElement) {

	static get properties() {
		return {
			compact: {
				type: Boolean,
				reflect: true
			},
			href: {
				type: String,
				reflect: true
			},
			target: {
				type: String,
				reflect: true
			},
			text: {
				type: String,
				reflect: true
			},
			ariaLabel: {
				attribute: 'aria-label',
				type: String,
				reflect: true
			},
			_breadCrumbIcon: {
				attribute: false,
				type: String
			}
		};
	}

	static get styles() {
		return css`
			:host {
				align-items: center;
				display: inline-flex;
			}

			div.d2l-breadcrumb-wrapper {
				align-items: center;
			}

			div.d2l-breadcrumb-wrapper.compact {
				display: flex;
				flex-direction: row-reverse;
			}

			d2l-icon {
				height: 8px;
				padding-left: 10px;
				padding-right: 5px;
				width: 8px;
			}

			d2l-icon:dir(rtl) {
				padding-left: 5px;
				padding-right: 10px;
			}

			div.d2l-breadcrumb-wrapper.compact d2l-icon {
				padding-right: 10px;
				padding-left: 0;
			}

			div.d2l-breadcrumb-wrapper.compact d2l-icon:dir(rtl) {
				padding-right: 0;
				padding-left: 10px;
			}
		`;
	}

	constructor() {
		super();
		this.href = '#';
	}
	render() {
		const breadCrumbClasses = {
			'd2l-breadcrumbs-wrapper': true,
			'compact': this.compact
		};
		return html`
			<div class="${classMap(breadCrumbClasses)}" role="navigation" aria-label="${this.ariaLabel ? this.ariaLabel : this.text}">
				<d2l-link href="${this.href}" target="${this.text}">${this.text}</d2l-link>
				<d2l-icon icon="${this._breadCrumbIcon}"></d2l-icon>
			</div>
		`;
	}
	get _breadCrumbIcon() {
		return this.compact ? 'd2l-tier1:chevron-left' : 'd2l-tier1:chevron-right';
	}

}
customElements.define('d2l-breadcrumb', BreadCrumb);
