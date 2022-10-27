import { SelectionHeader } from '../selection/selection-header.js';

/**
 * A header for list components containing select-all, etc.
 * @slot - Responsive container using `d2l-overflow-group` for `d2l-selection-action` elements
 */
class ListHeader extends SelectionHeader {}

customElements.define('d2l-list-header', ListHeader);
