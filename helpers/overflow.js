import { unsafeCSS } from 'lit';

const defaultOverflowDeclarations = getOverflowDeclarations({});

export function getOverflowDeclarations({ textOverflow = 'ellipsis', lines = 0, lit = true } = {}) {
	if (!arguments.length) return defaultOverflowDeclarations;

	const declarations = `
		min-width: 0; /* clamps width of flex items */
		overflow: visible;
		overflow-x: clip;
		${lines
		? `
	  	display: -webkit-box;
		overflow-clip-margin: 0.2em;
		overflow-y: clip;
		-webkit-box-orient: vertical;
  		-webkit-line-clamp: ${lines};`
    	: `
     	overflow-clip-margin: 1em;
    	text-overflow: ${textOverflow};
     	white-space: nowrap;`}
	`;
	return lit ? unsafeCSS(declarations) : declarations;
}
