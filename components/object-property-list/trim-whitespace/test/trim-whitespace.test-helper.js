import { css, html, LitElement, nothing } from 'lit';
import { noTrim, trimWhitespace, trimWhitespaceDeep } from '../trim-whitespace-directive.js';
import { TrimWhitespaceMixin } from '../trim-whitespace-mixin.js';

class WhitespaceTester extends LitElement {
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
		`;
	}
}

class WhitespaceMixinTester extends TrimWhitespaceMixin(WhitespaceTester) {}

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

class NestedTester extends LitElement {
	static get properties() {
		return { spanText: { type: String, attribute: 'span-text' } };
	}

	render() {
		return html`|
			<span> ${this.spanText} </span>
			|
			<slot></slot>
		|`;
	}
}

class NoTrimTester extends LitElement {
	render() {
		return html`${noTrim()}
			(B1 No Trim B1)
		|`;
	}
}

class WhitespaceTesterRunner extends LitElement {
	static get properties() {
		return {
			spanText: { type: String, attribute: 'span-text' },
			enableSpanContent: { type: Boolean, attribute: 'enable-span-content' },
			enableSpanElement: { type: Boolean, attribute: 'enable-span-element' }, // First three are caught by update()
			slottedText: { type: String, attribute: 'slotted-text' }, // This isn't caught by update or slotchange!
			enableSlottedElement: { type: Boolean, attribute: 'enable-slotted-element' }, // This is caught by slotchange
			trimWhitespaceDeep: { type: Boolean, attribute: 'trim-whitespace-deep' },
			testType: { type: String, attribute: 'test-type' },
		};
	}

	render() {
		if (this.testType === 'mixin') return html`
			<whitespace-mixin-tester
				span-text="${this.spanText}"
				?enable-span-content="${this.enableSpanContent}"
				?enable-span-element="${this.enableSpanElement}"
				?trim-whitespace-deep="${this.trimWhitespaceDeep}"
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

	_getContents() {
		return html`
			${this.enableSlottedElement ? html`<span> (4 Slotted Element 4) </span>` : nothing}
			<span> ${this.slottedText} </span>
			<nested-tester span-text=" (A1 Nested Span Text A1) ">
				<span> (A2 Nested Slotted Element A2) </span>
			</nested-tester>
			<no-trim-tester></no-trim-tester>
		`;
	}
}

customElements.define('whitespace-tester', WhitespaceTester);
customElements.define('whitespace-mixin-tester', WhitespaceMixinTester);
customElements.define('whitespace-directive-tester', WhitespaceDirectiveTester);
customElements.define('whitespace-directive-deep-tester', WhitespaceDirectiveDeepTester);
customElements.define('nested-tester', NestedTester);
customElements.define('no-trim-tester', NoTrimTester);
customElements.define('whitespace-tester-runner', WhitespaceTesterRunner);
