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

		.d2l-menu-item-text {
			text-decoration: none;
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
