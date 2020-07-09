import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';
import { menuItemStyles } from './menu-item-styles.js';

export const menuItemSelectableStyles = [ menuItemStyles,
	css`
		:host {
			align-items: center;
			display: flex;
			padding: 0.75rem 1rem;

		}

		span {
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

		d2l-icon {
			flex: none;
			margin-right: 0.8rem;
			visibility: hidden;
		}

		:host([dir="rtl"]) > d2l-icon {
			margin-left: 0.8rem;
			margin-right: 0;
		}

		:host([aria-checked="true"]) > d2l-icon {
			visibility: visible;
		}
	`
];
