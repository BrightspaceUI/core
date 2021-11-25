# Dialogs

Dialogs interrupt the user to complete a set of tasks, confirm an action, or offer important options.

<!-- docs: demo autoOpen:true autoSize:false size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/dialog/dialog.js';
</script>

<d2l-dialog id="dialog-demo" title-text="Dialog Title">
  <div>Some dialog content</div>
  <d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
  <d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
</d2l-dialog>
```

## General Dialog [d2l-dialog]

The `d2l-dialog` element is a generic dialog that provides a slot for arbitrary content, and a `footer` slot for workflow buttons. Apply the `data-dialog-action` attribute to workflow buttons to automatically close the dialog with the action value.

### Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Keep dialogs small and easy to understand
* Limit workflow buttons to 2
* Label primary actions with clear and predictable language. Use verbs like, “Add” or “Save” that indicate the outcome of a dialog rather than, “OK” or “Close”
* Keep dialog titles concise
* Maintain a language relationship between the action that triggered the dialog, dialog title, and dialog primary button.
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use a dialog when you could reasonably use an alternative that preserves user context, like expanding options inline
* Don’t use a dialog to show error, success, or warning messages. Use an inline or toast alert instead.
* Avoid creating large, complex dialogs
* Avoid invoking a dialog from another dialog (nested dialogs)
* Avoid a title length that could easily wrap to two lines
<!-- docs: end donts -->
<!-- docs: end best practices -->

<!-- docs: start hidden content -->
![Dialog](./screenshots/dialog.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-dialog autoSize:false display:block size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/dialog/dialog.js';

  document.querySelector('#open').addEventListener('click', () => {
    document.querySelector('#dialog').opened = true;
  });
</script>

<d2l-button id="open">Show Dialog</d2l-button>

<d2l-dialog id="dialog" title-text="Dialog Title">
  <div>Some dialog content</div>
  <d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
  <d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
</d2l-dialog>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `title-text` | String, required | Text displayed in the header of the dialog |
| `async` | Boolean | Whether to render a loading-spinner and wait for state changes via [AsyncContainerMixin](../../mixins/async-container) |
| `opened` | Boolean | Whether or not the dialog is open |
| `width` | Number, default: `600` | The preferred width (unit-less) for the dialog |

### Events

- `d2l-dialog-open`: dispatched when the dialog is opened
- `d2l-dialog-close`: dispatched with the action value when the dialog is closed for any reason
<!-- docs: end hidden content -->

### Methods

- `resize`: resizes the dialog based on specified `width` and measured content height

### Usage

Open the dialog declaratively using a boolean attribute `opened`:

```html
<d2l-dialog ?opened="${this.someProp}"></d2l-dialog>
```

Alternatively, open the dialog by calling the `open` method to return a promise:

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

*Important:* The user may close the dialog in a few different ways: clicking the dialog workflow buttons (marked up with `data-dialog-action`); clicking the `[x]` button in the top-right corner; or pressing the `escape` key. Therefore, if your component tracks the `opened` state of the dialog with its own property, it's important to keep it in sync by listening for the `d2l-dialog-close` event.

```html
<d2l-dialog ?opened="${this.dialogIsOpened}"></d2l-dialog>
```

```javascript
// later on...
document.querySelector('d2l-dialog').addEventListener('d2l-dialog-close', (e) => {
  this.dialogIsOpened = false;
});
```

## Confirmation Dialog [d2l-dialog-confirm]

The `d2l-dialog-confirm` element is a simple confirmation dialog for prompting the user. It provides properties for specifying the required `text` and optional `title-text`, and a `footer` slot for workflow buttons. Apply the `data-dialog-action` attribute to workflow buttons to automatically close the confirm dialog with the action value.

### Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Label the primary button with a verb that indicates the outcome of the action. Use “Delete” over “Yes” or “No”
* Keep the confirmation statement or question concise. Starting with, “Are you sure you want to…” is wordy.
* Use “Cancel” for the secondary button
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t present users with unclear choices
* Don’t label the primary button with a potentially ambiguous word like, “OK”
* Don’t use a confirmation dialog if the action is not critical in nature (avoid interrupting the user)
* Don’t use a confirmation dialog if you can introduce an undo option instead
* Don’t use a confirmation dialog to show error, success, or warning messages. Use an inline or toast alert instead
<!-- docs: end donts -->
<!-- docs: end best practices -->

<!-- docs: start hidden content -->
![Confirmation Dialog](./screenshots/dialog-confirm.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-dialog-confirm autoSize:false display:block size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/dialog/dialog-confirm.js';

  document.querySelector('#open-confirm').addEventListener('click', () => {
    document.querySelector('#dialog-confirm').opened = true;
  });
</script>

<d2l-button id="open-confirm">Show Confirm</d2l-button>

<d2l-dialog-confirm id="dialog-confirm" title-text="Confirm Title" text="Are you sure?">
  <d2l-button slot="footer" primary data-dialog-action="yes">Yes</d2l-button>
  <d2l-button slot="footer" data-dialog-action>No</d2l-button>
</d2l-dialog-confirm>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `text` | String, required | The required text content for the confirmation dialog |
| `opened` | Boolean | Whether or not the dialog is open |
| `title-text` | String | The optional title for the confirmation dialog |

### Events

- `d2l-dialog-open`: dispatched when the dialog is opened
- `d2l-dialog-close`: dispatched with the action value when the dialog is closed for any reason
<!-- docs: end hidden content -->

### Usage

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

## Fullscreen Dialog [d2l-dialog-fullscreen]

The `d2l-dialog-fullscreen` element is a fullscreen variant of the generic `d2l-dialog`. It provides a slot for arbitrary content, and a `footer` slot for workflow buttons. Apply the `data-dialog-action` attribute to workflow buttons to automatically close the dialog with the action value.

<!-- docs: start hidden content -->
![Fullscreen Dialog](./screenshots/dialog-fullscreen.png?raw=true)
<!-- docs: end hidden content -->

<!-- docs: demo live name:d2l-dialog-fullscreen autoSize:false display:block size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/dialog/dialog-fullscreen.js';

  document.querySelector('#open-fullscreen').addEventListener('click', () => {
    document.querySelector('#dialog-fullscreen').opened = true;
  });
</script>

<d2l-button id="open-fullscreen">Show Dialog</d2l-button>

<d2l-dialog-fullscreen id="dialog-fullscreen" title-text="Fullscreen Dialog Title">
  <div>Some dialog content</div>
  <d2l-button slot="footer" primary data-dialog-action="done">Done</d2l-button>
  <d2l-button slot="footer" data-dialog-action>Cancel</d2l-button>
</d2l-dialog-fullscreen>
```

<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|--|--|--|
| `title-text` | String, required | Text displayed in the header of the dialog |
| `async` | Boolean | Whether to render a loading-spinner and wait for state changes via [AsyncContainerMixin](../../mixins/async-container) |
| `opened` | Boolean | Whether or not the dialog is open |

### Events

- `d2l-dialog-open`: dispatched when the dialog is opened
- `d2l-dialog-close`: dispatched with the action value when the dialog is closed for any reason
<!-- docs: end hidden content -->

### Usage

Open the fullscreen dialog as described for generic dialogs, either by setting the `opened` property/attribute, or by calling the `open` method to get a promise for the result.

```javascript
document.querySelector('#open').addEventListener('click', () => {
  const dialog = document.querySelector('d2l-dialog-fullscreen');
  dialog.opened = true;
  dialog.addEventListener('d2l-dialog-close', (e) => {
    console.log('action:', e.detail.action);
  });
});
```

<!-- docs: start hidden content -->
## Future Improvements

* scroll API for the dialog content (see [#341](https://github.com/BrightspaceUI/core/issues/341))

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
