import '../colors/colors.js';
import { css } from 'lit';
import { dedupeMixin } from '@open-wc/dedupe-mixin';
import { EventSubscriberController } from '../../controllers/subscriber/subscriberControllers.js';
import { svgToCSS } from '../../helpers/svg-to-css.js';

// DE50056: starting in Safari 16, the pulsing animation causes FACE
// (and possibly elsewhere) to render a blank page
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
const animation = isSafari ? css`none` : css`loadingPulse 1.8s linear infinite`;

const p2Mask = svgToCSS(`<svg xmlns="http://www.w3.org/2000/svg">
  <rect y="11%" width="100%" height="27%" rx="4"/>
  <rect y="61%" width="90%" height="27%" rx="4"/>
</svg>`);

const p3Mask = svgToCSS(`<svg xmlns="http://www.w3.org/2000/svg">
  <rect y="7%" width="100%" height="18%" rx="4"/>
  <rect y="40%" width="100%" height="18%" rx="4"/>
  <rect y="74%" width="90%" height="18%" rx="4"/>
</svg>`);

const p5Mask = svgToCSS(`<svg xmlns="http://www.w3.org/2000/svg">
  <rect y="4%" width="100%" height="11%" rx="4"/>
  <rect y="24%" width="100%" height="11%" rx="4"/>
  <rect y="44%" width="100%" height="11%" rx="4"/>
  <rect y="64%" width="100%" height="11%" rx="4"/>
  <rect y="84%" width="90%" height="11%" rx="4"/>
</svg>`);

export const skeletonStyles = css`
	@keyframes loadingPulse {
		0%, 75%, 100% { background-color: var(--d2l-theme-background-color-interactive-faint-hover); }
		50% { background-color: var(--d2l-theme-background-color-interactive-faint-default); }
	}
	:host([skeleton]) {
		isolation: isolate;
	}
	:host([skeleton]) .d2l-skeletize::before {
		animation: ${animation};
		background-color: var(--d2l-theme-background-color-interactive-faint-hover);
		border-radius: 0.2rem;
		bottom: 0;
		content: '';
		left: 0;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 997;
	}
	@media (prefers-reduced-motion: reduce) {
		:host([skeleton]) .d2l-skeletize-paragraph-2::after,
		:host([skeleton]) .d2l-skeletize-paragraph-3::after,
		:host([skeleton]) .d2l-skeletize-paragraph-5::after,
		:host([skeleton]) .d2l-skeletize::before {
			animation: none;
		}
	}
	:host([skeleton]) .d2l-skeletize,
	:host([skeleton]) .d2l-skeletize-container {
		background-color: transparent;
		border-color: var(--d2l-theme-background-color-interactive-faint-hover);
		box-shadow: none;
		color: transparent;
		position: relative;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-2,
	:host([skeleton]) .d2l-skeletize-paragraph-3,
	:host([skeleton]) .d2l-skeletize-paragraph-5 {
		color: transparent;
		position: relative;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-2::after,
	:host([skeleton]) .d2l-skeletize-paragraph-3::after,
	:host([skeleton]) .d2l-skeletize-paragraph-5::after {
		background-color: var(--d2l-theme-background-color-interactive-faint-hover);
		content: '';
		inset: 0;
		position: absolute;
		transform: var(--d2l-mirror-transform, ${document.dir === 'rtl' ? css`scale(-1, 1)` : css`none`}); /* stylelint-disable-line @stylistic/string-quotes, @stylistic/function-whitespace-after */
		transform-origin: center;
		animation: ${animation};
	}
	:host([skeleton]) .d2l-skeletize-paragraph-2::after {
		-webkit-mask-image: ${p2Mask};
		mask-image: ${p2Mask};
	}
	:host([skeleton]) .d2l-skeletize-paragraph-2::before {
		content: '\\A';
		white-space: pre;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-3::after {
		-webkit-mask-image: ${p3Mask};
		mask-image: ${p3Mask};
	}
	:host([skeleton]) .d2l-skeletize-paragraph-3::before {
		content: '\\A \\A';
		white-space: pre;
	}
	:host([skeleton]) .d2l-skeletize-paragraph-5::after {
		-webkit-mask-image: ${p5Mask};
		mask-image: ${p5Mask};
	}
	:host([skeleton]) .d2l-skeletize-paragraph-5::before {
		content: '\\A \\A \\A \\A';
		white-space: pre;
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

export const SkeletonMixin = dedupeMixin(superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * Render the component as a [skeleton loader](https://github.com/BrightspaceUI/core/tree/main/components/skeleton).
			 * @type {boolean}
			 */
			skeleton: { reflect: true, type: Boolean },
		};
	}

	static get styles() {
		const styles = [ skeletonStyles ];
		super.styles && styles.unshift(super.styles);
		return styles;
	}

	constructor() {
		super();
		this._skeletonSetByParent = false;
		this._skeletonSetExplicitly = false;
		this._skeletonActive = false;
		this._skeletonWait = false;

		this._parentSkeleton = new EventSubscriberController(this, 'skeleton', {
			onSubscribe: this._onSubscribe.bind(this),
			onUnsubscribe: this._onUnsubscribe.bind(this)
		});
	}

	get skeleton() {
		return this._skeletonActive;
	}

	set skeleton(val) {
		const oldVal = this._skeletonSetExplicitly;
		if (oldVal === val) return;
		this._skeletonSetExplicitly = val;

		// keep _skeletonActive aligned with _skeletonSetExplicitly. _skeletonActive may be modified separately by a parent SkeletonGroup
		this._skeletonActive = val;

		this.requestUpdate('skeleton', oldVal);
		this._parentSkeleton?.registry?.onSubscriberChange();
	}

	setSkeletonActive(skeletonActive) {
		const oldVal = this._skeletonActive;
		if (skeletonActive !== oldVal) {
			this._skeletonActive = skeletonActive;
			this.requestUpdate('skeleton', oldVal);
		}
	}

	setSkeletonSetByParent(skeletonSetByParent) {
		this._skeletonSetByParent = skeletonSetByParent;
	}

	_onSubscribe() {
		this._skeletonWait = true;
	}

	_onUnsubscribe() {
		this._skeletonWait = false;
		this._skeletonActive = this._skeletonSetExplicitly;
		this.requestUpdate('skeleton', this._skeletonSetExplicitly);
	}

});
