import { html, render } from 'lit';
import { findComposedAncestor } from '../helpers/dom.js';
import { tryGetPluginByKey } from '@brightspace-ui/core/helpers/plugins.js';

class RenderNode {
	#childNodes;
	#node;

	constructor(node) {
		this.#node = node;
		this.#childNodes = [];
	}

	addChildNode(childNode) {
		this.#childNodes.push(childNode);
	}

	async renderNode(options) {
		await Promise.all(this.#childNodes.map(childNode => childNode.renderNode(options)));

		const embedRendererPlugin = tryGetPluginByKey('d2l-html-embed-renderer', this.#node.dataset.d2lEmbedType);
		if (!embedRendererPlugin) return;

		const fragment = new DocumentFragment();
		this.#node.childNodes.forEach(node => {
			const temp = node.cloneNode(true);
			fragment.appendChild(temp);
		});

		let props = this.#node.dataset.d2lEmbedData;
		try {
			props = JSON.parse(this.#node.dataset.d2lEmbedData);
		} catch (e) { /* empty */ }

		const embed = await embedRendererPlugin.renderView(fragment, props || {}, options || {});
		if (embed) {
			render(embed, this.#node.parentNode);
			this.#node.remove();
		}
	}

}

export async function createEmbedPlaceholder(embedType, options) {
	const embedRendererPlugin = tryGetPluginByKey('d2l-html-embed-renderer', embedType);
	if (!embedRendererPlugin) return;

	const placeholderData = await embedRendererPlugin.getPlaceholder(options);
	/* NOT IMPLEMENTED */
}

export async function renderEmbeds(node, options) {
	const elems = [...node.querySelectorAll('div[data-d2l-embed-type], span[data-d2l-embed-type]')];
	if (elems.length === 0) return;

	const renderNodes = new Map();
	const rootNodes = [];
	const constructRenderNode = elem => {
		if (renderNodes.has(elem)) return;

		const renderNode = new RenderNode(elem);
		renderNodes.set(elem, renderNode);

		const nearestEmbedAncestor = findComposedAncestor(elem, ancestor => ancestor !== elem && elems.includes(ancestor));
		if (!nearestEmbedAncestor) {
			rootNodes.push(renderNode);
			return;
		}

		renderNodes.get(nearestEmbedAncestor).addChildNode(renderNode);
	};

	elems.forEach(constructRenderNode);
	await Promise.all(rootNodes.map(rootNode => rootNode.renderNode(options)));
}
