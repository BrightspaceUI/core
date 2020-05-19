import { findFormElements, getFormElementData, installSubmitBehavior, submitFormData, uninstallSubmitBehavior } from './form-helpers.js';

export class FormBehavior {

	constructor() {
		this._mutationObserver = new MutationObserver(this._onMutation);
		this._onMutation = this._onMutation.bind(this);
		this._onSubmit = this._onSubmit.bind(this);
		this._onSubmitClicked = this._onSubmitClicked.bind(this);
	}

	install(form) {
		console.log('install');
		console.log(form);
		this._mutationObserver.observe(form, { childList: true, subtree: true, attributes: false });
		const formElements = findFormElements(form);
		for (const ele of formElements) {
			installSubmitBehavior(ele, this._onSubmitClicked);
		}
		form.addEventListener('submit', this._onSubmit);
		this._form = form;
	}

	submit() {
		this._submit();
	}

	uninstall() {
		this._mutationObserver.disconnect();
		const formElements = findFormElements(this._form);
		for (const ele of formElements) {
			uninstallSubmitBehavior(ele, this._onSubmitClicked);
		}
		this._form.removeEventListener('submit', this._onSubmit);
		this._form = null;
	}

	_onMutation(mutationsList) {
		for (const mutation of mutationsList) {
			if (mutation.type === 'childList') {
				for (const node of mutation.removedNodes) {
					uninstallSubmitBehavior(node, this._onSubmitClicked);
				}
				for (const node of mutation.addedNodes) {
					installSubmitBehavior(node, this._onSubmitClicked);
				}
			}
		}
	}

	_onSubmit(e) {
		e.preventDefault();
		this._submit();
	}

	_onSubmitClicked(e) {
		this._submit(e.target);
	}

	_submit() {

		const formElements = findFormElements(this._form);

		const errors = [];
		const formData = new FormData();
		for (const ele of formElements) {
			if (ele.checkValidity()) {
				const eleData = getFormElementData(ele);
				for (const pair of eleData) {
					formData.append(pair[0], pair[1]);
				}
			} else {
				errors.push({ ele, message: ele.validationMessage });
			}
		}
		if (errors.length !== 0) {
			console.log(errors);
			return;
		}
		submitFormData(this._form.method, this._form.location, formData);
	}

}

