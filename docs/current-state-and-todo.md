# Side Stash Current State and Refactor TODO

## Project Summary

Side Stash is a lightweight browser extension built with WXT for Chrome Manifest V3.

Its core workflow is:

1. Right-click on a webpage selection, link, or image.
2. Save that content into the extension.
3. Open the side panel to review, filter, copy, or delete saved items.

The project currently stores all data locally in `chrome.storage.local` and does not depend on any backend service.

## Current Tech Stack

- WXT
- TypeScript
- Chrome MV3 side panel
- Plain HTML/CSS
- Imperative DOM manipulation in the side panel
- `browser.storage.local` for persistence
- `browser.i18n` for localization

## Current Functional Scope

### 1. Save content from the page

The extension provides three context menu actions:

- Save selected text to the side panel
- Save a link to the side panel
- Save an image to the side panel

When an item is saved, the extension records:

- `id`
- `type`
- `content`
- page title
- page URL
- link URL when applicable
- image URL and alt text when applicable
- created time

### 2. Capture page context

The content script listens to the page `contextmenu` event and remembers the latest right-click target context, including:

- current page title
- link text and link URL
- image alt text and image URL

This allows the background script to save richer data when the user clicks a context menu item.

### 3. Side panel item list

The side panel currently supports:

- rendering all saved items from local storage
- showing item count
- showing item type badges: text, link, image
- showing saved time
- showing source domain
- showing image preview for image items

### 4. Filtering and search

The side panel supports:

- filtering by item type: all, text, link, image
- keyword search
- URL-based search
- clearing the current search query

The search matches against:

- item content
- page title
- page URL
- link URL
- image URL

### 5. Selection and bulk actions

The side panel supports:

- selecting individual items
- select all for the current filtered list
- bulk copy for selected items
- bulk delete for selected items

Copy behavior:

- text items copy `content`
- link items copy `linkUrl`
- image items copy `imageUrl`

### 6. Single-item actions

Each item supports:

- copy
- delete

Delete actions use a confirmation dialog before removing items.

### 7. Persistence and live updates

The extension currently:

- reads from `browser.storage.local`
- writes updated item lists back to storage
- listens to storage changes and rerenders the panel automatically

### 8. Localization

The project includes locale files for:

- English
- Japanese
- Simplified Chinese

UI text is resolved through `browser.i18n`.

## Current Code Structure

### Background layer

`entrypoints/background.ts`

- creates context menu items
- enables side panel opening behavior
- receives menu click events
- assembles saved item payloads
- persists items into local storage

### Content script layer

`entrypoints/content.content.ts`

- captures context from the last right-click target
- responds to background script messages with context data

### Side panel layer

`entrypoints/sidepanel/index.html`

- static shell for the panel UI

`entrypoints/sidepanel/main.ts`

- side panel state
- data loading and saving
- filtering logic
- selection logic
- copy and delete actions
- dialog handling
- localization application
- DOM rendering
- event binding

`entrypoints/sidepanel/style.css`

- all panel styling

## Current Strengths

- The feature set is already complete for a useful MVP.
- The product direction is clear and focused.
- The extension builds successfully.
- The codebase is small and easy to reshape.
- Background logic and content script logic are already reasonably separated.

## Current Pain Points

### 1. Side panel logic is too concentrated

`entrypoints/sidepanel/main.ts` currently mixes:

- state management
- storage access
- domain logic
- rendering
- event handling
- localization behavior

This makes iteration slower when changing UI or interaction design.

### 2. UI implementation is tightly coupled to DOM structure

The current panel relies on direct DOM querying and manual rerendering. That is workable now, but it will become harder to maintain once the UI grows more interactive.

### 3. No component model yet

There is no reusable component boundary for:

- list header
- filter bar
- item card
- bulk action bar
- empty state
- confirmation dialog

### 4. Data and view logic are not separated

Filtering, selection, copy formatting, persistence, and rendering are all colocated in the same file rather than expressed as reusable units.

### 5. The current structure will slow down a redesign

If we want to adopt React and redesign the panel, the current imperative approach will make visual and interaction changes more expensive than they need to be.

## Refactor Goal

