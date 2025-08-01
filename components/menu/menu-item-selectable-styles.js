import { css } from 'lit';
import { menuItemStyles } from './menu-item-styles.js';

export const menuItemSelectableStyles = [ menuItemStyles,
	css`
		:host {
			align-items: center;
			display: flex;
			padding: 0.75rem 1rem;
		}

		.d2l-menu-item-text {
			text-decoration: none;
		}

		d2l-icon {
			flex: none;
			margin-inline-end: 0.8rem;
			visibility: hidden;
		}

		:host([aria-checked="true"]) > d2l-icon {
			visibility: visible;
		}
	`
];
