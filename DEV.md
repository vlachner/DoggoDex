# Developer Journal

Documenting steps and important design decisions.

- Expanded the ESLint configuration as per the README from the Vite Template (React+Typescript) (`eslint.config.js`)

  - Updating configuration to enable type-aware lint rules
  - Added Additional Plugins for React-specific lint rules

- Adding Tailwind CSS

- Update `index.html`

  - Update Title
  - Update Favicon to custom icon
  - Description for standard SEO, Improve the preview link when shared.

- Folder Structure and scaffolding (e.g. Components, Pages, Types)
- Starting with HomePageComponent in `/pages` basic layout and testing out Tailwind utility classes.

- Install `Axios`, setup simple service.

  - Initial method to Get dog breed list from, `https://api.thedogapi.com/v1`
  - API Key Hardcoded, will be moved to secure location.

- Creating an interface for `Breed` to have stricter types with the api response.

- Initial setup for Router

  - Install `react-router-dom`, setup Router in `App.tsx` for different Page components.
  - Setup routes for the `HomePage` and the `BreedDetailPage`.
  - Making use of `useParams` to have an `id` to be able to load the details page if accessed directly.

## Basic list

- Basic structure for `BreedCard` component, simple card to display some stats and image.

  - Using `breed` as a prop of type `Breed`, make use of the objects properties. (e.g `id`,`name`,`breed_group`, `reference_image_id` to fetch from CDN as per docs.)

- Setup Redux
  - Install `react-redux` and `@reduxjs/toolkit`.
  - Setup simple store in `/redux/store.ts`, using `configureStore` from the toolkit
- Redux Slice for Dog Breeds `breedsSlice`

  - Typed wrappers around React Redux standard hooks as per https://redux.js.org/tutorials/typescript-quick-start#define-root-state-and-dispatch-types
    - `useAppDispatch` knows the shape of the Redux dispatch function from the store (AppDispatch). So any dispatched actions are type-checked and auto-completed correctly.
    - `useAppSelector` typed version of useSelector tied to app’s root state (RootState)
  - Created functions using `createAsyncThunk` from the redux toolkit, to incorporate standard recommended approach for handling async request lifecycles.
    - `fetchBreedsAsync`: fetches paginated breed data.
    - `searchBreedsAsync`: searches breeds by query (Will be used when implementing search bar.)
  - Used `createSlice` with `extraReducers` to manage the lifecycle (pending, fulfilled, rejected) of both thunks.

- Leveraged `status` from the breed slice to control UI rendering states user feedback for async operations

  - `loading` displays `<LoadingSpinner />`
  - `failed` shows `<ErrorMessage />` with error from state

- Using `useEffect` to dispatch `fetchBreedsAsync` when status is `idle` to load first page.

### Pagination & Search

- Implemented `<Pagination />` component to navigate results.

  - Pagination buttons are dynamically rendered based on currentPage from state.
  - A max of 5 page numbers are shown at once, adjusting window based on current page to keep it centered.
  - On page change dispatches `setCurrentPage` and `fetchBreedsAsync` with new page.

- Implemented `<SearchBar />` component for filtering breeds by name.

  - Uses local state for 500ms debounce to delay dispatching search actions.
  - Dispatches `searchBreedsAsync` only when debounced query differs from current Redux searchQuery.
    - Prevents excessive API calls

#### Limitations and Future Work

- The Dog API does not return totalPages or total count of items in its response. As a work around, I hardcoded the total count (172 breeds) and calculated totalPages.
- For the search enpoint, the API returns all results without pagination. To prevent excessive rendering, I limited search results on the service.
- Despite these API limitations, I retained the pagination and search component to:
  - Demonstrate use of API parameters (page, limit)
  - Showcase UI interaction with Redux and thunk-based async actions

## Breed Detail Page

- `BreedDetailPage` fetches and displays detailed info for a dog breed based on the route id parameter.
  - image loading with error states and fallbacks
  - Display additional breed attributes in a different structure.
  - Includes graceful loading and error handling with existing components (`LoadingSpinner`, `ErrorMessage`).
- Added routing to the `BreedCard` using `` <Link to={`/breed/${breed.id}`} ``

## Collections (Feature)

Aims to add a new feature that enables users to organize breeds into 3 categories/collections making use of the global store.

- `wishlist`: breeds they are interested in
- `readyToAdopt`: breeds they are prepared to adopt (Similar to "add to cart" logic)
- `owned`: breeds they currently own

- Each collection is an array of CollectionItem objects (subset of Breed data). Added aditional interface `CollectionItem`

- Added actions to `BreedCard`. Collection Toggle Footer Controls

  - Added a footer with action buttons to the breed card.
  - Buttons allow toggling the breed into “wishlist” and “ready to adopt”.
    - "Owned" won't be able to be toggled directly, but rather from an adoption process.

- `handleCollectionToggle` to manage Redux state updates for collection add/remove.
- `isInCollection` utility function to check the state of collections, determine button state and styles

### Collections State

- Created a Redux slice `collectionsSlice` to manage user-defined breed collections globally.
- `owned`, `wishlist`, and `readyToAdopt` as arrays of `CollectionItem`
- Implemented:
  - `addToCollection` – Adds a breed to a collection if it’s not already present.
  - `removeFromCollection` – Removes a breed from a specific collection by itemId.
- Prevents duplicates in collections using ID checks before insertion.

### `CollectionTabs` and `activeCollection`

- `activeCollection` and `setActiveCollection` implemented in the `collectionsSlice`
- `CollectionTabs` Component for a tabbed UI for filtering breeds
  - Dispatches `setActiveCollection` to update the active filter.
- Reads `activeCollection` and collection counts from the Redux store.

- A bit of refactor with the search bar to support responsive layout with flex.

### `CollectionList`/`CollectionCard` Component

- Renders the list of breeds within a selected collection
- Since breeds are stored locally in the Redux store, no external fetching or API calls are required. But will implement a different card for the subset of attributes as well as a button to remove from the collection.
- Displays an empty state if the collection is empty
- Renders a responsive grid of `CollectionCard` components for each breed in a collection.
- Added button to card that uses `removeFromCollection`

### Adopt Now (Feature)

- Added an "Adopt Now" button for the `readyToAdopt` collection.
- Triggers a confirmation dialog.
  - Tailwind CSS utility classes to create a custom dialog.
- Dispatches `adoptBreeds` to move items from `readyToAdopt` to `owned`.

## Final touches

- Search bar should be hidden for collections.
- Owned dogs can't be removed from collection (User can't abandon dogs)
- Added toggle buttons to the `BreedDetailPage` header.
- Added a few more Tailwind utility classes to improve responsive design.
- Added cute shake animation on hover to `BreedCard` (Dogs are excited to get adopted.)
- Clean up of unnecesary imports and classes.

## Test Setup - Unit Tests

- Installed `vitest` as a dev dependency and added the `test` script.
- As per docs and the React project example in https://github.com/vitest-tests/browser-examples/tree/main/examples/react

  - Created `vitest.config.ts` file.
    - Add vitest types to tsconfig.json

- Added unit testing to Card components (`BreedCard`, `CollectionCard` and `Pagination`)
  - Added `data-testid` attributes to query parts of components more reliable.
- Added unit tests for both slices (`breedSlice`, `collectionsSlice`)

## Deployment (Netlify)

- Deploy to new netlify project using `netlify-cli`, setting up the environment variable for the API.
