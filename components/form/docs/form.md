# Forms

## d2l-form

The `d2l-form` component can be used to build sections containing interactive controls that are validated and submitted as a group.

It differs from the native HTML `form` element in 4 ways:
1. It supports custom form elements made using the [`FormElementMixin`](./form-element-mixin.md) in addition to native form elements like `input`, `select` and `textarea`.
1. Upon validation, it will display an error summary that contains error messages for any elements that failed validation.
1. `d2l-form` elements can be nested. If a parent form is validated or submitted it will also trigger the corresponding action for descendent `d2l-form`s unless they explicitly opt-out using `no-nesting`. This means that a `d2l-form` will only pass validation if it and all of its nested descendants pass validation.
1. Submission is not handled directly by `d2l-form`. Instead, all form data will be aggregated and passed back to the caller via an event. The caller is then responsible for submitting the data.

If you're looking to emulate native form element submission, [`d2l-form-native`](./form-native.md) may be more appropriate.


```html
<script type="module">
  import '@brightspace-ui/core/components/form/d2l-form.js';
</script>
<d2l-form>
  <d2l-input-text required label="Email" name="email" type="email"></d2l-input-text>
  <select class="d2l-input-select" name="pets" required>
    <option value="">--Please choose an option--</option>
    <option value="porpoise">Porpoise</option>
    <option value="house hippo">House Hippo</option>
    <option value="spiker monkey">Spider Monkey</option>
    <option value="capybara">Capybara</option>
  </select>
  <button name="action" value="save" type="submit" @click=${e => {
      this.shadowRoot.querySelector('d2l-form-native').submit();
    }}>Save
  </button>
</d2l-form>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| `no-nesting` | Boolean, default: `false` | Indicates that the form should opt-out of nesting.<br><br>This means that it will not be submitted or validated if an ancestor form is submitted or validated. However, directly submitting or validating a form with `no-nesting` will still trigger submission and validation for its descendant forms unless they also opt-out using `no-nesting`. |

**Methods:**
- `submit()`: Submits the form. This will first perform validation on all elements within the form including nested `d2l-form` elements.
	- **Note:** If validation succeeds, the form data will be aggregated and passed back to the caller via the `d2l-form-submit` event. It will not be submitted by the form itself.
- `async validate()`: Validates the form and any nested `d2l-form` elements without submitting even if validation succeeds for all elements. Returns a `Map` mapping from an element to the list of error messages associated with it.
	- **Note:** The return value will include elements and errors from both the root form and any nested descendant forms.

**Events:**
- `d2l-form-submit`: Dispatched when the form is submitted. The form data can be obtained from the `detail`'s `formData` property.
- `d2l-form-invalid`: Dispatched when the form fails validation. The error map can be obtained from the `detail`'s `errors` property.

### Advanced Usages

**Nesting:**

`d2l-form` supports nesting by default meaning a `d2l-form` will discover descendant `d2l-form` elements. This includes *both*:
1. `d2l-form` elements nested directly within the ancestor form's slot
1. `d2l-form` elements contained within the shadow DOM of elements nested within the ancestor form's slot.

Form nesting will only consider descendants relative to the `d2l-form` that `submit` or `validate` is called on. If `submit` is called on a `d2l-form` element, it will not trigger submission for any ancestor forms, only desdenants.

- **Nested Validation:**
	- When forms are nested, validation is _**atomic**_. This means that validation will only succeed if validation succeeds for the root form and all nested forms. If any form fails validation, none of them will be submitted.
- **Nested Submission:**
	- When forms are nested, submission is _**independent**_. As a result, when nested forms all pass validation, each `d2l-form` will fire its own `d2l-form-submit` event with the data associated with that form.

```html
<script type="module">
  import '@brightspace-ui/core/components/form/d2l-form.js';
</script>
<d2l-form id="root">
	<div>
		<d2l-form id="a">
			<d2l-input-text required label="Email" name="email" type="email"></d2l-input-text>
			<select class="d2l-input-select" name="pets" required>
				<option value="">--Please choose an option--</option>
				<option value="porpoise">Porpoise</option>
				<option value="house hippo">House Hippo</option>
				<option value="spiker monkey">Spider Monkey</option>
				<option value="capybara">Capybara</option>
			</select>
			<div>
				<d2l-form id="b">
					<d2l-input-text label="Description" type="text" name="description" required></d2l-input-text>
				</d2l-form>
			</div>
		</d2l-form>
	</div>
	<d2l-form no-nesting id="c">
		<d2l-input-text label="Name" type="text" name="name" required minlength="4"></d2l-input-text>
	</d2l-form>
	<my-ele-with-an-internal-d2l-form id="d">
	</my-ele-with-an-internal-d2l-form>
</d2l-form>
```

#### Example 1
In the above example, calling `submit` on the `#root` form will cause forms `#root`, `#a`, `#b`, and `#d` to be validated and submitted.
- `d2l-form#root` will be submitted because submit was called on it directly.
- `d2l-form#a` will be submitted because it is nested directly within `#root`'s slot.
- `d2l-form#b` will be submitted because it is nested within `#d2l-form#a` which was submitted.
- The `d2l-form` within the shadow root of `#d` will be submitted because it is within the shadow DOM of an element nested directly within `#root`'s slot.
- `d2l-form#c` will _**not**_ be submitted because it has the `no-nesting` attribute despite being nested directly within `#root's` slot.

#### Example 2
In the above example, calling `submit` on form `#a` will cause forms `#a` and `#b` to be validated and submitted.
- `d2l-form#a` will be submitted because submit was called on it directly.
- `d2l-form#b` will be submitted because it is nested directly within `#a`'s slot.
- `d2l-form#root`, `d2l-form#c` and the `d2l-form` within the shadow root of `#d` will _**not**_ be submitted because they are ancestors of `#a` rather than descendants.

## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
