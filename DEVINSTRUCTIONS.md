# getting icons

1.  Get icons from this website: https://icon-sets.iconify.design/fluent/.
    Use fluent ui system icons, prefer filled icons.
2.  When you pick an icon, click it, make sure the color is "currentColor" so it inherits the color of whatever you put it in.
3.  Copy and paste the SVG it into a component (inside `/src/icons`). We have to do this so the "currentColor" works.

# third-party stuff

`libantimony` and `copasijs` have been vendored in.

Bindings and stuff for them are located in `src/third_party/`
Additional files for them are in `public/`

Some bindings were rewritten to be more usable. These bindings may have to be updated when updating these dependencies.
