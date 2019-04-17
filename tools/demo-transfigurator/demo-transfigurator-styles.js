import { css } from 'lit-element/lit-element.js';

export const demoTransfiguratorStyles = css`
	:host {
		border: 1px solid #72777a;
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
		display: block;
		max-width: 900px;
	}
	:host([hidden]) {
		display: none;
	}
	:host .demo-transfigurator-demo {
		padding: 18px;
	}
	:host([no-padding]) .demo-transfigurator-demo {
		padding: 0;
	}
	:host .demo-transfigurator-code {
		font-size: 14px;
	}
	pre[class*="language-"] {
		border-radius: 5px;
		margin: 0;
		padding: 18px;
	}
`;
