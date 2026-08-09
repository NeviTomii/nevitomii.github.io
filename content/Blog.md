---
publish: true
created: 2026-08-03T19:19:03.497Z
modified: 2026-08-09T17:54:14.930Z
published: 2026-08-09T17:54:14.930Z
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
