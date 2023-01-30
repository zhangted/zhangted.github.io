---
title: "My Title Here!"
date: 2021-06-21
author: 'Ted'
tags: ["Gatsby", "JavaScripts", "GraphQL", 'Blog']
---
# Blog engine

- [x] Load markdown files locally into browser editor.
- [x] Save content of edited posts
- [x] add unsaved changes msgs (tab exit, on file change)
- [ ] create new file
- [ ] rename file
- [x] svg refactors
- [x] basic search through markdown files with precompiled indexes
- [x] View your posts
- [x] Compile markdown files mapping on node server before building
- [x] Statically generate the website by importing markdown files through url params
- [x] show id/heading tags for each markdown page
- [x] preprocess + extract metadata from markdown files
- [ ] tidy up metadata into separate json dicts
- [ ] break up overflow tags on sidebar better
- [x] move metadata+headings to sidebar class
- [ ] view by tags/topics page
- [ ] group by date metadata for each markdown file
- [ ] impl react.context dark mode

## Setup

Navigate to project directory.
Install node
```
  nvm use 16.14
```
Install packages
```
  npm install
```
Start react + http server to access the local editor
```
  npm start
```

## Gen. Static Site
Put markdown pages in the `src/posts` folder

    ├── src                     # Frontend files
      └── posts                 # Markdown files
        └── example.md
        └── example2.md
    ├── build                   # Compiled website

Generate the static pages:
```
  npm build
```
Test serve the pages:
```
  serve -s build
```

## Markdown Tags Supported
Example:
```
---
title: "Title"
date: 0000-12-31
author: 'Author'
tags: ["Tag1", "Tag2"]
---
```

### Frontend
`./src`

### Backend
`./backend`
- Allows saving edited md files to disk.
- Precompile search indexes for `lunr`
- Precompile list of md files
- Precompile metadata in md files