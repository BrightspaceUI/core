import { emptyStateStyles } from './empty-state-styles.js';
import { StateSimple } from '../state/state-simple.js';

class EmptyStateSimple extends StateSimple {
	static styles = [super.styles, emptyStateStyles];
}

customElements.define('d2l-empty-state-simple', EmptyStateSimple);
