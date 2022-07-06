import { html } from 'lit';
import { loadSvg } from '../../generated/empty-state/presetIllustrationLoader.js';
import { unsafeSVG } from 'lit/directives/unsafe-svg.js';

function fixSvg(svgStr) {

	if (svgStr === undefined) {
		return undefined;
	}

	const template = document.createElement('template');
	template.innerHTML = svgStr;

	return html`${unsafeSVG(template.innerHTML)}`;

}

export async function getIllustration(illustration) {

	if (illustration) {
		const svg = await loadSvg(illustration);
		return fixSvg(svg ? svg.val : undefined);
	}

}
