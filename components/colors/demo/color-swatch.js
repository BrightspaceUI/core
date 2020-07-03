import { css, html, LitElement } from 'lit-element/lit-element.js';

class ColorSwatch extends LitElement {

	static get properties() {
		return {
			name: { type: String, reflect: true }
		};
	}

	static get styles() {
		return css`
			:host {
				border-radius: 8px;
				box-sizing: border-box;
				color: #ffffff;
				display: block;
				font-size: 0.7rem;
				font-weight: 400;
				margin: 0.3rem;
				padding: 0.3rem;
				width: 300px;
			}
			:host([name="regolith"]) {
				background-color: var(--d2l-color-regolith);
				color: var(--d2l-color-ferrite);
			}
			:host([name="sylvite"]) {
				background-color: var(--d2l-color-sylvite);
				color: var(--d2l-color-ferrite);
			}
			:host([name="gypsum"]) {
				background-color: var(--d2l-color-gypsum);
				color: var(--d2l-color-ferrite);
			}
			:host([name="mica"]) {
				background-color: var(--d2l-color-mica);
				color: var(--d2l-color-ferrite);
			}
			:host([name="corundum"]) {
				background-color: var(--d2l-color-corundum);
				color: var(--d2l-color-ferrite);
			}
			:host([name="chromite"]) {
				background-color: var(--d2l-color-chromite);
				color: var(--d2l-color-ferrite);
			}
			:host([name="galena"]) {
				background-color: var(--d2l-color-galena);
			}
			:host([name="tungsten"]) {
				background-color: var(--d2l-color-tungsten);
			}
			:host([name="ferrite"]) {
				background-color: var(--d2l-color-ferrite);
			}
			:host([name="primary-accent-action"]) {
				background-color: var(--d2l-color-primary-accent-action);
			}
			:host([name="primary-accent-indicator"]) {
				background-color: var(--d2l-color-primary-accent-indicator);
			}
			:host([name="feedback-error"]) {
				background-color: var(--d2l-color-feedback-error);
			}
			:host([name="feedback-warning"]) {
				background-color: var(--d2l-color-feedback-warning);
			}
			:host([name="feedback-success"]) {
				background-color: var(--d2l-color-feedback-success);
			}
			:host([name="feedback-action"]) {
				background-color: var(--d2l-color-feedback-action);
			}
			:host([name="zircon-plus-2"]) {
				background-color: var(--d2l-color-zircon-plus-2);
				color: var(--d2l-color-ferrite);
			}
			:host([name="zircon-plus-1"]) {
				background-color: var(--d2l-color-zircon-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="zircon"]) {
				background-color: var(--d2l-color-zircon);
			}
			:host([name="zircon-minus-1"]) {
				background-color: var(--d2l-color-zircon-minus-1);
			}
			:host([name="celestine-plus-2"]) {
				background-color: var(--d2l-color-celestine-plus-2);
				color: var(--d2l-color-ferrite);
			}
			:host([name="celestine-plus-1"]) {
				background-color: var(--d2l-color-celestine-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="celestine"]) {
				background-color: var(--d2l-color-celestine);
			}
			:host([name="celestine-minus-1"]) {
				background-color: var(--d2l-color-celestine-minus-1);
			}
			:host([name="amethyst-plus-2"]) {
				background-color: var(--d2l-color-amethyst-plus-2);
				color: var(--d2l-color-ferrite);
			}
			:host([name="amethyst-plus-1"]) {
				background-color: var(--d2l-color-amethyst-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="amethyst"]) {
				background-color: var(--d2l-color-amethyst);
			}
			:host([name="amethyst-minus-1"]) {
				background-color: var(--d2l-color-amethyst-minus-1);
			}
			:host([name="fluorite-plus-2"]) {
				background-color: var(--d2l-color-fluorite-plus-2);
				color: var(--d2l-color-ferrite);
			}
			:host([name="fluorite-plus-1"]) {
				background-color: var(--d2l-color-fluorite-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="fluorite"]) {
				background-color: var(--d2l-color-fluorite);
			}
			:host([name="fluorite-minus-1"]) {
				background-color: var(--d2l-color-fluorite-minus-1);
			}
			:host([name="tourmaline-plus-2"]) {
				background-color: var(--d2l-color-tourmaline-plus-2);
				color: var(--d2l-color-ferrite);
			}
			:host([name="tourmaline-plus-1"]) {
				background-color: var(--d2l-color-tourmaline-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="tourmaline"]) {
				background-color: var(--d2l-color-tourmaline);
			}
			:host([name="tourmaline-minus-1"]) {
				background-color: var(--d2l-color-tourmaline-minus-1);
			}
			:host([name="cinnabar-plus-2"]) {
				background-color: var(--d2l-color-cinnabar-plus-2);
				color: var(--d2l-color-ferrite);
			}
			:host([name="cinnabar-plus-1"]) {
				background-color: var(--d2l-color-cinnabar-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="cinnabar"]) {
				background-color: var(--d2l-color-cinnabar);
			}
			:host([name="cinnabar-minus-1"]) {
				background-color: var(--d2l-color-cinnabar-minus-1);
			}
			:host([name="carnelian-plus-1"]) {
				background-color: var(--d2l-color-carnelian-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="carnelian"]) {
				background-color: var(--d2l-color-carnelian);
				color: var(--d2l-color-ferrite);
			}
			:host([name="carnelian-minus-1"]) {
				background-color: var(--d2l-color-carnelian-minus-1);
			}
			:host([name="carnelian-minus-2"]) {
				background-color: var(--d2l-color-carnelian-minus-2);
			}
			:host([name="citrine-plus-1"]) {
				background-color: var(--d2l-color-citrine-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="citrine"]) {
				background-color: var(--d2l-color-citrine);
				color: var(--d2l-color-ferrite);
			}
			:host([name="citrine-minus-1"]) {
				background-color: var(--d2l-color-citrine-minus-1);
			}
			:host([name="citrine-minus-2"]) {
				background-color: var(--d2l-color-citrine-minus-2);
			}
			:host([name="peridot-plus-1"]) {
				background-color: var(--d2l-color-peridot-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="peridot"]) {
				background-color: var(--d2l-color-peridot);
				color: var(--d2l-color-ferrite);
			}
			:host([name="peridot-minus-1"]) {
				background-color: var(--d2l-color-peridot-minus-1);
			}
			:host([name="peridot-minus-2"]) {
				background-color: var(--d2l-color-peridot-minus-2);
			}
			:host([name="olivine-plus-1"]) {
				background-color: var(--d2l-color-olivine-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="olivine"]) {
				background-color: var(--d2l-color-olivine);
				color: var(--d2l-color-ferrite);
			}
			:host([name="olivine-minus-1"]) {
				background-color: var(--d2l-color-olivine-minus-1);
			}
			:host([name="olivine-minus-2"]) {
				background-color: var(--d2l-color-olivine-minus-2);
			}
			:host([name="malachite-plus-1"]) {
				background-color: var(--d2l-color-malachite-plus-1);
				color: var(--d2l-color-ferrite);
			}
			:host([name="malachite"]) {
				background-color: var(--d2l-color-malachite);
				color: var(--d2l-color-ferrite);
			}
			:host([name="malachite-minus-1"]) {
				background-color: var(--d2l-color-malachite-minus-1);
			}
			:host([name="malachite-minus-2"]) {
				background-color: var(--d2l-color-malachite-minus-2);
			}
		`;
	}

	render() {
		return html`
			<div>${this.name}</div>
		`;
	}

}

customElements.define('d2l-color-swatch', ColorSwatch);
