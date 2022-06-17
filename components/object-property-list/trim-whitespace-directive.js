import { Directive, directive } from 'lit/directive.js';
import { noChange } from 'lit';
import { TrimWhitespaceEngine } from './trim-whitespace.js';

class NoChangeDirective extends Directive {
	render() { return noChange; }
}

class TrimWhitespaceDirective extends NoChangeDirective {
	constructor(part, deep) {
		super(part);
		const node = part.element || part.parentNode?.host || part.parentNode;

		this._trimWhitespaceEngine = new TrimWhitespaceEngine(node, deep);
		this._trimWhitespaceEngine.start();
	}
}

class TrimWhitespaceDeepDirective extends TrimWhitespaceDirective {
	constructor(part) {
		super(part, true);
	}
}

class NoTrim extends NoChangeDirective {
	constructor(part) {
		super(part);
		const node = part.element || part.parentNode;
		node.__d2l_no_trim = true;
	}
}

export const trimWhitespace = directive(TrimWhitespaceDirective);
export const trimWhitespaceDeep = directive(TrimWhitespaceDeepDirective);
export const noTrim = directive(NoTrim);
