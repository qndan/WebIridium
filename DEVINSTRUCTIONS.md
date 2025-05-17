# getting icons

1.  Get icons from this website: https://icon-sets.iconify.design/fluent/.
    Use fluent ui system icons, prefer filled icons.
2.  When you pick an icon, click it, make sure the color is "currentColor" so it inherits the color of whatever you put it in.
3.  Copy and paste the SVG it into a component (inside `/src/icons`). We have to do this so the "currentColor" works.

# third-party stuff

`libantimony` and `copasijs` have been vendored in the `public/` directory.
They should be used by interfacing with the `public/simulationWorker.ts` worker. This is in part to keep the global state of these
dependencies isolated from the rest of the code. It also helps us because our linter can't handle the weird stuff we have to do
to interact with them.

# workers

We have web workers located in `public/`. I put them in `public/` so they can access the third party dependencies. If you are adding
new workers, make sure to name them "<name>Worker.ts" so that they get included in our `tsconfig.app.json` and get typechecked.
