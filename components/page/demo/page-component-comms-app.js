import '../../button/button-icon.js';
import '../../button/button.js';
import '../../inputs/input-text.js';
import '../page.js';
import '../page-header-immersive.js';
import '../page-main.js';
import '../page-side-nav.js';
import { css, html, LitElement } from 'lit';

class PageDemoCommsApp extends LitElement {

	static properties = {
		_messages: { state: true }
	};

	static styles = css`
		:host {
			display: block;
		}
		:host([hidden]) {
			display: none;
		}

        .wrapper {
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: end;
        }

        .messages {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
        }

        .message {
            background-color: var(--d2l-color-celestine);
            border-radius: 0.25rem;
            color: #ffffff;
            padding: 0.5rem;
        }

        .anchor {
            align-items: center;
            background-color: white;
            bottom: 0;
            display: flex;
            gap: 0.5rem;
            height: 75px;
            position: sticky;
        }
	`;

	constructor() {
		super();
		this._messages = ['Hello there!', 'Press Send!', 'To Add More Messages!'];
	}

	render() {
		return html`
			<d2l-page width-type="fullscreen">
				<d2l-page-header-immersive slot="header" title-text="Messages">
					<d2l-button-icon slot="actions" icon="tier1:edit" text="Compose"></d2l-button-icon>
					<d2l-button-icon slot="actions" icon="tier1:more" text="More options"></d2l-button-icon>
				</d2l-page-header-immersive>

				<d2l-page-side-nav slot="side-nav">
					<d2l-button slot="header-start" primary>New Message</d2l-button>
					<d2l-button-icon slot="header-end" icon="tier1:gear" text="Folder settings"></d2l-button-icon>
					Conversations go here
				</d2l-page-side-nav>

				<d2l-page-main>
					<div slot="header-start">Conversation</div>
                    <d2l-button-icon slot="header-end" icon="tier1:search" text="Search"></d2l-button-icon>
                    <div class="wrapper">
                        <div class="messages">
                            ${this._messages.map(message => html`
                                <div class="message">${message}</div>
                            `)}
                        </div>
                        <div class="anchor">
                            <d2l-input-text label="Message" label-hidden placeholder="Type a message…"></d2l-input-text>
                            <d2l-button primary @click="${this._addMessage}">Send</d2l-button>
                        </div>
                    </div>
				</d2l-page-main>
			</d2l-page>
		`;
	}

	_addMessage() {
		this._messages = [...this._messages, 'Another!'];
	}

}

customElements.define('d2l-page-demo-comms-app', PageDemoCommsApp);
