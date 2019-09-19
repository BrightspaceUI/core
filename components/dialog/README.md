# Dialogs

## d2l-dialog

The `d2l-dialog` element is a generic dialog that provides a slot for arbitrary content, and a `footer` slot for workflow buttons.

![Dialog](./screenshots/dialog.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/dialog/dialog.js';
</script>

<d2l-button id="open">Show Dialog</d2l-button>

<d2l-dialog title-text="Dialog Title">
  <div>Some dialog content</div>
  <d2l-button slot="footer" primary>Done</d2l-button>
  <d2l-button slot="footer" id="cancel">Cancel</d2l-button>
</d2l-dialog>

<script>
  document.querySelector('#open').addEventListener('click', () => {
    document.querySelector('d2l-dialog').opened = true;
  });
  document.querySelector('#cancel').addEventListener('click', () => {
    document.querySelector('d2l-dialog').opened = false;
  });
</script>
```

**Properties:**

- `opened`: Whether or not the dialog is open
- `title-text`: Text displayed in the header of the dialog
- `width`: The preferred width (unit-less) for the dialog

## d2l-dialog-confirm

The `d2l-dialog-confirm` element is a simple confirmation dialog for prompting the user. It provides properties for specifying the required `text` and optional `title-text`, and a `footer` slot for workflow buttons.

![Confirmation Dialog](./screenshots/dialog-confirm.png?raw=true)

```html
<script type="module">
  import '@brightspace-ui/core/components/dialog/dialog-confirm.js';
</script>

<d2l-button id="open">Show Confirm</d2l-button>

<d2l-dialog-confirm title-text="Confirm Title" text="Are you sure?">
  <d2l-button slot="footer" primary>Yes</d2l-button>
  <d2l-button slot="footer" id="cancel">No</d2l-button>
</d2l-dialog-confirm>

<script>
  document.querySelector('#open').addEventListener('click', () => {
    document.querySelector('d2l-dialog-confirm').opened = true;
  });
  document.querySelector('#cancel').addEventListener('click', () => {
    document.querySelector('d2l-dialog-confirm').opened = false;
  });
</script>
```

**Properties:**

- `opened`: Whether or not the dialog is open
- `text`: The required text content for the confirmation dialog
- `title-text`: The optional title for the confirmation dialog
