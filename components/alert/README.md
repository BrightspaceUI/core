# Alerts
Alerts communicate critical information relating to the state of the system and the user's work flow.

<!-- docs: demo autoSize:false align:start -->
```html
<script type="module">
  import '@brightspace-ui/core/components/alert/alert-toast.js';
  import '@brightspace-ui/core/components/button/button.js';

  var alert = document.querySelector('#alert');
  var alertToast = document.querySelector('#alert-toast');
  var button = document.querySelector('#open');

  alert.addEventListener('d2l-alert-close', function() {
    if (!alertToast.open) button.style.display = 'block';
  });
  alertToast.addEventListener('d2l-alert-toast-close', function() {
    if (alert.hasAttribute('hidden')) button.style.display = 'block';
  });

  button.addEventListener('click', () => {
    alert.removeAttribute('hidden');
    alertToast.open = true;
    button.style.display = 'none';
  });
</script>
<style>
  d2l-alert-toast {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
</style>

<d2l-button id="open" style="align-self:center;display:none;">Show Alerts</d2l-button>
<d2l-alert id="alert" type="default" button-text="Undo" has-close-button>
	An inline alert message.
</d2l-alert>
<d2l-alert-toast id="alert-toast" type="success" open no-auto-close>
	A toast alert message.
</d2l-alert-toast>
```

## Inline Alert [d2l-alert]

The `d2l-alert` component can be used to communicate important information relating to the state of the system and the user's work flow.

### Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Do use to let the user know when the system is in a state that will prevent them from completing their action
* Do highlight information that requires the user’s attention and/or action.
* Do provide a clear call to action if it can help resolve the alert
* Do provide a control to dismiss the alert and prevent the message from displaying again, if applicable
* Do use sentence case for alert text, but avoid unnecessary punctuation by not placing periods at the end of single sentences
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don’t use an inline alert in isolation for form validation errors – highlight fields with errors in red and ensure that the fields have error tooltips on focus & hover
* Don't display more than one inline alert at a time
* Don't display promotional material or information that is not related to the user’s key work flow
* Don't display more than one paragraph of text in the alert
<!-- docs: end donts -->
<!-- docs: end best practices -->

<!-- docs: demo code properties name:d2l-alert autoSize:false  -->
```html
<script type="module">
	import '@brightspace-ui/core/components/alert/alert.js';
</script>

<d2l-alert type="default" button-text="Undo">
	A message.
</d2l-alert>
```
<!-- docs: start hidden content -->
### Properties

| Property | Type | Description |
|---|---|---|
| `button-text` | String | Text that is displayed within the alert's action button. If no text is provided the button is not displayed. |
| `has-close-button` | Boolean |  Gives the alert a close button that will close the alert when clicked |
| `hidden` | Boolean | Whether or not the alert is currently visible |
| `subtext` | String | The text that is displayed below the main alert message |
| `type` | String, default: `'default'` | Type of the alert being displayed. Can be one of  `default`, `critical`, `success`, `warning`. |

### Events
* `d2l-alert-close`: dispatched when the alert's close button is clicked
* `d2l-alert-button-press`: dispatched when the alert's action button is clicked
<!-- docs: end hidden content -->

## Toast Alert [d2l-alert-toast]

The `d2l-alert-toast` component serves the same purpose as `d2l-alert`; however, it is displayed as
a pop-up at the bottom of the screen that automatically dismisses itself by default.
### Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Do make toasts dismissible via the close icon –
* Do keep text brief – toasts shouldn’t spill onto more than one line at any screen size
* Do use specific language – “Assignment saved” is more informative than “Successfully saved”
<!-- docs: end dos -->
<!-- docs: start donts -->
* Don't display more than one at a time
* Don't allow the close button to be blocked by other elements, the user doesn’t want to have to wait for it to go way on it’s own
* Don’t use toasts to provide instructions. Change blindness and transience make them ineffective for these use cases
* Don’t use the thumbnails or two-line variety of inline alert as a toast. Toasts should be super brief!
<!-- docs: end donts -->
<!-- docs: end best practices -->


<!-- docs: demo code properties name:d2l-alert-toast autoSize:false -->
```html
<script type="module">
  import '@brightspace-ui/core/components/alert/alert-toast.js';
  import '@brightspace-ui/core/components/button/button.js';
</script>
<!-- docs: start hidden content -->
<script type="module">
  var alertToast = document.querySelector('d2l-alert-toast');
  var button = document.querySelector('#open');

  alertToast.addEventListener('d2l-alert-toast-close', function() {
    button.style.display = 'block';
  });

  button.addEventListener('click', () => {
    alertToast.open = true;
    button.style.display = 'none';
  });
</script>
<d2l-button id="open" style="align-self:center;display:none;">Show Alert</d2l-button>
<!-- docs: end hidden content -->
<d2l-alert-toast type="default" no-auto-close open>
  A default toast alert.
</d2l-alert-toast>
```

<!-- docs: start hidden content -->
### Properties
| Property | Type | Description |
|---|---|---|
|`button-text` | optional, String | text that is displayed within the alert's action button. If no text is provided the button is not displayed.|
|`hide-close-button`| Boolean, default: `false`  | hide the close button to prevent users from manually closing the alert.|
|`no-auto-close`| Boolean, default: `false` | prevents the alert from automatically closing 4 seconds after opening. |
|`no-padding`| Boolean | used to opt out of default padding/whitespace around the alert |
|`open`| Boolean, default: `false` |  Open or close the toast alert. |
|`subtext`| optional, String | The text that is displayed below the main alert message. |
|`type`| String, default: `'default'` | The type of the alert being displayed. Can be one of  `default`, `critical`, `success` , `warning` |

### Events
* `d2l-alert-toast-close`: dispatched when the toast is closed
<!-- docs: end hidden content -->
