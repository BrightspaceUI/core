const keyCodes = Object.freeze({
	END: 35,
	HOME: 36,
	LEFT: 37,
	UP: 38,
	RIGHT: 39,
	DOWN: 40
});

export class FocusableArrowKeysHelper {
	constructor({
		container,
		onBeforeFocus,
		focusablesProvider,
		direction = 'leftright',
		noWrap = 'false'
	}) {
		this.container = container;
		this.onBeforeFocus = onBeforeFocus;
		this.focusablesProvider = focusablesProvider;
		this.direction = direction;
		this.noWrap = noWrap;
		this.element = undefined;
	}

	registerKeyDownHandler(element) {
		this.element = element;
		this._handleKeyDown = this._handleKeyDown.bind(this);
		element.addEventListener('keydown', this._handleKeyDown);
	}

	cleanup() {
		if (this.element) {
			this.element.removeEventListener('keydown', this._handleKeyDown);
			this.element = undefined;
		}
	}

	_focus(elem) {
		if (elem) {
			if (this.onBeforeFocus) {
				this.onBeforeFocus(elem).then(() => {
					elem.focus();
				});
			} else {
				elem.focus();
			}
		}
	}

	_focusFirst() {
		if (!this.focusablesProvider) {
			Promise.reject('No focusables provider.');
		}
		return this.focusablesProvider().then(
			(elems) => {
				if (elems && elems.length > 0) {
					this._focus(elems[0]);
				}
			}
		);
	}

	_focusLast() {
		if (!this.focusablesProvider) {
			Promise.reject('No focusables provider.');
		}
		return this.focusablesProvider().then(
			(elems) => {
				if (elems && elems.length > 0) {
					this._focus(elems[elems.length - 1]);
				}
			}
		);
	}

	_focusNext(elem) {
		if (!this.focusablesProvider) {
			Promise.reject('No focusables provider.');
		}
		return this.focusablesProvider().then(
			(elems) => {
				const next = this._tryGetNextFocusable(elems, elem);
				this._focus(next);
			}
		);
	}

	_focusPrevious(elem) {
		if (!this.focusablesProvider) {
			Promise.reject('No focusables provider.');
		}
		return this.focusablesProvider().then(
			(elems) => {
				const previous = this._tryGetPreviousFocusable(elems, elem);
				this._focus(previous);
			}
		);
	}

	_handlecontainer(newElem, oldElem) {
		if (oldElem) {
			oldElem.removeEventListener('keydown', this._handleKeyDown);
		}
		if (!newElem) {
			return;
		}
		newElem.addEventListener('keydown', this._handleKeyDown);
	}

	_handleKeyDown(e) {
		const target = e.target;
		if (this.direction.indexOf('left') >= 0 && e.keyCode === keyCodes.LEFT) {
			if (getComputedStyle(this.element).direction === 'rtl') {
				this._focusNext(target);
			} else {
				this._focusPrevious(target);
			}
		} else if (this.direction.indexOf('right') >= 0 && e.keyCode === keyCodes.RIGHT) {
			if (getComputedStyle(this.element).direction === 'rtl') {
				this._focusPrevious(target);
			} else {
				this._focusNext(target);
			}
		} else if (this.direction.indexOf('up') >= 0 && e.keyCode === keyCodes.UP) {
			this._focusPrevious(target);
		} else if (this.direction.indexOf('down') >= 0 && e.keyCode === keyCodes.DOWN) {
			this._focusNext(target);
		} else if (e.keyCode === keyCodes.HOME) {
			this._focusFirst();
		} else if (e.keyCode === keyCodes.END) {
			this._focusLast();
		} else {
			return;
		}
		e.preventDefault();
	}

	_tryGetNextFocusable(elems, elem) {
		if (!elems || elems.length === 0) {
			return;
		}
		const index = elems.indexOf(elem);
		if (index === elems.length - 1) {
			if (this.noWrap) {
				return;
			}
			return elems[0];
		}
		return elems[index + 1];
	}

	_tryGetPreviousFocusable(elems, elem) {
		if (!elems || elems.length === 0) {
			return;
		}
		const index = elems.indexOf(elem);
		if (index === 0) {
			if (this.noWrap) {
				return;
			}
			return elems[elems.length - 1];
		}
		return elems[index - 1];
	}
}
