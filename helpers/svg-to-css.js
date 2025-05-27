import { unsafeCSS } from 'lit';

export function svgToCSS(svg) {
	return unsafeCSS(`url("data:image/svg+xml;base64,${btoa(svg)}")`);
}
