import { css, html, LitElement, nothing } from 'lit';
import { noTrim, trimWhitespace, trimWhitespaceDeep } from '../trim-whitespace-directive.js';
import { TrimWhitespaceMixin } from '../trim-whitespace-mixin.js';

const GetTextMixin = superclass => class extends superclass {
	getText() {
		const filterNodeList = nodes => [...nodes].filter(node => [1, 3].includes(node.nodeType) && node.nodeName !== 'STYLE');
		const shadowNodes = filterNodeList(this.shadowRoot.childNodes);
		const childNodes = filterNodeList(this.childNodes);

		const slotNodes = childNodes.reduce((acc, node) => {
			if (node.assignedSlot) acc.set(node.assignedSlot, [...(acc.get(node.assignedSlot) || []), node]);
			return acc;
		}, new Map());

		slotNodes.forEach((nodes, slot) => {
			if (shadowNodes.indexOf(slot) < 0) return;
			shadowNodes.splice(shadowNodes.indexOf(slot), 1, ...nodes);
		});

		return shadowNodes.map(node => (node.getText ? node.getText() : node.textContent)).join('');
	}
};

class WhitespaceTester extends GetTextMixin(LitElement) {
	static get properties() {
		return {
			spanText: { type: String, attribute: 'span-text' },
			enableSpanContent: { type: Boolean, attribute: 'enable-span-content' },
			enableSpanElement: { type: Boolean, attribute: 'enable-span-element' },
		};
	}

	static get styles() {
		return css`:host { display: block; }`;
	}

	render() {
		return html`|
			<span> ${this.spanText} </span>
			|
			<span> ${this.enableSpanContent ? ' (2 Span Content 2) ' : nothing} </span>
			|
			${this.enableSpanElement ? html`<span> (3 Span Element 3) </span>` : nothing}
			|
			<slot></slot>
		|`;
	}
}

class WhitespaceMixinTester extends TrimWhitespaceMixin(WhitespaceTester) {}

class WhitespaceMixinDeepTester extends TrimWhitespaceMixin(WhitespaceTester) {
	static get trimWhitespaceDeep() {
		return true;
	}
}

class WhitespaceDirectiveTester extends WhitespaceTester {
	render() {
		return html`
			${trimWhitespace()}
			${super.render()}
		`;
	}
}

class WhitespaceDirectiveDeepTester extends WhitespaceTester {
	render() {
		return html`
			${trimWhitespaceDeep()}
			${super.render()}
		`;
	}
}

class NestedTester extends GetTextMixin(LitElement) {
	static get properties() {
		return { spanText: { type: String, attribute: 'span-text' } };
	}

	render() {
		return html`|<span> ${this.spanText} </span>|<slot></slot>`;
	}
}

class NoTrimTester extends GetTextMixin(LitElement) {
	render() {
		return html`|
			<span ${noTrim()}> (B1 No Trim B1) </span>
			|
			<span> (B2 Yes Trim B2) </span>
		`;
	}
}

class WhitespaceTesterRunner extends GetTextMixin(LitElement) {
	static get properties() {
		return {
			spanText: { type: String, attribute: 'span-text' },
			enableSpanContent: { type: Boolean, attribute: 'enable-span-content' },
			enableSpanElement: { type: Boolean, attribute: 'enable-span-element' }, // First three are caught by update()
			slottedText: { type: String, attribute: 'slotted-text' }, // This isn't caught by update or slotchange!
			enableSlottedElement: { type: Boolean, attribute: 'enable-slotted-element' }, // This is caught by slotchange
			enableNested: { type: Boolean, attribute: 'enable-nested' },
			enableNoTrim: { type: Boolean, attribute: 'enable-no-trim' },
			trimWhitespaceDeep: { type: Boolean, attribute: 'trim-whitespace-deep' },
			testType: { type: String, attribute: 'test-type' },
		};
	}

	render() {
		if (this.testType === 'untrimmed' || !this.testType) return html`
			<whitespace-tester
				span-text="${this.spanText}"
				?enable-span-content="${this.enableSpanContent}"
				?enable-span-element="${this.enableSpanElement}"
				?trim-whitespace-deep="${this.trimWhitespaceDeep}"
			>${this._getContents()}</whitespace-tester>
		`;
		if (this.testType === 'mixin' && this.trimWhitespaceDeep) return html`
			<whitespace-mixin-deep-tester
				span-text="${this.spanText}"
				?enable-span-content="${this.enableSpanContent}"
				?enable-span-element="${this.enableSpanElement}"
			>${this._getContents()}</whitespace-mixin-deep-tester>
		`;
		if (this.testType === 'mixin') return html`
			<whitespace-mixin-tester
				span-text="${this.spanText}"
				?enable-span-content="${this.enableSpanContent}"
				?enable-span-element="${this.enableSpanElement}"
			>${this._getContents()}</whitespace-mixin-tester>
		`;
		if (this.trimWhitespaceDeep) return html`
			<whitespace-directive-deep-tester
				span-text="${this.spanText}"
				?enable-span-content="${this.enableSpanContent}"
				?enable-span-element="${this.enableSpanElement}"
			>${this._getContents()}</whitespace-directive-deep-tester>
		`;
		return html`
			<whitespace-directive-tester
				span-text="${this.spanText}"
				?enable-span-content="${this.enableSpanContent}"
				?enable-span-element="${this.enableSpanElement}"
			>${this._getContents()}</whitespace-directive-tester>
		`;
	}

	getText() {
		return this.shadowRoot.children[0].getText();
	}

	_getContents() {
		return html`
			<span> ${this.slottedText} </span>
			|
			${this.enableSlottedElement ? html`<span> (5 Slotted Element 5) </span>` : nothing}
			${this.enableNested ? html`<nested-tester span-text=" (A1 Nested Span Text A1) ">
				<span> (A2 Nested Slotted Element A2) </span>
			</nested-tester>` : nothing}
			${this.enableNoTrim ?  html`|
				<span ${noTrim()}> (B1 No Trim B1) </span> | <span> (B2 Yes Trim B2) </span>
			` : nothing}
		`;
	}
}

customElements.define('whitespace-tester', WhitespaceTester);
customElements.define('whitespace-mixin-tester', WhitespaceMixinTester);
customElements.define('whitespace-mixin-deep-tester', WhitespaceMixinDeepTester);
customElements.define('whitespace-directive-tester', WhitespaceDirectiveTester);
customElements.define('whitespace-directive-deep-tester', WhitespaceDirectiveDeepTester);
customElements.define('nested-tester', NestedTester);
customElements.define('no-trim-tester', NoTrimTester);
customElements.define('whitespace-tester-runner', WhitespaceTesterRunner);
