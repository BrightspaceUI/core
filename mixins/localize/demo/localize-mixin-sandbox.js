import '../../../components/inputs/input-textarea.js';
import '../../../components/inputs/input-text.js';
import '../../../components/inputs/input-number.js';
import '../../../components/button/button-icon.js';
import '../../../components/dropdown/dropdown-button.js';
import '../../../components/dropdown/dropdown-menu.js';
import '../../../components/menu/menu.js';
import '../../../components/menu/menu-item.js';
import { bodyCompactStyles, heading4Styles } from '../../../components/typography/styles.js';
import { css, html, LitElement } from 'lit';
import { generateLink, generateTooltipHelp, localizeMarkup, LocalizeMixin } from '../localize-mixin.js';
import { parse } from '@formatjs/icu-messageformat-parser';

class Sandbox extends LocalizeMixin(LitElement) {

	static get properties() {
		return {
			selectedTemplate: { type: String },
			_error: { type: String }
		};
	}
	static get styles() {
		return [heading4Styles, bodyCompactStyles, css`
			[hidden] {
				display: none !important;
			}

			#actions {
				display: flex;
				justify-content: end;
			}

			h2.d2l-heading-4 {
				margin-bottom: 0.5rem;
			}

			d2l-input-text:not(:first-child) {
				margin-top: 1rem;
			}

			d2l-input-text > d2l-button-icon:last-child {
				margin-inline-end: 0.5rem;
			}

			d2l-input-text > d2l-button-icon {
				--d2l-button-icon-min-height: 1.5rem;
				--d2l-button-icon-min-width: 1.5rem;
			}

			d2l-dropdown d2l-icon {
				vertical-align: text-bottom;
			}

			#result {
				align-items: center;
				display: flex;
				justify-content: space-between;
			}

			#result-text {
				background-color: var(--d2l-color-sylvite);
				border: 1px solid var(--d2l-color-tungsten);
				border-radius: 6px;
				box-shadow: rgba(0, 0, 0, 0.14) 0 2px 2px 0, rgba(0, 0, 0, 0.12) 0 1px 5px 0, rgba(0, 0, 0, 0.2) 0 3px 1px -2px;
				max-width: 900px;
				padding: 0.5rem 0.75rem;
			}
		`];
	}

	static langResources = {
		basic: 'The octopus has eight legs',
		arguments: 'The {animalType} has {animalLegCount} legs',
		richText: 'The octopus\'s name is <b>{octopusName}</b>',
		escaped: `Bold octopus HTML: '<b>'{octopusName}'</b>'`,
		select:
`{bodyPart, select,
	legs {The octopus has eight legs}
	eyes {The octopus has two eyes}
	other {The octopus has many body parts}
}`,
		plural:
`{legCount, plural,
	one {The {animalType} has # leg}
	other {The {animalType} has # legs}
}`,
		offset:
`{octopusCount, plural, offset:2
	=0 {No octopuses have escaped through the drain.}
	=1 {{octopusName} has escaped through the drain!}
	=2 {{octopusName} and {octopus2Name} have escaped through the drain!}
	one {{octopusName}, {octopus2Name}, and # other octopus have escaped through the drain!}
	other {{octopusName}, {octopus2Name}, and # other octopuses have escaped through the drain!}
}`,
		ordinal:
`{rank, selectordinal,
	=0 {The {animalType} is the smallest animal in the ocean}
	=1 {The {animalType} is the largest animal in the ocean}
	one {The {animalType} is the #st largest animal in the ocean}
	two {The {animalType} is the #nd largest animal in the ocean}
	few {The {animalType} is the #rd largest animal in the ocean}
	other {The {animalType} is the #th largest animal in the ocean}
}`,
		nested:
`{animalHabitat, select,
	ocean {{rank, selectordinal,
		=0 {The {animalType} is the smallest animal in the ocean}
		=1 {The {animalType} is the largest animal in the ocean}
		one {The {animalType} is the #st largest animal in the ocean}
		two {The {animalType} is the #nd largest animal in the ocean}
		few {The {animalType} is the #rd largest animal in the ocean}
		other {The {animalType} is the #th largest animal in the ocean}
	}}
	land {{rank, selectordinal,
		=0 {The {animalType} is the smallest animal on land}
		=1 {The {animalType} is the largest animal on land}
		one {The {animalType} is the #st largest animal on land}
		two {The {animalType} is the #nd largest animal on land}
		few {The {animalType} is the #rd largest animal on land}
		other {The {animalType} is the #th largest animal on land}
	}}
	other {{rank, selectordinal,
		=0 {The {animalType} is the smallest animal that can fly}
		=1 {The {animalType} is the largest animal that can fly}
		one {The {animalType} is the #st largest animal that can fly}
		two {The {animalType} is the #nd largest animal that can fly}
		few {The {animalType} is the #rd largest animal that can fly}
		other {The {animalType} is the #th largest animal that can fly}
	}}
}`
	};

