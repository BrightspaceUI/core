import { dedupeMixin } from '@open-wc/dedupe-mixin';

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

	updated(changedProperties) {
		changedProperties.forEach((_, propName) => {
			if (propName === 'animate') {
				if (this.animate === 'show') {
					this._animateShow();
				} else if (this.animate === 'hide') {
					this._animateHide();
				}
			}
		});
	}

	_animateShow() {
		this.style.display = 'block' // need to get original display style here
		const visibilityStyle = {
			transition: 'all ' + transitionDuration + 'ms ease ' + transitionDuration / 3 + 'ms',
			opacity: '0',
			transform: 'translateY(-10px)'
		}

		const dummyStyle = {
			transition: 'height ' + transitionDuration + 'ms ease',
			height: '0px',
			overflow: 'hidden'
		}

		Object.assign(this.style, visibilityStyle);

		const dummy = document.createElement('div');
		Object.assign(dummy.style, dummyStyle);
		this.replaceWith(dummy);
		dummy.appendChild(this);

		dummy.style.height = this.scrollHeight + 'px';
		this.style.opacity = '1';
		this.style.transform = 'translateY(0px)';

		dummy.ontransitionend = () => {
			dummy.replaceWith(this);
		};
	}

	_animateHide() {
		const visibilityStyle = {
			transition: 'all ' + transitionDuration + 'ms ease',
			opacity: '1',
			transform: 'translateY(0px)'
		}

		const dummyStyle = {
			transition: 'height ' + transitionDuration + 'ms ease ' + transitionDuration / 3 + 'ms',
			height: this.scrollHeight + 'px',
			overflow: 'hidden'
		}

		Object.assign(this.style, visibilityStyle);

		const dummy = document.createElement('div');
		Object.assign(dummy.style, dummyStyle);
		this.replaceWith(dummy);
		dummy.appendChild(this);

		// console.log(this.scrollHeight);

		dummy.style.height = '0px';
		this.style.opacity = '0';
		this.style.transform = 'translateY(-10px)';

		dummy.ontransitionend = () => {
			dummy.replaceWith(this);
		};

		this.ontransitionend = () => {
			this.style.display = 'none';
		}
	}
});
