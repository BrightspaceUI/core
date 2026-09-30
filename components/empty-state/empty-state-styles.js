import { css } from 'lit';

// Styles supporting old empty state action buttons and links
export const emptyStateStyles = css`
	.action-slot::slotted(d2l-empty-state-action-button:first-of-type),
	.action-slot::slotted(d2l-empty-state-action-link:first-of-type) {
		display: inline;
	}
`;
