import { css } from 'lit';

export const toolbarMenuItemStyles = css`
	:host {
		--d2l-menu-item-lines: 1;
		align-items: center;
		border-radius: 3px;
		display: flex;
		gap: 12px;
		margin: 0;
		padding: 7px 12px;
		width: 100%;
	}
	:host([hidden]) {
		display: none;
	}
`;

export const toolbarMenuItemIconStyles = css`
	.item-icon-container {
		flex: none;
	}
	.item-icon-hidden {
		display: none;
	}
	:host(:hover) d2l-icon,
	:host(:focus-visible) d2l-icon,
	:host(:hover) ::slotted(d2l-icon-custom),
	:host(:focus-visible) ::slotted(d2l-icon-custom) {
		fill: var(--d2l-menu-foreground-color-hover);
	}
`;

export const toolbarMenuItemTextStyles = css`
	::slotted(p),
	::slotted(h1),
	::slotted(h2),
	::slotted(h3),
	::slotted(h4),
	::slotted(h5),
	::slotted(h6),
	::slotted(blockquote),
	::slotted(code) {
		margin: 0.2em 0 !important;
	}
`;