	static templates = [{
		name: 'Basic',
		key: 'basic'
	},
	{
		name: 'Arguments',
		key: 'arguments',
		arguments: {
			animalType: 'octopus',
			animalLegCount: '8'
		}
	},
	{
		name: 'Rich Text',
		key: 'richText',
		arguments: {
			octopusName: 'Larry'
		}
	},
	{
		name: 'Escaped',
		key: 'escaped',
		arguments: {
			octopusName: 'Mary'
		}
	},
	{
		name: 'Select',
		key: 'select',
		arguments: {
			bodyPart: 'legs'
		}
	},
	{
		name: 'Plural',
		key: 'plural',
		arguments: {
			legCount: 8,
			animalType: 'octopus'
		}
	},
	{
		name: 'Offset',
		key: 'offset',
		arguments: {
			octopusCount: 2,
			octopusName: 'Carrie',
			octopus2Name: 'Harry'
		}
	},
	{
		name: 'Ordinal',
		key: 'ordinal',
		arguments: {
			animalType: 'octopus',
			rank: 131
		}
	},
	{
		name: 'Nested',
		key: 'nested',
		arguments: {
			animalHabitat: 'land',
			rank: 1,
			animalType: 'elephant'
		}
	}];

	constructor() {
		super();
		this.tags = {};
		this.arguments = {};
		this.selectTemplate('basic');
	}

	static get localizeConfig() {
		return {
			importFunc: () => this.langResources
		};
	}

	get message() {
		return this.selectedTemplate.key === 'custom' ? this.shadowRoot.querySelector('#message').value : this.constructor.langResources[this.selectedTemplate.key];
	}

	firstUpdated() {
		this.setVariables();
	}

	render() {

		setTimeout(() => this.shadowRoot.querySelector('#code')?.forceUpdate(), 0);

		const tags = this.variables.find(v => v.type === 'tag');
		const localizeMethod = tags ? 'localizeHTML' : 'localize';
		const renderedArgs = Object.entries(this.arguments).filter(([k, val]) => val && this.variables.find(v => v.name === k));

		return html`		
		<div id="actions">
			<d2l-dropdown-button text="Load Template" primary>
				<d2l-dropdown-menu>
			    <d2l-menu label="Templates">${this.constructor.templates.map(({ name, key }) => html`
			      <d2l-menu-item text="${name}" @click="${this.handleTemplateClick}" data-template="${key}"></d2l-menu-item>`)}
					</d2l-menu>
				</d2l-dropdown-menu>
			</d2l-dropdown-button>
		</div>
		
		<h2 class="d2l-heading-4">Message</h2>
		<d2l-input-textarea id="message" label="Message" label-hidden @input="${this.setCustomTemplate}" value="${this.message}" max-rows="40" rows="3">
		</d2l-input-textarea>

		<div ?hidden="${!this.variables.length}">
			<h2 class="d2l-heading-4">Arguments</h2>
			<div>${this.variables.map(({ name, type, defaultTag }) => (type === 'tag' ? html`
				<d2l-input-text name="${name}" label="&lt;${name}&gt;${ defaultTag ? ' (default tag)' : ''}" value="${this.arguments[name]}" @input="${this.setArgument}" type="${type}">
					<d2l-button-icon slot="right" text="Generate a link" icon="tier1:link" @click="${this.handleGenerateLinkClick}"></d2l-button-icon>
					<d2l-button-icon slot="right" text="Generate a tooltip" icon="tier1:messages" @click="${this.handleGenerateTooltipClick}"></d2l-button-icon>
					<d2l-button-icon slot="right" text="Build a custom generator" icon="html-editor:source-editor" @click="${this.handleBuildGeneratorClick}"></d2l-button-icon>
				</d2l-input-text>` : html`
				<d2l-input-text type="${type}" name="${name}" label="{${name}}" value="${this.arguments[name]}" @input="${this.setArgument}"></d2l-input-text>`))}
			</div>
		</div>

		<div ?hidden="${this._error}">
			<h2 class="d2l-heading-4">Code</h2>
			<d2l-code-view id="code" language="javascript">
				this.${localizeMethod}('${this.selectedTemplate.key}'${renderedArgs.length ? `, {${renderedArgs.map(([k, val]) => `
					${k}: ${val.constructor === String && !this.tags[k] ? `'${val.toString()}'` : val.toString()}`).join(',')}
				}` : ''});
			</d2l-code-view>
		</div>

		<h2 id="result" class="d2l-heading-4">
			<span>Result</span>
			<div>
				<d2l-dropdown open-on-hover>
					<d2l-icon id="results-help" icon="tier1:help" class="d2l-dropdown-opener"></d2l-icon>
				  <d2l-dropdown-content class="d2l-body-compact">
				    For additional error details review the console or try <d2l-link href="https://format-message.github.io/icu-message-format-for-translators/editor.html" target="_blank">Message Editor</d2l-link>
				  </d2l-dropdown-content>
				</d2l-dropdown>
			</div>
		</h2>
		<div id="result-text">${this._error || this[localizeMethod](this.selectedTemplate.key, { ...this.arguments, ...this.tags })}</div>
		`;
	}

