import { css } from 'lit';

// Styles for support for older empty-state action components
export const emptyStateStyles = css`
	.action-slot::slotted(d2l-empty-state-action-button:first-of-type),
	.action-slot::slotted(d2l-empty-state-action-link:first-of-type) {
		display: inline;
	}
`;
