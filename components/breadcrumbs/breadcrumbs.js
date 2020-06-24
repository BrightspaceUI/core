import './breadcrumb.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

class BreadCrumbs extends RtlMixin(LitElement) {
	static get properties() {
		return {
			compact: {
				type: Boolean,
				reflect: true
			}
		};
	}

	static get styles() {
		return css`
			:host {
				--d2l-breadcrumbs-background-color: rgb(251, 252, 252);
				display: block;
				position: relative;
			}

			:host::after {
				background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), to(var(--d2l-breadcrumbs-background-color)));
				background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				background: -o-linear-gradient(left, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				background: linear-gradient(to right, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				bottom: 0;
				content: '';
				pointer-events: none;
				position: absolute;
				right: 0;
				top: 0;
				width: 10px;
			}

			:host([dir="rtl"])::after {
				background: -webkit-gradient(linear, right top, left top, from(rgba(255, 255, 255, 0)), to(var(--d2l-breadcrumbs-background-color)));
				background: -webkit-linear-gradient(right, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				background: -o-linear-gradient(right, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				background: linear-gradient(to left, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				left: 0;
				right: auto;
			}

			.d2l-breadcrumbs-wrapper {
				overflow: hidden;
				position: relative;
				white-space: nowrap;
			}

			:host([compact]) .d2l-breadcrumbs-wrapper ::slotted(d2l-breadcrumb:not(:last-of-type)) {
				display:none;
			}
		`;
	}

	constructor() {
		super();
		this.compact = false;
		this._setChildrenCompactProp();
	}

	firstUpdated(changedProperties) {
		if (changedProperties.has('compact')) {
			this._setChildrenCompactProp();
		}
	}

	render() {
		return html`
			<div class="d2l-breadcrumbs-wrapper">
				<slot @slotchange="${this._handleSlotChange}"></slot>
			</div>
		`;
	}

	updated(changedProperties) {
		if (changedProperties.has('compact')) {
			this._setChildrenCompactProp();
		}
	}

	_findBreadCrumbs(nodes) {
		let breadCrumbs = nodes.filter(item => item.nodeName === 'D2L-BREADCRUMB');
		nodes.forEach(node => {
			if (node.children) {
				breadCrumbs = breadCrumbs.concat(this._findBreadCrumbs([...node.children]));
			}
		});
		return breadCrumbs;
	}

	_handleSlotChange() {
		this._setChildrenCompactProp();
	}

	_setChildrenCompactProp() {
		if (this.shadowRoot) {
			const slot = this.shadowRoot.querySelector('slot');
			if (slot) {
				const breadCrumbs = this._findBreadCrumbs(slot.assignedNodes());
				breadCrumbs.forEach(node => {
					if (this.compact) {
						node.setAttribute('compact', '');
					} else {
						node.removeAttribute('compact');
					}
				});
			}
		}

	}

}
customElements.define('d2l-breadcrumbs', BreadCrumbs);
