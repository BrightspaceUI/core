# Alerts

An Alert is used to communicate important information relating to the state of the system and the user's work flow.

## Best Practices

### Inline
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to let the user know when the system is in a state that will prevent them from completing their action
* Highlight information that requires the user’s attention and/or action.
* Provide a clear call to action if it can help resolve the alert
* If applicable, provide a control to dismiss the alert and prevent the message from displaying again
* Use sentence case for alert text, but avoid unnecessary punctuation by not placing periods at the end of single sentences
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use an inline alert in isolation for form validation errors – highlight fields with errors in red and ensure that the fields have error tooltips on focus & hover
* Don't display more than one inline alert at a time
* Dont display promotional material or information that is not related to the user’s key work flow
* Don't display more than one paragraph of text in the alert
<!-- docs: end donts -->
<!-- docs: end best practices -->

### Toast
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Toasts are required be dismissible via the close icon – if they’re obscuring content, the user doesn’t want to have to wait for it to go way on it’s own
* Keep text brief – toasts shouldn’t spill onto more than one line at any screen size
* Use specific language – “Assignment saved” is more informative than “Successfully saved”
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't display more than one at a time
* Don’t use toasts to provide instructions. Change blindness and transience make them ineffective for these use cases
* Don’t use the thumbnails or two-line variety of inline alert as a toast. Toasts should be super brief!
<!-- docs: end donts -->
<!-- docs: end best practices -->

## Inline Alert

An Inline Alert is used if there is important information a user needs to know before performing a task, or if the alert should remain on the screen until the user manually dismisses it or takes action.

```html
<!-- docs: live demo -->
<script type="module">
	import '@brightspace-ui/core/components/alert/alert.js';
</script>

<d2l-alert type="default" button-text="Undo" has-close-button>
	A message.
</d2l-alert>
```

## Toast Alert

The Toast Alert serves the same purpose as the inline alert; however, it is displayed as a pop-up at the bottom of the screen that automatically dismisses itself by default.

```html
<!-- docs: live demo -->
<script type="module">
	import '@brightspace-ui/core/components/alert/alert-toast.js';
</script>

<d2l-alert-toast type="default">
	A default toast alert.
</d2l-alert-toast>
```
