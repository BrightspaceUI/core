# Dialogs

## d2l-dialog

The `d2l-dialog` element is a generic dialog that provides a slot for arbitrary content, and a `footer` slot for workflow buttons. Apply the `dialog-action` attribute to workflow buttons to automatically close the dialog with the action value.

![Dialog](./screenshots/dialog.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/dialog/dialog.js';
</script>

<d2l-button id="open">Show Dialog</d2l-button>

<d2l-dialog title-text="Dialog Title">
  <div>Some dialog content</div>
  <d2l-button slot="footer" primary dialog-action="done">Done</d2l-button>
  <d2l-button slot="footer" dialog-action>Cancel</d2l-button>
</d2l-dialog>
```

Open the dialog by calling the `open` method to return a promise:

```javascript
document.querySelector('#open').addEventListener('click', async() => {
  const action = await document.querySelector('d2l-dialog').open();
  console.log('dialog action:', action);
});
```

Alternatively, set the `opened` property/attribute and listen for the `d2l-dialog-close` event:

```javascript
document.querySelector('#open').addEventListener('click', () => {
  const dialog = document.querySelector('d2l-dialog');
  dialog.opened = true;
  dialog.addEventListener('d2l-dialog-close', (e) => {
    console.log('dialog action:', e.detail.action);
  });
});
```

*Note:* The user may close the dialog in a few different ways: clicking the dialog workflow buttons (marked up with `dialog-action`), by clicking the `[x]` button in the top-right corner, or by pressing the `escape` key. It is possible to listen for click events directly on the workflow buttons, however to be notified in any of these scenarios, it is best to either wait for the `open` method's promise, or listen for the `d2l-dialog-close` event.

**Properties:**

- `title-text` (required, String): Text displayed in the header of the dialog
- `async` (Boolean): Whether to render a loading-spinner and wait for state changes via [AsyncContainerMixin](../../mixins/async-container)
- `opened` (Boolean): Whether or not the dialog is open
- `width` (Number, default: `600`): The preferred width (unit-less) for the dialog

**Methods:**

- `resize`: resizes the dialog based on specified `width` and measured content height

**Events:**

- `d2l-dialog-open`: dispatched when the dialog is opened
- `d2l-dialog-close`: dispatched with the action value when the dialog is closed for any reason

## d2l-dialog-confirm

The `d2l-dialog-confirm` element is a simple confirmation dialog for prompting the user. It provides properties for specifying the required `text` and optional `title-text`, and a `footer` slot for workflow buttons. Apply the `dialog-action` attribute to workflow buttons to automatically close the confirm dialog with the action value.

![Confirmation Dialog](./screenshots/dialog-confirm.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/dialog/dialog-confirm.js';
</script>

<d2l-button id="open">Show Confirm</d2l-button>

<d2l-dialog-confirm title-text="Confirm Title" text="Are you sure?">
  <d2l-button slot="footer" primary dialog-action="yes">Yes</d2l-button>
  <d2l-button slot="footer" dialog-action>No</d2l-button>
</d2l-dialog-confirm>
```

Open the confirm dialog as described for generic dialogs, either by setting the `opened` property/attribute, or by calling the `open` method to get a promise for the result.

```javascript
document.querySelector('#open').addEventListener('click', () => {
  const dialog = document.querySelector('d2l-dialog-confirm');
  dialog.opened = true;
  dialog.addEventListener('d2l-dialog-close', (e) => {
    console.log('confirm action:', e.detail.action);
  });
});
```

**Properties:**

- `text` (required, String): The required text content for the confirmation dialog
- `opened` (Boolean): Whether or not the dialog is open
- `title-text` (String): The optional title for the confirmation dialog

**Events:**

- `d2l-dialog-open`: dispatched when the dialog is opened
- `d2l-dialog-close`: dispatched with the action value when the dialog is closed for any reason
