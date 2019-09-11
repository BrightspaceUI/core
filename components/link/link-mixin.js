export const LinkMixin = superclass => class extends superclass {

	static get properties() {
		return {
			/**
			 * When present, this attribute instructs browsers to download a URL
			 * instead of navigating to it, so the user will be prompted to save
			 * it as a local file.
			 */
			download: {
				type: Boolean,
				reflectToAttribute: true
			},
			/**
			 * Contains a URL or a URL fragment that the hyperlink points to.
			 * Corresponds to the `href` attribute on standard `<a>` elements.
			 */
			href: {
				type: String,
				reflectToAttribute: true
			},
			/**
			 * This attribute indicates the human language of the linked resource.
			 * It is purely advisory, with no built-in functionality.
			 */
			hreflang: {
				type: String,
				reflectToAttribute: true
			},
			/**
			 * Specifies the relationship of the target object to the link object.
			 */
			rel: {
				type: String,
				reflectToAttribute: true
			},
			/**
			 * Specifies where to display the linked URL. Corresponds to the
			 * `target` attribute on standard `<a>` elements.
			 */
			target: {
				type: String,
				reflectToAttribute: true
			},
			/**
			 * Specifies the media type in the form of a MIME type for the linked
			 * URL. It is purely advisory, with no built-in functionality.
			 */
			type: {
				type: String,
				reflectToAttribute: true
			}
		};
	}

	constructor() {
		super();
		this.download = false;
	}
};
