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
			const dummyStyle = {
				transition: 'height 300ms ease',
				height: '0px'
			}

			// add dummy element & change host to be absolute positioned (via CSS logics? but no lit element)
			const dummy = document.createElement('div');
			Object.assign(dummy.style, dummyStyle);
			this.parentElement.insertBefore(dummy, this.nextSibling);
			dummy.style.height = this.scrollHeight + 'px';
		}
	}
});