	handleBuildGeneratorClick({ target }) {
		target.parentElement.value = 'chunks => localizeMarkup`${chunks}`';
		this.setArgument({ target: target.parentElement });
	}

	handleGenerateLinkClick({ target }) {
		target.parentElement.value = 'generateLink({ href: \'https://d2l.com\', target: \'_blank\' })';
		this.setArgument({ target: target.parentElement });
	}

	handleGenerateTooltipClick({ target }) {
		target.parentElement.value = 'generateTooltipHelp({ contents: \'Tooltip text\' })';
		this.setArgument({ target: target.parentElement });
	}

	handleTemplateClick({ target }) {
		this.selectTemplate(target.dataset.template);
	}

	selectTemplate(key) {
		//this.previousArgs = this.arguments;

		this.selectedTemplate = this.constructor.templates.find(t => t.key === key) || { key: 'custom' };
		this.setVariables();
		this.setArguments();
	}

	setArgument({ target }) {
		if (target.type === 'tag') {
			if (target.value === '') {
				delete this.tags[target.name];
				delete this.arguments[target.name];
				this.requestUpdate();
				return;
			}
			else {
				this.tags[target.name] = (() => {
					try {
						return eval(`${target.value}`);
					} catch (e) { return ; }
				})();
			}
		}
		this.arguments[target.name] = target.type === 'number' ? Number(target.value) : target.value;
		this.requestUpdate();
	}

	setArguments() {
		if (this.selectedTemplate.key === 'custom') {
			this.variables.forEach(({ name, type }) => {
				if (type !== 'tag') this.arguments[name] ??= '';
			});
			return;
		}
		this.arguments = this.selectedTemplate.arguments || {};
	}

	setCustomTemplate() {
		this.selectTemplate('custom');
		this.requestUpdate();
	}

	setVariables() {
		this._error = null;
		const ast = (() => {
			try {
				return parse(this.message);
			}
			catch (e) {
				this._error = e;
				this.variables = [];
			}
		})();

		if (!ast) return;

		const varTypes = [1, 2, 3, 4, 5, 6];
		const tagType = 8;
		const numberTypes = [2, 6];
		const defaultTags = ['b', 'br', 'p', 'i', 'em', 'strong'];

		this.variables = (function check(parts, vars) {
			parts.forEach(part => {
				const type = numberTypes.includes(part.type) ? 'number' : 'text';
				if (!vars.find(v => v.name === part.value)) {
					if (varTypes.includes(part.type)) {
						vars.push({ name: part.value, type });
					}
					else if (part.type === tagType) {
						const defaultTag = defaultTags.includes(part.value);
						vars.push({ name: part.value, type: 'tag', defaultTag });
					}
				}

				if (part.options) Object.values(part.options).forEach(opt => check(opt.value, vars));
				if (part.children) check(part.children, vars);
			});
			return vars;
		})(ast, []);
	}

	willUpdate(changedProperties) {
		if (changedProperties.has('__resources')) {
			Object.defineProperty(this.__resources, 'custom', {
				get: () => ({ value: this.shadowRoot.querySelector('#message').value, language: this.__resources.basic.language }),
				configurable: true
			});
		}
	}

	// hardcoded references so the imports are not removed
	static _helpers = [ generateLink, generateTooltipHelp, localizeMarkup ];

}

customElements.define('d2l-sandbox', Sandbox);