Move the side panel from imperative DOM code to a component-based UI built with React, while preserving current functionality.

The near-term goal is not to add lots of new features.

The near-term goal is to:

- keep the current feature set working
- separate logic from presentation
- make the UI easier to redesign
- create a stable base for future features

## TODO

### Phase 1: Stabilize the current behavior

- [ ] Create a written functional checklist for the current extension behavior
- [ ] Manually verify text, link, and image saving flows
- [ ] Manually verify search, filter, select all, copy, and delete flows
- [ ] Confirm current storage item shape and treat it as the compatibility contract for migration

### Phase 2: Introduce React into the side panel

- [ ] Add React and React DOM dependencies
- [ ] Add the WXT React module
- [ ] Convert the side panel entry from `main.ts` to `main.tsx`
- [ ] Replace the current static side panel body with a React root node
- [ ] Keep background and content script behavior unchanged

### Phase 3: Extract shared types and domain logic

- [ ] Create a shared `SavedItem` type module
- [ ] Move storage read and write functions into a dedicated `storage` module
- [ ] Move filtering logic into a dedicated `items` or `selectors` module
- [ ] Move copy value formatting into a dedicated helper module
- [ ] Move hostname and time formatting into dedicated utility modules

### Phase 4: Build the first React component structure

- [ ] Create `App` as the side panel container
- [ ] Create a `Header` component
- [ ] Create a `FilterBar` component
- [ ] Create a `BulkActions` component
- [ ] Create an `ItemList` component
- [ ] Create an `ItemCard` component
- [ ] Create an `EmptyState` component
- [ ] Create a `ConfirmDialog` component

### Phase 5: Rebuild current behaviors in React

- [ ] Load items from storage on startup
- [ ] Listen to storage changes and sync UI state
- [ ] Reimplement type filtering
- [ ] Reimplement keyword and URL search
- [ ] Reimplement item selection
- [ ] Reimplement select all for filtered items
- [ ] Reimplement single-item copy
- [ ] Reimplement bulk copy
- [ ] Reimplement single-item delete with confirmation
- [ ] Reimplement bulk delete with confirmation
- [ ] Reimplement count display and empty state

### Phase 6: Preserve localization support

- [ ] Move i18n access behind a small helper API
- [ ] Reconnect all existing localized strings in the React UI
- [ ] Verify English, Japanese, and Simplified Chinese still render correctly

### Phase 7: Redesign the UI

- [ ] Define a clearer visual direction for the side panel
- [ ] Redesign information hierarchy for scanning saved items
- [ ] Improve filter and bulk action affordances
- [ ] Improve empty state, status feedback, and dialog styling
- [ ] Improve mobile-like narrow panel ergonomics

### Phase 8: Cleanup after migration

- [ ] Remove obsolete imperative DOM code
- [ ] Remove unused HTML structure from `index.html`
- [ ] Trim dead utilities or compatibility glue
- [ ] Rebuild and verify the production bundle
- [ ] Update `README.md` to reflect the new architecture

### Future ideas

- [ ] Add a privacy-conscious way to aggregate which websites users save from most often
- [ ] Handle image items separately so users can batch-download images instead of only copying their URLs

## Suggested Initial File Structure After Migration

```text
entrypoints/
  background.ts
  content.content.ts
  sidepanel/
    index.html
    main.tsx
    App.tsx
    style.css
    components/
      Header.tsx
      FilterBar.tsx
      BulkActions.tsx
      ItemList.tsx
      ItemCard.tsx
      EmptyState.tsx
      ConfirmDialog.tsx
    lib/
      storage.ts
      items.ts
      format.ts
      i18n.ts
    types.ts
```

## Recommended Execution Order

1. Add React and wire up the side panel entry.
2. Extract data logic before doing any major visual redesign.
3. Rebuild the current UI behavior in React.
4. Verify that behavior matches the current extension.
5. Start the new visual redesign only after the React structure is stable.

## Notes

- The `legacy/` directory appears to be an older non-WXT implementation and can stay untouched during the first refactor pass.
- The safest migration path is to keep background and content-script logic stable and focus only on the side panel first.
- If we keep the saved item shape unchanged, user data in local storage should remain compatible through the UI migration.
