import { dedupeMixin } from '@open-wc/dedupe-mixin';

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
				this._animateChanged(this.animate);
			}
		});
	}

	_animateChanged(animate) {
		if (animate === 'show') {
			const transitionDuration = 300;

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
	}
});
