---
publish: true
created: 2026-08-03T19:19:03.497Z
modified: 2026-08-09T19:19:37.071Z
published: 2026-08-09T19:19:37.071Z
cssclasses:
  - hideDate
  - hideReadTime
---

# List of all posts

```dataviewjs
const blogposts = dv.pages('[[Blog]]')
  .where(page => page.up)
  .sort(page => page.file.ctime, "desc")
  .array();

dv.table(
  ["Name", "Created"],
  blogposts.map(page => [
    page.file.link,
    page.file.ctime.toFormat("MMM dd, yyyy")
  ])
);
```
