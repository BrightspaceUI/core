import '../button/button.js';
import '../icons/icon.js';
import { DropdownButtonMixin } from './dropdown-button-mixin.js';
import { DropdownHoverOpenerMixin } from './dropdown-hover-opener-mixin.js';
import { LitElement } from 'lit-element/lit-element.js';

/**
 * A "d2l-button" opener for dropdown content.
 * @slot - Dropdown content (e.g., "d2l-dropdown-content", "d2l-dropdown-menu" or "d2l-dropdown-tabs")
 */
class DropdownHoverButton extends DropdownButtonMixin(DropdownHoverOpenerMixin(LitElement)) {}
customElements.define('d2l-dropdown-hover-button', DropdownHoverButton);
