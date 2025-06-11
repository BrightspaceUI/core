import { set } from './template-tags.js';
import { unsafeCSS } from 'lit';

export const overflowHiddenDeclarations = getOverflowDeclarations({});
export const overflowEllipsisDeclarations = getOverflowDeclarations({ textOverflow: 'ellipsis' });

export function getOverflowDeclarations({ textOverflow = '', lines = 0, lit = true } = {}) {
	if (!arguments.length) return overflowHiddenDeclarations;

	const declarations = set`
		min-width: 0; /* clamps width of flex items */
		overflow-x: clip;
		${lines
			? set`
			display: -webkit-box;
			overflow-clip-margin: 0.2em;
			overflow-wrap: anywhere;
			overflow-y: clip;
			text-overflow: ${textOverflow || 'ellipsis'};
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
