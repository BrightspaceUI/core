import { html, nothing, render } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { map } from 'lit/directives/map.js';
import { tryGetPluginByKey } from './plugins.js';

const embedTypeAttributeName = 'data-d2l-embed-type';

function tryGetEmbedRendererPlugin(embedType) {
	const embedRendererPlugin = tryGetPluginByKey('d2l-html-embed-renderer', embedType);
	if (!embedRendererPlugin) {
		console.warn(`d2l-html-embed-renderer: Can't find plugin for ${embedType} embed type.`);
	}

	return embedRendererPlugin;
}

export async function createEmbedViewPlaceholder(embedType, props) {
	const embedRendererPlugin = tryGetEmbedRendererPlugin(embedType);
	if (!embedRendererPlugin) return;

	const placeholderData = await embedRendererPlugin.getViewPlaceholderData(props);
	const contents = placeholderData.contents
		? map(Object.entries(placeholderData.contents), ([id, content]) => html`<template data-d2l-embed-template-id=${id}>${content}</template>`)
		: nothing;

	const properties = placeholderData.properties ? JSON.stringify(placeholderData.properties) : undefined;

	return placeholderData.inline
		? html`
			<span data-d2l-embed-type="${embedType}" data-d2l-embed-props="${ifDefined(properties)}" style="${placeholderData.style}">
				${contents}
			</span>
		` : html`
			<div data-d2l-embed-type="${embedType}" data-d2l-embed-props="${ifDefined(properties)}" style="${placeholderData.style}">
				${contents}
			</div>
		`;
}

export async function createEmbedEditorPlaceholder(embedType, props) {
	const embedRendererPlugin = tryGetEmbedRendererPlugin(embedType);
	if (!embedRendererPlugin) return;

	const placeholderData = await embedRendererPlugin.getEditorPlaceholderData(props);
	const text = placeholderData.text || nothing;

	const properties = placeholderData.properties ? JSON.stringify(placeholderData.properties) : undefined;

	return placeholderData.inline
		? html`
			<span
				contentEditable="${ifDefined(placeholderData.contentEditable)}"
				data-d2l-embed-type="${embedType}"
				data-d2l-embed-props="${ifDefined(properties)}"
				style="${placeholderData.style}">
				${text}
			</span>
		` : html`
			<div
				contentEditable="${ifDefined(placeholderData.contentEditable)}"
				data-d2l-embed-type="${embedType}"
				data-d2l-embed-props="${ifDefined(properties)}"
				style="${placeholderData.style}">
				${text}
			</div>
		`;
}

export async function renderEmbeds(node) {
	const placeholders = [...node.querySelectorAll(`div[${embedTypeAttributeName}], span[${embedTypeAttributeName}]`)];
	if (placeholders.length === 0) return;

	const processPlaceholder = async placeholder => {
		const embedRendererPlugin = tryGetEmbedRendererPlugin(placeholder.dataset.d2lEmbedType);
		if (!embedRendererPlugin) return;

		const templates = [...placeholder.querySelectorAll('template[data-d2l-embed-template-id]')];
		const processedTemplates = await Promise.all(templates.map(async template => {
			const templateNode = template.content.cloneNode(true);
			await renderEmbeds(templateNode);
			return html`${templateNode}`;
		}));

		const processedTemplateContents = templates.reduce((acc, template, index) => {
			acc[template.dataset.d2lEmbedTemplateId] = processedTemplates[index];
			return acc;
		}, {});

		const props = JSON.parse(placeholder.dataset.d2lEmbedProps);
		return embedRendererPlugin.renderView(processedTemplateContents, props);
	};

	const embeds = await Promise.all(placeholders.map(processPlaceholder));
	placeholders.forEach((placeholder, index) => {
		if (!embeds[index]) {
			console.warn(`d2l-html-embed-renderer: Can't find valid embed for placeholder with ${placeholder.dataset.d2lEmbedType} embed type`);
		}

		render(embeds[index], placeholder.parentNode, { renderBefore: placeholder });
		placeholder.remove();
	});
}
