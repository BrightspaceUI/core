import { Constructor } from '@open-wc/dedupe-mixin';
import { LitElement, ReactiveElement } from 'lit';

declare global {
	// Used for mixins that use lit-html but don't set properties or styles
	type LitElementConstructor = Constructor<LitElement>;
	// Used for mixins that use lit-html and set properties or styles
	type LitElementClassType = LitElementConstructor & Pick<typeof LitElement, keyof typeof LitElement>;

	// Used for mixins that use reactive element properties (updated, willUpdate, firstUpdated, connectedCallback, etc) but don't set properties or styles
	type ReactiveElementConstructor = Constructor<ReactiveElement>;
	// Used for mixins that use reactive element properties (updated, willUpdate, firstUpdated, connectedCallback, etc) and set properties or styles
	type ReactiveElementClassType = ReactiveElementConstructor & Pick<typeof ReactiveElement, keyof typeof ReactiveElement>;
}
