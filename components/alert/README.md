# Alerts
Alerts communicate critical information relating to the state of the system and the user's work flow.

<!-- docs: demo autoSize:false align:start -->
```html
<script type="module">
  import '@brightspace-ui/core/components/alert/alert.js';
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
	Inline Alerts can be placed anywhere in the page content
</d2l-alert>
<d2l-alert-toast id="alert-toast" type="success" open no-auto-close>
	Toast Alerts appear at the botttom of the viewport</a>
</d2l-alert-toast>
```

## Inline Alert [d2l-alert]

Use an inline alert if there is important information a user needs to know while performing a task; the alert remains visible until the user takes action or dismisses it.

### Best Practices

<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use an alert to highlight information that requires the user’s action or attention
* Provide a clear call to action if it can help resolve the alert
* Use sentence case for alert text and avoid unnecessary punctuation by not placing periods at the end of single sentences
<!-- docs: end dos -->

<!-- docs: start donts -->
* Don't display more than one paragraph of text
* Avoid overusing them — the more commonly alerts appear, the less effective they will be
* Don't use them for promotional material or information that is not relevant to the user’s work flow
* Don’t use them for validation errors – instead, use the [Form](../../components/form) component for a consistent user experience
<!-- docs: end donts -->
<!-- docs: end best practices -->

<!-- docs: demo code properties name:d2l-alert sandboxTitle:'Inline Alert' autoSize:false  -->
```html
<script type="module">
	import '@brightspace-ui/core/components/alert/alert.js';
</script>

<d2l-alert type="default" button-text="Undo">
	An inline alert message
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

Use a toast alert to provide feedback about an operation the user has just initiated, when the result of that operation may not be apparent or obvious to the user. Toast alearts appear at the bottom of the viewport and disappear after 4 seconds, by default.

### Best Practices
<!-- docs: start best practices -->
<!-- docs: start dos -->
* Use to convey results of a user's action when the result is not otherwise obvious
* Keep text brief — toasts should rarely spill onto more than one line at any screen size
* Use specific language — “Assignment saved” is more informative than “Successfully saved”
<!-- docs: end dos -->
<!-- docs: start donts -->
* If possible, avoid displaying multiple toasts — see [Multiple Toast Alerts](#multiple-toast-alerts)
* Don't allow the close button to be blocked by other elements, users shouldn't have to wait for it to go away on its own
* Don’t use for instructions or critical information since they disappear and are easily ignored — use an [Inline Alert](#d2l-alert) instead
* Avoid having two lines with `subtext` — toasts should be very brief
<!-- docs: end donts -->
<!-- docs: end best practices -->


<!-- docs: demo code properties name:d2l-alert-toast sandboxTitle:'Toast Alert' autoSize:false -->
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
  A default toast alert
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

### Multiple Toast Alerts

Avoid displaying more than one toast message at a time unless absolutely necessary, since they disappear after 4 seconds and can be difficult to read for some users. It's often better to use an [inline alert](#d2l-alert) so that users have time to discover and read the message.

For cases where multiple toast alerts are unavoidable, new toast messages will appear at the bottom and push older messages upward.

<!-- docs: demo autoSize:false align:start size:large -->
```html
<script type="module">
  import '@brightspace-ui/core/components/alert/alert-toast.js';
  import '@brightspace-ui/core/components/button/button.js';

  for (let i = 1; i <= 3; i++) {
    const buttonSelector = `#open${i}`;
    const toastSelector = `#alert-toast${i}`;
    document.querySelector(buttonSelector).addEventListener('click', () => {
      document.querySelector(toastSelector).open = true;
    });
  }
</script>

<div style="width:100%;">
  <d2l-button id="open1">Show Alert 1</d2l-button>
  <d2l-button id="open2">Show Alert 2</d2l-button>
  <d2l-button id="open3">Show Alert 3</d2l-button>
</div>
<d2l-alert-toast id="alert-toast1" type="success" open no-auto-close>
	First toast alert
</d2l-alert-toast>
<d2l-alert-toast id="alert-toast2" type="default">
	Second toast, with auto-close
</d2l-alert-toast>
<d2l-alert-toast id="alert-toast3" type="critical" no-auto-close>
	Third toast alert
</d2l-alert-toast>
```

## Accessibility

[Inline Alerts](#d2l-alert) are meant to draw attention without interrupting the user's flow, so they do not use the ARIA `alert` role. This means screen reader users do not hear them until encountering them in the content (as intended).

[Toast Alerts](#d2l-alert-toast) leverage the ARIA `alert` role in alignment with the [W3C Alert Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/alert/), so an assertive live region is created which causes the content of the alert to be announced immediately. This can interrupt the user, so it should be used sparingly as per our [Best Practices](#best-practices-1).
