import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { RtlMixin } from '../../mixins/rtl-mixin.js';

export const skeletonStyles = css`
	@keyframes loadingPulse {
		0% { background-color: var(--d2l-color-sylvite); }
		50% { background-color: var(--d2l-color-regolith); }
		75% { background-color: var(--d2l-color-sylvite); }
		100% { background-color: var(--d2l-color-sylvite); }
	}
	:host([skeleton]) {
		opacity: .999;
	}
	:host([skeleton]) .d2l-skeletize::before {
		animation: loadingPulse 1.8s linear infinite;
		background-color: var(--d2l-color-sylvite);
		border-radius: 0.2rem;
		bottom: 0;
		content: '';
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 999;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([skeleton]) .d2l-skeletize::before {
			animation: none;
		}
	}
	:host([skeleton]) .d2l-skeletize,
	:host([skeleton]) .d2l-skeletize-container {
		background-color: transparent;
		border-color: var(--d2l-color-sylvite);
		box-shadow: none;
		color: transparent;
		position: relative;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-2 {
		background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cstyle%3E%0A%20%20%20%20%40keyframes%20loadingPulse%7B0%25%2C75%25%7Bfill%3A%23f1f5fb%7D50%25%7Bfill%3A%23f9fbff%7D%7D.skeleton%7Banimation%3AloadingPulse%201.8s%20linear%20infinite%3Bfill%3A%23f1f5fb%7D%0A%20%20%3C%2Fstyle%3E%0A%20%20%3Crect%20y%3D%2211%25%22%20width%3D%22100%25%22%20height%3D%2227%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2261%25%22%20width%3D%2290%25%22%20height%3D%2227%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%3C%2Fsvg%3E');
		color: transparent;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([skeleton]) .d2l-skeletize-paragraph-2 {
			background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Crect%20y%3D%2211%25%22%20width%3D%22100%25%22%20height%3D%2227%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2261%25%22%20width%3D%2290%25%22%20height%3D%2227%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%3C%2Fsvg%3E');
		}
	}
	:host([skeleton]) .d2l-skeletize-paragraph-2::before {
		content: '\\A';
		white-space: pre;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-3 {
		background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cstyle%3E%0A%20%20%20%20%40keyframes%20loadingPulse%7B0%25%2C75%25%7Bfill%3A%23f1f5fb%7D50%25%7Bfill%3A%23f9fbff%7D%7D.skeleton%7Banimation%3AloadingPulse%201.8s%20linear%20infinite%3Bfill%3A%23f1f5fb%7D%0A%20%20%3C%2Fstyle%3E%0A%20%20%3Crect%20y%3D%227%25%22%20width%3D%22100%25%22%20height%3D%2218%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2240%25%22%20width%3D%22100%25%22%20height%3D%2218%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2274%25%22%20width%3D%2290%25%22%20height%3D%2218%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%3C%2Fsvg%3E');
		color: transparent;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([skeleton]) .d2l-skeletize-paragraph-3 {
			background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Crect%20y%3D%227%25%22%20width%3D%22100%25%22%20height%3D%2218%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2240%25%22%20width%3D%22100%25%22%20height%3D%2218%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2274%25%22%20width%3D%2290%25%22%20height%3D%2218%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%3C%2Fsvg%3E');
		}
	}
	:host([skeleton]) .d2l-skeletize-paragraph-3::before {
		content: '\\A \\A';
		white-space: pre;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-5 {
		background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Cstyle%3E%0A%20%20%20%20%40keyframes%20loadingPulse%7B0%25%2C75%25%7Bfill%3A%23f1f5fb%7D50%25%7Bfill%3A%23f9fbff%7D%7D.skeleton%7Banimation%3AloadingPulse%201.8s%20linear%20infinite%3Bfill%3A%23f1f5fb%7D%0A%20%20%3C%2Fstyle%3E%0A%20%20%3Crect%20y%3D%224%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2224%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2244%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2264%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%20%20%3Crect%20y%3D%2284%25%22%20width%3D%2290%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20class%3D%22skeleton%22%2F%3E%0A%3C%2Fsvg%3E');
		color: transparent;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([skeleton]) .d2l-skeletize-paragraph-5 {
			background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%3Crect%20y%3D%224%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2224%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2244%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2264%25%22%20width%3D%22100%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%20%20%3Crect%20y%3D%2284%25%22%20width%3D%2290%25%22%20height%3D%2211%25%22%20rx%3D%224%22%20fill%3D%22%23f1f5fb%22%2F%3E%0A%3C%2Fsvg%3E');
		}
	}
	:host([skeleton]) .d2l-skeletize-paragraph-5::before {
		content: '\\A \\A \\A \\A';
		white-space: pre;
	}
	:host([skeleton][dir="rtl"]) .d2l-skeletize-paragraph-2,
	:host([skeleton][dir="rtl"]) .d2l-skeletize-paragraph-3,
	:host([skeleton][dir="rtl"]) .d2l-skeletize-paragraph-5 {
		transform: scale(-1, 1);
		transform-origin: center;
	}
	:host([skeleton]) .d2l-skeletize-95::before {
		width: 95%;
	}
	:host([skeleton]) .d2l-skeletize-90::before {
		width: 90%;
	}
	:host([skeleton]) .d2l-skeletize-85::before {
		width: 85%;
	}
	:host([skeleton]) .d2l-skeletize-80::before {
		width: 80%;
	}
	:host([skeleton]) .d2l-skeletize-75::before {
		width: 75%;
	}
	:host([skeleton]) .d2l-skeletize-70::before {
		width: 70%;
	}
	:host([skeleton]) .d2l-skeletize-65::before {
		width: 65%;
	}
	:host([skeleton]) .d2l-skeletize-60::before {
		width: 60%;
	}
	:host([skeleton]) .d2l-skeletize-55::before {
		width: 55%;
	}
	:host([skeleton]) .d2l-skeletize-50::before {
		width: 50%;
	}
	:host([skeleton]) .d2l-skeletize-45::before {
		width: 45%;
	}
	:host([skeleton]) .d2l-skeletize-40::before {
		width: 40%;
	}
	:host([skeleton]) .d2l-skeletize-35::before {
		width: 35%;
	}
	:host([skeleton]) .d2l-skeletize-30::before {
		width: 30%;
	}
	:host([skeleton]) .d2l-skeletize-25::before {
		width: 25%;
	}
	:host([skeleton]) .d2l-skeletize-20::before {
		width: 20%;
	}
	:host([skeleton]) .d2l-skeletize-15::before {
		width: 15%;
	}
	:host([skeleton]) .d2l-skeletize-10::before {
		width: 10%;
	}
	:host([skeleton]) .d2l-skeletize-5::before {
		width: 5%;
	}
`;

export const SkeletonMixin = dedupeMixin(superclass => class extends RtlMixin(superclass) {

	static get properties() {
		return {
			skeleton: { reflect: true, type: Boolean  }
		};
	}

	static get styles() {
		const styles = [ skeletonStyles ];
		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this.skeleton = false;
	}

});
