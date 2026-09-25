import { emptyStateStyles } from './empty-state-styles.js';
import { StateIllustrated } from '../state/state-illustrated.js';

class EmptyStateIllustrated extends StateIllustrated {
	static styles = [ super.styles,emptyStateStyles ];
}

customElements.define('d2l-empty-state-illustrated', EmptyStateIllustrated);
