import { html, nothing, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { tryGetPluginByKey } from '@brightspace-ui/core/helpers/plugins.js';

const embedTypeAttributeName = 'data-d2l-embed-type';

export async function createEmbedPlaceholder(embedType, props) {
	const embedRendererPlugin = tryGetPluginByKey('d2l-html-embed-renderer', embedType);
	if (!embedRendererPlugin) return;

	const placeholderData = await embedRendererPlugin.getPlaceholder(props);
	const contents = placeholderData.contents
		? map(Object.entries(placeholderData.contents), ([id, content]) => html`<template data-d2l-embed-template-id=${id}>${content}</template>`)
		: nothing;

	const attributes = placeholderData.attributes ? JSON.stringify(placeholderData.attributes) : undefined;

	return placeholderData.inline
		? html`
			<span data-d2l-embed-type="${embedType}" data-d2l-embed-props="${ifDefined(attributes)}">
				${contents}
			</span>
		` : html`
			<div data-d2l-embed-type="${embedType}" data-d2l-embed-props="${ifDefined(attributes)}">
				${contents}
			</div>
		`;
}

export async function renderEmbeds(node, options) {
	const placeholders = [...node.querySelectorAll(`div[${embedTypeAttributeName}], span[${embedTypeAttributeName}]`)];
	if (placeholders.length === 0) return;

	const processPlaceholder = async placeholder => {
		const embedRendererPlugin = tryGetPluginByKey('d2l-html-embed-renderer', placeholder.dataset.d2lEmbedType);
		if (!embedRendererPlugin) return;

		const templates = [...placeholder.querySelectorAll('template[data-d2l-embed-template-id]')];
		const processedTemplates = await Promise.all(templates.map(async template => {
			const templateNode = template.content.cloneNode(true);
			await renderEmbeds(templateNode, options);
			return html`${templateNode}`;
		}));

		const processedTemplateContents = templates.reduce((acc, template, index) => {
			acc[template.dataset.d2lEmbedTemplateId] = processedTemplates[index];
			return acc;
		}, {});

		let props = placeholder.dataset.d2lEmbedProps;
		try {
			props = JSON.parse(placeholder.dataset.d2lEmbedProps);
		} catch (e) { /* empty */ }

		return embedRendererPlugin.renderView(processedTemplateContents, props, options || {});
	};

	const embeds = await Promise.all(placeholders.map(processPlaceholder));
	placeholders.forEach((placeholder, index) => {
		if (!embeds[index]) return;
		render(embeds[index], placeholder.parentNode, { renderBefore: placeholder });
		placeholder.remove();
	});
}
