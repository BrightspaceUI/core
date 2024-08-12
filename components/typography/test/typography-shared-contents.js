import { html } from '@brightspace-ui/testing';

export const interferingStyleWrapper = (content) => {
	return html`<div style="color: red; font-size: 0.8rem; font-weight: bold; text-align: right; white-space: nowrap;">${content}</div>`;
};
