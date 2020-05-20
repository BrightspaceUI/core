import { findFormElements, getFormElementData, installSubmitBehavior, submitFormData, uninstallSubmitBehavior } from './form-helpers.js';
import { ValidationGroupBehavior } from './validation-group-behavior.js';

const behaviors = new WeakMap();

export const formInstall = (domNode) => {
	if (behaviors.has(domNode)) {
		return;
	}
	const behavior = new FormBehavior();
	behavior.install(domNode);
	behaviors.set(domNode, behavior);
	return behavior;
};

export const formUninstall = (domNode) => {
	const behavior = behaviors.get(domNode);
	if (behavior === undefined) {
		return;
	}
	behavior.uninstall();
	behaviors.delete(domNode);
};

class FormBehavior {

	constructor() {
		this._validationGroup = new ValidationGroupBehavior();
		this._mutationObserver = new MutationObserver(this._onMutation);
		this._onMutation = this._onMutation.bind(this);
		this._onSubmit = this._onSubmit.bind(this);
		this._onSubmitClicked = this._onSubmitClicked.bind(this);
	}

	install(form) {
		this._mutationObserver.observe(form, { childList: true, subtree: true, attributes: false });

		const formElements = findFormElements(form);
		for (const ele of formElements) {
			installSubmitBehavior(ele, this._onSubmitClicked);
		}
		form.addEventListener('submit', this._onSubmit);
		this._validationGroup.install(form);
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
		this._validationGroup.uninstall();
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

		if (!this._validationGroup.reportValidity()) {
			return;
		}

		const formElements = findFormElements(this._form);

		const formData = new FormData();
		for (const ele of formElements) {
			const eleData = getFormElementData(ele);
			for (const pair of eleData) {
				formData.append(pair[0], pair[1]);
			}
		}
		submitFormData(this._form.method, this._form.location, formData);
	}

}

