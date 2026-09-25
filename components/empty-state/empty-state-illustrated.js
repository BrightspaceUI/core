import { StateIllustrated } from '../state/state-illustrated.js';
import { emptyStateStyles } from './empty-state-styles.js';
class EmptyStateIllustrated extends StateIllustrated {
	static styles = [super.styles, emptyStateStyles];
}

customElements.define('d2l-empty-state-illustrated', EmptyStateIllustrated);
