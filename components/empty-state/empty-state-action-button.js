import { StateActionButton } from '../state/state-action-button.js';

class EmptyStateActionButton extends StateActionButton {
	_handleActionClick(e) {
		e.stopPropagation();
		this.dispatchEvent(new CustomEvent('d2l-empty-state-action'));
	}
}

customElements.define('d2l-empty-state-action-button', EmptyStateActionButton);
