import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const dialogStyles = css`

	:host {
		display: none;
	}

	:host([opened]), :host([_state="showing"]), :host([_state="hiding"]) {
		display: block;
	}

	.d2l-dialog {
		background-color: white;
		border: 1px solid var(--d2l-color-mica);
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		overflow: hidden;
		top: 100px;
		transform: translateY(-50px);
		transition: transform 200ms ease-in;
	}

	div.d2l-dialog {
		left: 0;
		margin: auto;
		position: fixed;
		right: 0;
		width: 300px;
		z-index: 1000;
	}

	dialog.d2l-dialog {
		color: var(--d2l-color-ferrite);
		padding: 0;
	}

	:host([_state="showing"]) .d2l-dialog {
		transform: translateY(0);
	}

	.d2l-dialog-inner {
		display: flex;
		flex-direction: column;
	}

	.d2l-dialog-header {
		display: flex;
		flex: 0;
		padding: 19px 30px 23px 30px;
	}

	.d2l-dialog-header > h2 {
		flex: 1;
		margin: 0;
	}

	.d2l-dialog-header > d2l-button-icon {
		flex: 0;
		margin: -4px -15px 0 15px;
	}

	.d2l-dialog-content {
		flex: 1;
		padding: 0 30px;
		overflow: auto;
	}

	.d2l-dialog-footer {
		flex: 0;
		padding: 30px;
	}

`;
