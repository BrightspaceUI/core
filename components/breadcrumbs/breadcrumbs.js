import './breadcrumb.js';
import { css, html, LitElement } from 'lit-element/lit-element.js';
import { classMap } from 'lit-html/directives/class-map.js';
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

			:host-context([dir="rtl"])::after {
				background: -webkit-gradient(linear, right top, left top, from(rgba(255, 255, 255, 0)), to(var(--d2l-breadcrumbs-background-color)));
				background: -webkit-linear-gradient(right, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				background: -o-linear-gradient(right, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				background: linear-gradient(to left, rgba(255, 255, 255, 0), var(--d2l-breadcrumbs-background-color));
				left: 0;
				right: auto;
			}

			:host(:dir(rtl))::after {
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

			:host([compact]) ::slotted(d2l-breadcrumb:not(:last-of-type)) {
				display:none;
			}
		`;
	}

	render() {
		const breadCrumbClasses = {
			'd2l-breadcrumbs-wrapper': true
		};
		return html`
			<div class="${classMap(breadCrumbClasses)}">
				<slot></slot>
			</div>
		`;
	}
}
customElements.define('d2l-breadcrumbs', BreadCrumbs);
