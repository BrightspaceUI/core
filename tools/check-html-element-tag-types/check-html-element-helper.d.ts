/**
 * Set Element constructors to something generic so that check-html-element-tag-types
 * will fail if one of the classes in the mixin chain doesn't extend HTMLElement.
 * Otherwise, the mixins will default to the element mixin
 */
import { Constructor } from '@open-wc/dedupe-mixin';

declare global {
	type LitElementConstructor = Constructor<{}>;
	type LitElementClassType = Constructor<{}>;
    type ReactiveElementConstructor = Constructor<{}>;
	type ReactiveElementClassType = Constructor<{}>;
}