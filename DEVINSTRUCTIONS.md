# general

## testing

Run `npm run test` to run the test suite. Run `npm run coverage` to generate a coverage report which you can view in `/coverage/index.html`. We use Vitest + React Testing Library for tests.

Try to add tests for every change you make, as much as is reasonable.

If you would like to test how the site would work when deployed on GitHub Pages, do `npm run build` then `npm run preview` which should simulate the final result pretty well.

### resources for testing

- philosophy: https://testing-library.com/docs/guiding-principles
- examples: https://testing-library.com/docs/react-testing-library/example-intro
- queries: https://testing-library.com/docs/queries/about
- list of DOM matchers: https://github.com/testing-library/jest-dom

## code style

- Run `npm run format` to reformat your code.
- Run `npm run lint` to run the linter. Use `npm run lint:fix` to accept any automatic fixes it offers.
- Avoid commenting obvious stuff.

# specific stuff

## getting icons

1.  Get icons from this website: https://icon-sets.iconify.design/fluent/.
    Use fluent ui system icons, prefer filled icons.
2.  When you pick an icon, click it, make sure the color is "currentColor" so it inherits the color of whatever you put it in.
3.  Copy and paste the SVG it into a component (inside `/src/icons`). We have to do this so the "currentColor" works.

## third-party stuff

`libantimony` and `copasijs` have been vendored in the `public/` directory.
They should be used by interfacing with the `features/simulation.ts` module which interacts with the `public/simulationWorker.js` worker to run these libraries.

## workers

We have web workers located in `public/`. I put them in `public/` so they can access the third party dependencies (those dependencies
import relative to the worker file, so it has to be at root). Unfortunately, this means we cannot include workers in our
build step.
