import { dedupeMixin } from '@open-wc/dedupe-mixin';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const transitionDuration = 300;

export const VisibilityMixin = dedupeMixin(superclass => class extends superclass {
	static get properties() {
		return {
			animate: { type: String }
		};
	}

	constructor() {
		super();
	}

	firstUpdated() {
		this.displayOriginal = window.getComputedStyle(this).display;
	}

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'animate') {
				if (this.animate === 'show') {
					this._animateShow();
				} else if (this.animate === 'hide') {
					this._animateHide();
				} else if (this.animate === 'remove') {
					this._animateRemove();
				}
			}
		});
	}

	_animateShow() {
		this.style.display = this.displayOriginal;
		const animateShowStyle = {
			initial: {
				transition: 'all ' + transitionDuration + 'ms ease ' + transitionDuration / 3 + 'ms',
				opacity: '0',
				transform: 'translateY(-10px)'
			},
			initialDummy: {
				transition: 'height ' + transitionDuration + 'ms ease',
				height: '0px',
				overflow: 'hidden'
			},
			finalDummyHeight: this.scrollHeight + 'px',
			finalOpacity: '1',
			finalTransform: 'translateY(0px)'
		}
		this._animateVisibility(animateShowStyle)
	}

	_animateHide() {
		const dummyOnTransitionEnd = () => {
			this.displayOriginal = window.getComputedStyle(this).display;
			this.style.display = 'none';
		}
		this._animateHideRemove(dummyOnTransitionEnd);
	}

	_animateRemove() {
		const dummyOnTransitionEnd = () => {
			this.remove();
		}
		this._animateHideRemove(dummyOnTransitionEnd);
	}

	_animateHideRemove(dummyOnTransitionEnd) {
		const animateHideRemoveStyle = {
			initial: {
				transition: 'all ' + transitionDuration + 'ms ease',
				opacity: '1',
				transform: 'translateY(0px)'
			},
			initialDummy: {
				transition: 'height ' + transitionDuration + 'ms ease ' + transitionDuration / 3 + 'ms',
				height: this.scrollHeight + 'px',
				overflow: 'hidden'
			},
			finalDummyHeight: '0px',
			finalOpacity: '0',
			finalTransform: 'translateY(-10px)'
		}
		this._animateVisibility(animateHideRemoveStyle, dummyOnTransitionEnd)
	}

	async _animateVisibility(animateStyle, dummyOnTransitionEnd) {
		if (!reduceMotion) {
			Object.assign(this.style, animateStyle.initial);

			const dummy = document.createElement('div');
			Object.assign(dummy.style, animateStyle.initialDummy);
			this.replaceWith(dummy);
			dummy.appendChild(this);

			// allow enough time for reflow to occur to ensure that the transition properly runs
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

			dummy.style.height = animateStyle.finalDummyHeight;
			this.style.opacity = animateStyle.finalOpacity;
			this.style.transform = animateStyle.finalTransform;

			dummy.ontransitionend = (event) => {
				// ignore bubbling of opacity/transform transitionend events from this
				// swap dummy with this at the very end of the dummy's height transition
				// dummy's height should match this height, so dummy is no longer needed
				if (event.target === dummy) {
					dummy.replaceWith(this);

					// for each animate function, do anything that needs to be done specifically after the end of the dummy's transition
					if (dummyOnTransitionEnd) {
						dummyOnTransitionEnd();
					}
				}
			};
		}

		if (dummyOnTransitionEnd && reduceMotion) {
			dummyOnTransitionEnd();
		}
	}
});
