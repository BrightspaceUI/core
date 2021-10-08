# Hierarchical View

This component can help you organize information that lends itself to viewing hierarchicaly.

## Hierachical View [d2l-hierarchical-view]

The `d2l-hierarchical-view` component uses the `d2l-hierarchical-view-mixin` for nesting components.

<!-- docs: demo code name:d2l-hierarchical-view -->
```html
<script type="module">
  import '@brightspace-ui/core/components/button/button.js';
  import '@brightspace-ui/core/components/hierarchical-view/hierarchical-view.js';
</script>
<!-- docs: start hidden content -->
<script>
  window.requestAnimationFrame(() => {
    const focusFirstButton = function(e) {
      const button = e.detail.activeView.querySelector('button');
      if (button) {
        button.focus();
      }
    };
    const rootView = document.getElementById('view1');
    rootView.addEventListener('d2l-hierarchical-view-show-complete', (e) => {
      focusFirstButton(e);
    });
    rootView.addEventListener('d2l-hierarchical-view-hide-complete', (e) => {
      focusFirstButton(e);
    });
    const views = document.querySelectorAll('d2l-hierarchical-view');
    document.getElementById('btn-view-2a').addEventListener('click', () => {
      showSubView('view2a');
    });
    document.getElementById('btn-view-2b').addEventListener('click', () => {
      showSubView('view2b');
    });
    document.getElementById('btn-parent-view-2a').addEventListener('click', () => {
      showParentView('view2a');
    });
    document.getElementById('btn-parent-view-3').addEventListener('click', () => {
      showParentView('view3');
    });
    document.getElementById('btn-parent-view-2b').addEventListener('click', () => {
      showParentView('view2b');
    });
  });
</script>
<style>
  .view {
    height:100%;
    min-height: 200px;
  }
  .layout > * {
    margin: 0;
  }
  .buttons {
    height: 60px;

  }
  .buttons > .left { 
    float: left;
  }  
  .buttons > .right { 
    float: right;
  }
  d2l-button {
    margin: 5px;
  }
  h1 {
    margin: 0;
  }
  .position-display {
    height: 150px;
    display: flex;
    vertical-align: middle;
  }
  .col {
    height: 100px;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }
  .block {
    height: 20px;
    width: 100px;
    padding: 10px;
    text-align: center;
    line-height: 20px;
  }
  .selected { 
    border: 1px solid grey;
    
  }
  .position-display {
    display: flex;
    justify-content: space-evenly;
  }
</style>
<!-- docs: end hidden content -->
<script>
   function showSubView(id) {
    const view = document.getElementById(id);
    view.show();
  }
  function showParentView(id) {
    const view = document.getElementById(id);
    view.hide();
  }
</script>
<d2l-hierarchical-view id="view1">
  <div class="view view1">
    <div class="buttons">
      <d2l-button id="btn-view-2b" class="right"  onclick="showSubView('view2b');">View 2b</d2l-button>
      <d2l-button id="btn-view-2a" class="right" onclick="showSubView('view2a');">View 2a</d2l-button>
    </div>
    <h1>View 1</h1>
    <!-- docs: start hidden content -->
    <div class="position-display">
      <div class="col col1">
        <div class="block selected">View 1</div>
      </div>
      <div class="col col2">
        <div class="block">View 2a</div>
        <div class="block">View 2b</div>
      </div>
      <div class="col col3">
        <div class="block">View 3</div>
        <div class="block"></div>
        <div class="block"></div>
        <div class="block"></div>
      </div>
    </div>
    <!-- docs: end hidden content -->
    <div>
      <d2l-hierarchical-view id="view2a">
        <div class="view view2a">
          <div class="buttons">
            <d2l-button id="btn-parent-view-2a" class="left" onclick="showParentView('view2a');">View 1 (parent)</d2l-button>
            <d2l-button id="btn-view-3" class="right" onclick="showSubView('view3');">View 3</d2l-button>
          </div>

          <h1>View 2A</h1>
          <!-- docs: start hidden content -->
          <div class="position-display">
            <div class="col col1">
              <div class="block ">View 1</div>
            </div>
            <div class="col col2">
              <div class="block selected">View 2a</div>
              <div class="block">View 2b</div>
            </div>
            <div class="col col3">
              <div class="block">View 3</div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
            </div>
          </div>
          <!-- docs: end hidden content -->
          <d2l-hierarchical-view id="view3">
            <div class="view view3">
              <div class="buttons">
                <d2l-button id="btn-parent-view-3" class="left" onclick="showParentView('view3');">View 2a (parent)</d2l-button>
              </div>
              <h1>View 3</h1>
              <!-- docs: start hidden content -->
              <div class="position-display">
                <div class="col col1">
                  <div class="block">View 1</div>
                </div>
                <div class="col col2">
                  <div class="block">View 2a</div>
                  <div class="block">View 2b</div>
                </div>
                <div class="col col3">
                  <div class="block selected">View 3</div>
                  <div class="block"></div>
                  <div class="block"></div>
                  <div class="block"></div>
                </div>
              </div>
              <!-- docs: end hidden content -->
            </div>
          </d2l-hierarchical-view>
        </div>
      </d2l-hierarchical-view>
      <d2l-hierarchical-view id="view2b">
        <div class="view view2b">
          <div class="buttons">
            <d2l-button id="btn-parent-view-2b" class="left" onclick="showParentView('view2b');">View 1 (parent)</d2l-button>
          </div>
          
          <h1>View 2b</h1>
          <!-- docs: start hidden content -->
          <div class="position-display">
            <div class="col col1">
              <div class="block ">View 1</div>
            </div>
            <div class="col col2">
              <div class="block">View 2a</div>
              <div class="block selected">View 2b</div>
            </div>
            <div class="col col3">
              <div class="block">View 3</div>
              <div class="block"></div>
              <div class="block"></div>
              <div class="block"></div>
            </div>
          </div>
          <!-- docs: end hidden content -->
        </div>
      </d2l-hierarchical-view>
    </div>
  </div>
</d2l-hierarchical-view>
```

