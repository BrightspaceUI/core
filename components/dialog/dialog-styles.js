import '../colors/colors.js';
import { css } from 'lit-element/lit-element.js';

export const dialogStyles = css`

	:host {
		display: none;
	}

	:host([opened]), :host([_state="showing"]), :host([_state="hiding"]) {
		display: block;
	}

	.d2l-dialog-outer {
		background-color: white;
		border: 1px solid var(--d2l-color-mica);
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		box-sizing: content-box;
		position: fixed; /* also required for native to override position: absolute */
		top: 100px;
		transform: translateY(-50px);
		transition: transform 200ms ease-in;
	}

	[nested-showing].d2l-dialog-outer {
		border-color: rgba(205, 213, 220, 0.35);
		box-shadow: none;
	}

	div.d2l-dialog-outer {
		left: 0;
		margin: auto;
		right: 0;
		width: 300px;
		z-index: 1000;
	}

	div[nested].d2l-dialog-outer {
		top: 0;
	}

	dialog.d2l-dialog-outer {
		color: var(--d2l-color-ferrite);
		padding: 0;
	}

	dialog::backdrop {
		/* cannot use variables inside of ::backdrop : https://github.com/whatwg/fullscreen/issues/124 */
		background-color: #f9fbff;
		opacity: 0;
		transition: opacity 200ms ease-in;
	}

	:host([_state="showing"]) > .d2l-dialog-outer {
		/* must target direct child to avoid ancestor from interfering with closing child dialogs in Edge/IE11 */
		transform: translateY(0);
	}

	:host([_state="showing"]) dialog::backdrop {
		opacity: 0.7;
	}

	.d2l-dialog-inner {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.d2l-dialog-header {
		box-sizing: border-box;
		flex: none;
		padding: 19px 30px 23px 30px;
	}

	[overflow-top] .d2l-dialog-header {
		box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.05);
	}

	.d2l-dialog-header > div {
		display: flex;
	}

	.d2l-dialog-header > div > h2 {
		flex: 1 0 0px;
		margin: 0;
	}

	.d2l-dialog-content {
		box-sizing: border-box;
		flex: 1 0 0px;
		padding: 0 30px;
		overflow: auto;
	}

	.d2l-dialog-content > div {
		/* required to properly calculate preferred height when there are bottom
		margins at the end of the slotted content */
		border-bottom: 1px solid transparent;
	}

	.d2l-dialog-footer {
		box-sizing: border-box;
		flex: none;
		padding: 30px;
	}

	[overflow-bottom] .d2l-dialog-footer {
		box-shadow: 0 -3px 3px 0 rgba(0, 0, 0, 0.05);
	}

	.d2l-dialog-footer ::slotted(*) {
		margin-right: 18px;
	}

	:host([dir="rtl"]) .d2l-dialog-footer ::slotted(*) {
		margin-left: 18px;
		margin-right: 0;
	}

	@media (max-width: 615px) {

		.d2l-dialog-header {
			padding: 14px 20px 16px 20px;
		}

		.d2l-dialog-content {
			padding: 0 20px;
		}

		.d2l-dialog-footer {
			padding: 20px;
		}

	}

`;
