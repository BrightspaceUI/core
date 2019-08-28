import { css, html, LitElement } from 'lit-element/lit-element.js';
import { bodySmallStyles } from '../../typography/styles.js';

class ListDemoControl extends LitElement {
	static get properties() {
		return {
			target: { type: String }
		};
	}

	static get styles() {
		return [ bodySmallStyles, css`
		.d2l-list-demo-flex {
			background: white;
			border: 1px solid var(--d2l-color-tungsten);
			border-bottom: none;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
			box-sizing: content-box;
			display: flex;
			justify-content: flex-start;
			margin: 0 !important;
			margin-left: 6px !important;
			max-width: 894px;
			width: fit-content;
		}
		.d2l-list-demo-flex > *:last-child {
			border-right: none;
		}
		.d2l-list-demo-flex > * {
			border-right: 1px dotted var(--d2l-color-tungsten);
			padding: 0 18px;
		}
		`];
	}

	render() {
		return html`
			<div class="d2l-body-small d2l-list-demo-flex">
				<label>
					divider-mode:
					<select @change="${this._onChangeDividerMode}">
						<option value="" selected>default (all)</option>
						<option value="none">none</option>
						<option value="between">between</option>
						<option value="all">all</option>
					</select>
				</label>
				<label>divider-extend: <input type="checkbox" @change="${this._onChangeDividerExtend}"></label>
				<label>
					breakpoints:
					<select @change="${this._onChangeBreakpoints}">
						<option value="1200">3</option>
						<option value="800" selected>2</option>
						<option value="600">1</option>
						<option value="400">0</option>
						</select>
				</label>
				<label>illustration-outside: <input type="checkbox" @change="${this._onChangeIllustrationOutside}"></label>
			</div>
		`;
	}

	_onChangeBreakpoints(event) {
		const demoSnippet = document.querySelector(this.target);
		const list = document.querySelector(`${this.target} d2l-list`);
		const fixedMaxWidth = 900;
		if (event.target.value > fixedMaxWidth) {
			demoSnippet.style.maxWidth = `${event.target.value}px`;
		} else {
			demoSnippet.style.maxWidth = `${fixedMaxWidth}px`;
		}
		list.style.maxWidth = `${event.target.value}px`;
	}

	_onChangeDividerExtend(event) {
		const list = document.querySelector(`${this.target} d2l-list`);
		list.toggleAttribute('divider-extend', event.target.checked);
	}

	_onChangeDividerMode(event) {
		const list = document.querySelector(`${this.target} d2l-list`);
		list.setAttribute('divider-mode', event.target.value);
	}

	_onChangeIllustrationOutside(event) {
		const listItems = document.querySelectorAll(`${this.target} d2l-list d2l-list-item`);
		listItems.forEach(item => {
			item.toggleAttribute('illustration-outside', event.target.checked);
		});
	}
}

customElements.define('d2l-list-demo-control', ListDemoControl);
