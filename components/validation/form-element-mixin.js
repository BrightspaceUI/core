export const FormElementMixin = superclass => class extends superclass {

	static get properties() {
		return {
			_value: { type: Object }
		};
	}

	static formAssociated = true;

	formAssociatedCallback(form) {
		this.__form = form;
		if (this._value) {
			this.__form.setFormValue(this, this._value);
		}
	}

	setFormValue(val) {
		this._value = val;
		if (this.__form) {
			this.__form.setFormValue(this, val);
		}
	}

	get name() {
		return this.getAttribute('name');
	}

};
