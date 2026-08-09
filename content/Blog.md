---
publish: true
created: 2026-08-03T19:19:03.497Z
modified: 2026-08-09T18:32:54.695Z
published: 2026-08-09T18:32:54.695Z
cssclasses:
  - hideDate
  - hideReadTime
---

# List of all posts

```dataview
TABLE WITHOUT ID
  file.link AS "Name",
  dateformat(file.ctime, "MMM dd, yyyy") AS "Created"
FROM ""
WHERE up = [[Blog]] OR contains(up, [[Blog]])
SORT file.ctime DESC
```