## Hierarchical View - Mixin

This mixin allows for nested views within components. To use, apply the mixin and add the `d2l-hierarchical-view-content` class to the hierarchical content in your component. Apply the hierarchical styles by including `super.styles` in your styles getter.

```js
import { HierarchicalViewMixin } from '@brightspace-ui/core/components/hierarchical-view/hierarchical-view-mixin.js';
class MyComponent extends HierarchicalViewMixin(LitElement) {
  static get styles() {
		return [ super.styles, css`
			:host {
				display: inline-block;
			}
		`];
	}

	render() {
		return html`
			<div class="d2l-hierarchical-view-content">
				<slot></slot>
			</div>
		`;
	}
}
```

### Methods

- `show`: to show child, hiding the parent (e.g., `child.show()`)
- `hide`: to hide child, showing the parent (e.g., `child.hide()`)
- `getActiveView`: get the currently active hierarchical view
- `getRootView`: get the root hierarchical view
- `isActive`: whether the specified hierarchical view is the active view
- `resize`: force resize of the hierarchical view (useful if initially not displayed when attached)

<!-- docs: start hidden content -->
### Events

- `d2l-hierarchical-view-show-start`: dispatched when child view will be shown (before animation begins)
- `d2l-hierarchical-view-show-complete`: dispatched when child view is shown (when animation ends)
- `d2l-hierarchical-view-hide-start`: dispatched when child view will be hidden (before animation begins)
- `d2l-hierarchical-view-hide-complete`: dispatched when child view is hidden (when animation ends)


## Future Enhancements

Looking for an enhancement not listed here? Create a GitHub issue!
<!-- docs: end hidden content -->
