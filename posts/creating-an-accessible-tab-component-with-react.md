---
date: 2016-11-04
category: components
tags:
 - react
 - accessibility
 - components
abstract: How to create an accessible tab component with React.
---
# Creating an accessible tab component with React

I'm probably the last person to realize this; but React is really great! The last few weeks I've been playing with it, 
and so far it's been a really enjoyable experience.

I've been wanting to use it for something, and since another of my favorite topics is accessibility, I thought I should try to create a few different accessible components.
It will mainly serve as a way for me to increase my React knowledge, but will hopefully be useful to others in the end.

The first component I decided to create is a tab list. I will include working examples from CodePen so that you can try out the difference between an accessible tab component and an inaccessible component. If you are using a Mac, I recommend you try it with [VoiceOver](http://www.apple.com/voiceover/info/guide/) as well.

## Inaccessible tabs

The first step is to create the basic structure for the tabs. In React I want something like this:

<script src="https://gist.github.com/andreasmcdermott/22a29c830ef45bb1e09c6ce0e3bace68.js"></script>

I want that to generate HTML like this:

<script src="https://gist.github.com/andreasmcdermott/6fb739af82621b1bb01c4046fffe5d74.js"></script>

The first example (see below) is probably where a lot of people would stop. You can click each tab and it will display the corresponding tab panel. There is some default keyboard support; the user can move between the tabs using the tab-key and hit Enter to select a tab. But a blind user would never know that it is a list of tabs he/she is interacting with.

<p data-height="480" data-theme-id="0" data-slug-hash="dObbeE" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React - step 0" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/dObbeE/">Accessible tab component in React - step 0</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Adding the correct roles

If you try the next example you'll notice that the screen reader now correctly reads "tab 1 of 3" when on the first tab. This is achieved by assigned the elements their correct roles. 

There are a lot of roles. Some roles have dedicated elements (like `<button>` automatically has `role="button"`). Other roles have no corresponding elements (like tabs). The roles we'll use are "tab", "tablist" and "tabpanel".

Elements with `role="tab"` has to be the direct children of an element with `role="tablist"`. As you could see in my example above, this isn't the case. The `<ul>` will be the tablist, and the link will be the tab. To get around that I can assign `role="presentation"` to the list item. That tells the screen-reader that the element can be ignored. Without the presentation role, each list item would be considered its own group of tabs. So each tab would be "tab 1 of 1".

After applying the correct roles, our HTML structure is:

<script src="https://gist.github.com/andreasmcdermott/7854fbd023f498e6dd6dbc93513e5aa8.js"></script>

The result is immediately a lot better and more accessible than the initial version. But we are still missing some necessary aria attributes and proper keyboard navigation.

<p data-height="480" data-theme-id="0" data-slug-hash="BQBBMQ" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React - step 1" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/BQBBMQ/">Accessible tab component in React - step 1</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Aria attributes

There are a lot of different aria attributes. Some can be used on any element, others are intended for elements with specific roles. We will use `aria-hidden` and `aria-labelledby` which are general attributes (can be used anywhere). We will also use `aria-selected` and `aria-controls` which are used for interactable elements.

`Aria-hidden="true"` is the equivalent of `display: none` for the screen-reader. We are already hiding the inactive tabpanels using `display: none` and screen-readers should consider these elements hidden as well, but I've had issues with certain screen-readers ignoring this in the past. To avoid that I'm adding `aria-hidden="true"` as well to the inactive tabpanels. 

When the screen-reader highlights the tabpanel, we want it to include the tab's title. That is what `aria-labelledby` is for. The value of the attribute should be the id of the tab. `Aria-label` can be used for the same purpose. The difference is that it takes the label text instead (but because we don't want to duplicate the tab title, `aria-labelledby` is a better choice here).

`Aria-selected="true"` is added to tell the screen-reader which tab is active. It is important that the inactive tabs have `aria-selected="false"`. `Aria-controls` is not strictly needed here, but I'm adding it anyway. Both `aria-controls` and `aria-labelledby` are used to associate the tabpanel with its tab. I've already added `aria-labelledby`, but it doesn't hurt to add `aria-controls` as well.

The rendered HTML will now be:

<script src="https://gist.github.com/andreasmcdermott/f8b4ba30d9898f0e281edcaac0075f99.js"></script>

And the example:

<p data-height="480" data-theme-id="0" data-slug-hash="YpKKmX" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React - step 2" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/YpKKmX/">Accessible tab component in React - step 2</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## Keyboard navigation

This is the last step to make the tabs fully accessible. The WCAG has specified how keyboard navigation should work for different components. For tabs there are mainly two things to consider:

1. When the user uses the tab-key to enter a tablist, focus should be placed on the active tab. Hitting the tab-key again should leave the tablist.
2. Left and right arrow keys should navigate between the tabs in a tablist.

WCAG also specified that when using the arrow keys to move between the tabs, the tab should also be automatically activated. I've seen other sites that recommend that moving left and right only highlights the tab, and enter- or space-key is required to select the tab. I've chosen to follow WCAG's recommendation here.  

For the first item, we will add `tabindex="-1"` to any inactive tab. "-1" tells the browser that the element should be removed from the tab order (but still focusable from javascript, which will be useful for other components). The active tab will have `tabindex="0"` which tells the browser that the element should be added to the tab order. It is also possible to set a value greater than 0, but it is not recommended since that will alter the natural tab order.

This is the final HTML structure:

<script src="https://gist.github.com/andreasmcdermott/768b815a6dca47fb91564c01b701bd68.js"></script>

You can try the final example below:

<p data-height="480" data-theme-id="0" data-slug-hash="GjVVWB" data-default-tab="result" data-user="andreasmcdermott" data-embed-version="2" data-pen-title="Accessible tab component in React" class="codepen">See the Pen <a href="http://codepen.io/andreasmcdermott/pen/GjVVWB/">Accessible tab component in React</a> by Andreas McDermott (<a href="http://codepen.io/andreasmcdermott">@andreasmcdermott</a>) on <a href="http://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

That's it. We now have fully accessible tabs. I hope you learned something!
Feel free to use this on your site. 

And if you have any suggestions on how my component could be improved or any other comments, just tweet at me!

I would also appreciate suggestions on what component I should implement next! 