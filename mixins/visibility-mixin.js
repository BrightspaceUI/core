import { dedupeMixin } from '@open-wc/dedupe-mixin';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const transitionDuration = 3000;

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

		this.dummy = document.createElement('div');
		this.dummy.style.height = '0px';
		this.dummy.style.overflow = 'hidden';
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
			Object.assign(this.dummy.style, animateStyle.initialDummy);

			// we are in the middle of an earlier transition
			// idea: let the current values in the previous transition represent the starting point of the current transition, remove the dummy
			// so that it may be used again in the normal flow for the current transition
			if (document.body.contains(this.dummy)) {
				// they may have appended this elsewhere, so this opacity & transform are reset, and dummy may not contain this anymore, and

				// preserve the current opacity & transform for when we switch directions of transition
				this.style.opacity = window.getComputedStyle(this).opacity;
				this.style.transform = window.getComputedStyle(this).transform;
				console.log(this.style.opacity)

				// preserve the current dummy height for when we switch directions of transition
				this.dummy.style.height = window.getComputedStyle(this.dummy).height;
				this.dummy.replaceWith(this); // SHOULD BE REMOVE, NOT REPLACE. SINCE WE WANT THE DUMMY TO FOLLOW THE NEW POSITION OF THIS, NOT PUT THIS BACK WITH THE DUMMY
				// SHOULD _NOT_ PRESERVE HEIGHT IF THEY JUST RE-ADDED THIS TO THE DOM, i.e. they do both animate-show & appendChild, not just animate-show.
			}
			this.replaceWith(this.dummy);
			this.dummy.appendChild(this);

			// allow enough time for reflow to occur to ensure that the transition properly runs
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

			this.dummy.style.height = animateStyle.finalDummyHeight;
			this.style.opacity = animateStyle.finalOpacity;
			this.style.transform = animateStyle.finalTransform;

			this.dummy.ontransitionend = (event) => {
				// ignore bubbling of opacity/transform transitionend events from this
				// swap dummy with this at the very end of the dummy's height transition
				// dummy's height should match this height, so dummy is no longer needed
				if (event.target === this.dummy) {
					this.dummy.replaceWith(this);

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
