import { dedupeMixin } from '@open-wc/dedupe-mixin';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const transitionDuration = 300;
const moveYValue = 10;

export const VisibilityMixin = dedupeMixin(superclass => class extends superclass {
	static get properties() {
		return {
			animate: { type: String }
		};
	}

	firstUpdated() {
		this.opacityOriginal = window.getComputedStyle(this).opacity;
		this.transformOriginal = window.getComputedStyle(this).transform;
		this.displayOriginal = window.getComputedStyle(this).display;
		this.transitionOriginal = window.getComputedStyle(this).transition;

		this.dummy = document.createElement('div');
		this.dummy.style.overflow = 'hidden';
		this.dummy.style.display = 'grid';
	}

	updated(changedProperties) {
		super.updated(changedProperties);
		if (changedProperties.has('animate')) {
			if (this.animate === 'show') {
				this._animateShow();
			} else if (this.animate === 'hide') {
				this._animateHide();
			} else if (this.animate === 'remove') {
				this._animateRemove();
			}
		}
	}

	_animateHide() {
		const thisOnTransitionStart = () => {
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-hide-start',
				{ bubbles: true, composed: false }
			));
		}
		const dummyOnTransitionEnd = () => {
			this.dummy.replaceWith(this);
			this.style.display = 'none';
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-hide-end',
				{ bubbles: true, composed: false }
			));
		};
		this._animateHideRemove(thisOnTransitionStart, dummyOnTransitionEnd);
	}

	_animateHideRemove(thisOnTransitionStart, dummyOnTransitionEnd) {
		const animateHideRemoveStyle = {
			initial: {
				transition: `all ${transitionDuration}ms ease`,
				opacity: `${this.opacityOriginal}`,
				transform: `${this.transformOriginal}`
			},
			initialDummy: {
				transition: `height ${transitionDuration}ms ease ${transitionDuration / 3}ms`,
				height: `calc(${this.scrollHeight}px + ${window.getComputedStyle(this).marginTop} + ${window.getComputedStyle(this).marginBottom})`
			},
			final: {
				opacity: '0',
				transform: `translateY(-${moveYValue}px)`
			},
			finalDummy: {
				height: '0'
			},
			thisOnTransitionStart: thisOnTransitionStart,
			dummyOnTransitionEnd: dummyOnTransitionEnd
		};
		this._animateVisibility(animateHideRemoveStyle);
	}

	_animateRemove() {
		const thisOnTransitionStart = () => {
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-remove-start',
				{ bubbles: true, composed: false }
			));
		}
		const dummyOnTransitionEnd = () => {
			this.dummy.replaceWith(this);
			this.remove();
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-remove-end',
				{ bubbles: true, composed: false }
			));
		};
		this._animateHideRemove(thisOnTransitionStart, dummyOnTransitionEnd);
	}

	_animateShow() {
		this.style.display = this.displayOriginal;
		const dummyOnTransitionStart = () => {
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-show-start',
				{ bubbles: true, composed: false }
			));
		}
		const thisOnTransitionEnd = () => {
			this.dummy.replaceWith(this);
			// done visibility transition, element is in original, fully visible state, so return the original transition to this
			this.style.transition = this.transitionOriginal;
			this.dispatchEvent(new CustomEvent(
				'd2l-visibility-mixin-show-end',
				{ bubbles: true, composed: false }
			));
		};
		const animateShowStyle = {
			initial: {
				transition: `all ${transitionDuration}ms ease ${transitionDuration / 3}ms`,
				opacity: '0',
				transform: `translateY(-${moveYValue}px)`
			},
			initialDummy: {
				transition: `height ${transitionDuration}ms ease`,
				height: '0'
			},
			final: {
				opacity: `${this.opacityOriginal}`,
				transform: `${this.transformOriginal}`
			},
			finalDummy: {
				height: `calc(${this.scrollHeight}px + ${window.getComputedStyle(this).marginTop} + ${window.getComputedStyle(this).marginBottom})`
			},
			dummyOnTransitionStart: dummyOnTransitionStart,
			thisOnTransitionEnd: thisOnTransitionEnd
		};

		this._animateVisibility(animateShowStyle);
	}

	async _animateVisibility(animateStyle) {
		if (!reduceMotion) {
			Object.assign(this.style, animateStyle.initial);
			Object.assign(this.dummy.style, animateStyle.initialDummy);

			// we are in the middle of an earlier transition
			if (document.body.contains(this.dummy)) {
				// preserve the current opacity & transform for when we switch directions of transition
				this.style.opacity = window.getComputedStyle(this).opacity;
				this.style.transform = window.getComputedStyle(this).transform;

				// preserve the current dummy height for when we switch directions of transition
				this.dummy.style.height = window.getComputedStyle(this.dummy).height;
				this.dummy.replaceWith(this);
			}
			this.replaceWith(this.dummy);
			this.dummy.appendChild(this);

			// allow enough time for reflow to occur to ensure that the transition properly runs
			await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

			this.ontransitionstart = (event) => {
				if (event.target === this && event.propertyName === 'opacity') {
					if (animateStyle.thisOnTransitionStart) {
						animateStyle.thisOnTransitionStart();
					}
				}
			};

			this.dummy.ontransitionstart = (event) => {
				if (event.target === this.dummy) {
					if (animateStyle.dummyOnTransitionStart) {
						animateStyle.dummyOnTransitionStart();
					}
				}
			};

			this.ontransitionend = (event) => {
				if (event.target === this && event.propertyName === 'opacity') {
					if (animateStyle.thisOnTransitionEnd) {
						animateStyle.thisOnTransitionEnd();
					}
				}
			};

			this.dummy.ontransitionend = (event) => {
				if (event.target === this.dummy) {
					if (animateStyle.dummyOnTransitionEnd) {
						animateStyle.dummyOnTransitionEnd();
					}
				}
			};

			Object.assign(this.dummy.style, animateStyle.finalDummy);
			Object.assign(this.style, animateStyle.final);
		}

		if (animateStyle.thisOnTransitionEnd && reduceMotion) {
			animateStyle.thisOnTransitionEnd();
		}

		if (animateStyle.dummyOnTransitionEnd && reduceMotion) {
			animateStyle.dummyOnTransitionEnd();
		}
	}
});
