import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';
import { menuItemStyles } from './menu-item-styles.js';

export const menuItemSelectableStyles = [ menuItemStyles,
	css`
		:host {
			display: flex;
			padding: 0.75rem 1rem;
			align-items: center
		}

		:host > span {
			flex: auto;
			line-height: 1rem;
			overflow-x: hidden;
			overflow-y: hidden;
			text-decoration: none;
			text-overflow: ellipsis;
			white-space: nowrap;
		}

		:host(:hover),
		:host(:focus),
		:host(:hover) > d2l-icon,
		:host(:focus) > d2l-icon {
			color: var(--d2l-color-celestine-minus-1);
		}

		:host > d2l-icon {
			flex: none;
			visibility: hidden;
			margin-right: 0.8rem;
		}

		:host-context([dir="rtl"]) > d2l-icon {
			margin-left: 0.8rem;
			margin-right: 0;
		}

		:host(:dir(rtl)) > d2l-icon {
			margin-left: 0.8rem;
			margin-right: 0;
		}

		:host([aria-checked="true"]) > d2l-icon {
			visibility: visible;
		}
	`
];
