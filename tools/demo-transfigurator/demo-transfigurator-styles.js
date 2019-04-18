import { css } from 'lit-element/lit-element.js';

export const demoTransfiguratorStyles = css`
	:host {
		border: 1px solid #72777a;
		border-radius: 6px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
		display: block;
		max-width: 900px;
		position: relative;
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
	:host .demo-transfigurator-actions {
		background-color: #f2f3f5;
		border-bottom: 1px solid #72777a;
		border-left: 1px solid #72777a;
		border-bottom-left-radius: 6px;
		border-top-right-radius: 5px;
		display: inline-block;
		line-height: 0;
		padding: 6px;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 1;
	}
	:host .demo-transfigurator-actions button {
		cursor: pointer;
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
