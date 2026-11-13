import { set } from './template-tags.js';
import { unsafeCSS } from 'lit';

export const overflowHiddenDeclarations = getOverflowDeclarations({ lines: 0 });
export const overflowEllipsisDeclarations = getOverflowDeclarations({ textOverflow: 'ellipsis', lines: 0 });

export function getOverflowDeclarations({ textOverflow = '', lines = 1, lit = true } = {}) {
	if (!arguments.length) return overflowHiddenDeclarations;
	if (arguments[0].lines === 1) return overflowEllipsisDeclarations;

	const declarations = set`
		min-width: 0; /* clamps width of flex items */
		overflow-x: clip;
		${lines > 1 || lines.constructor === String
			? set`
			display: -webkit-box;
			overflow-clip-margin: 0.2em;
			overflow-wrap: anywhere;
			overflow-y: clip;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: ${lines};`
			: set`
			overflow-clip-margin: 1em;
			${textOverflow
				? set`
				overflow-y: visible;
				text-overflow: ${textOverflow};
				white-space: nowrap;`
				:
				'overflow-y: clip;'}
		`}
	`;
	return lit ? unsafeCSS(declarations) : declarations;
}
