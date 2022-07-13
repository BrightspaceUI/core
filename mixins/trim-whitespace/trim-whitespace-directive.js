import { Directive, directive } from 'lit/directive.js';
import { noChange } from 'lit';
import { TrimWhitespaceCore } from './trim-whitespace-core.js';

class NoChangeDirective extends Directive {
	render() { return noChange; }
}

class TrimWhitespaceDirective extends NoChangeDirective {
	constructor(part, deep) {
		super(part);
		const node = part.element || part.parentNode?.host || part.parentNode;

		this._trimWhitespaceCore = new TrimWhitespaceCore(node, deep);
		this._trimWhitespaceCore.start();
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
