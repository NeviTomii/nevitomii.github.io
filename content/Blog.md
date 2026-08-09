---
publish: true
created: 2026-08-03T19:19:03.497Z
modified: 2026-08-09T19:07:27.862Z
published: 2026-08-09T19:07:27.862Z
cssclasses:
  - hideDate
  - hideReadTime
---

# List of all posts

```dataview
TABLE dateformat(file.ctime, "MMM dd, yyyy") AS "Created"
FROM [[Blog]]
WHERE up
SORT file.ctime DESC
```
