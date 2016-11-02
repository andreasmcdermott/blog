---
date: 2016-11-01
category: accessibility
tags:
 - react
 - accessibility
 - components
abstract: Creating an accessible tab component in React.
---
## Accessible tab component in React.

I'm probably the last person to realize this; but React is a really great framework! The last few weeks I've been playing with it, 
and so far it has been a really enjoyable experience.

Another favorite topic of mine is accessibility. So I thought I should try to create a library of accessible components in React.
It will both serve as a way for me to deepen my React knowledge, but might hopefully also provide something useful to others in the end.

The first component I decided to create is a tab list (scroll to bottom to see the finished example).

### Inaccessible tabs

The first step is to create the basic structure for the tabs. You can click each tab and it will display the corresponding tab panel.
There is some keyboard support. The user can move between the tabs using the tab-key and hit Enter to select a tab. But a blind user
would never know that it is a list of tabs he/she is interacting with.

<p data-height="540" data-theme-id="0" data-slug-hash="dObbeE" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React - step 0" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/dObbeE/">Accessible tab component in React - step 0</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Adding the correct roles

If you try the next example you'll notice that the screen reader now correctly reads "tab 1 of 3" when on the first tab.

First, I added role="tablist" to the list. I also added role="tab" to each link. It is also important to add role="presentation" to
each list item. An element with role "tab" has to be directly nested in an element with a role "tablist".
Without the presentation role, each list item will be considered its own group of tabs. So each tab will be "tab 1 of 1". "Presentation"
tells the screen reader to ignore the element, because it's only purpose is to provide structure to the html.

Finally I added role="tabpanel" to each tab panel. That's it. The result is a lot better and more accessible than the initial version.
But we are still missing necessary aria attributes and some keyboard navigation.

<p data-height="540" data-theme-id="0" data-slug-hash="BQBBMQ" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React - step 1" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/BQBBMQ/">Accessible tab component in React - step 1</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Aria attributes

I begin with adding aria-hidden="true" to the hidden tabpanels. We use this attribute to also apply "display: none" in the css.
According to the specification, "display: none" should be hidden from screen readers, but I've had issues with Jaws reading hidden elements in the past.

I also add aria-labelledby to the tabpanel. The attribute value should be the id value of the corresponding tab. This will ensure that the screen reader
reads the correct title when focusing the tabpanel.

Two attributes are needed on the tabs. The first is aria-selected="true" on the active tab. This can also be used to style the active tab.
Aria-controls is not strictly needed if aria-labelledby is used on the tabpanel, but I still add it. The attribute should reference the id
of the corresponding tabpanel.

<p data-height="540" data-theme-id="0" data-slug-hash="YpKKmX" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React - step 2" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/YpKKmX/">Accessible tab component in React - step 2</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

### Keyboard navigation

This is the last step to make the tabs fully accessible. The first change is to add tabindex="0" to the active tab and tabindex="-1" to all other tabs.
This is because only when the user tabs into the tablist, he/she should land on the active tab. If the user hits tab-key again, he/she should leave
the tablist instead of moving to the next tab.

To move within the tablist, the user should use left and right arrow keys. When moving to the next or previous tab, it should also be automatically activated.

<p data-height="540" data-theme-id="0" data-slug-hash="GjVVWB" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/GjVVWB/">Accessible tab component in React</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

That's it. We now have fully accessible tabs. I hope you learned something!
Feel free to use this on your site. 

And if you have any suggestions on how my component could be improved or any other comments, just tweet at me!
 