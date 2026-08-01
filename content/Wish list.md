---
publish: true
created: 2026-08-01T16:14:46.292Z
modified: 2026-08-01T16:04:29.716Z
published: 2026-08-01T16:04:29.716Z
up:
  - "[[Hobbies]]"
---

# What i want to receive as a gift?

-

## Books

- mars knížky jenom ty s novějším cover artem

```dataview
table without id
file.link as "Title",
author, pages, want-to-buy
from #Book AND -"templates" WHERE want-to-buy = true
sort author desc
```
