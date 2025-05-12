import { unsafeCSS } from 'lit';

export const overflowHiddenDeclarations = getOverflowDeclarations({});
export const overflowEllipsisDeclarations = getOverflowDeclarations({ textOverflow: 'ellipsis' });

export function getOverflowDeclarations({ textOverflow = '', lines = 0, lit = true } = {}) {
	if (!arguments.length) return overflowHiddenDeclarations;

	const declarations = `
		min-width: 0; /* clamps width of flex items */
		overflow-x: clip;
		${lines
			? `
		  	display: -webkit-box;
			overflow-clip-margin: 0.2em;
			overflow-wrap: anywhere;
			overflow-y: clip;
			-webkit-box-orient: vertical;
	  		-webkit-line-clamp: ${lines};
	    	text-overflow: ${textOverflow || 'ellipsis'};`
			: `
     		overflow-clip-margin: 1em;
    		${textOverflow
				? `
		     	overflow-y: visible;
		     	text-overflow: ${textOverflow};
		      	white-space: nowrap;`
				: `
	       		overflow-y: clip;`}
      	`};
	`;
	return lit ? unsafeCSS(declarations) : declarations;
}
