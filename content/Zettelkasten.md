---
publish: true
created: 2026-08-01T17:19:08.558Z
modified: 2026-08-09T20:03:30.486Z
published: 2026-08-09T20:03:30.486Z
---

[Zettelkasten](https://en.wikipedia.org/wiki/Zettelkasten) is a note management system emphasizing links instead of folders. It is a scalable tool for learning, remembering and writing

What you see below are atomic notes - "tweet"sized pieces of information and opinions I find interesting.

To learn how to use Zettelkasten see [[How to learn using obsidian]]

# Recently added atomic notes

```dataview
TABLE WITHOUT ID
file.link AS "Name",
replace(dateformat(file.ctime, "MMM dd, yyyy"), " ", " ") AS "Created"
WHERE contains(file.tags, "#atomic")
SORT file.ctime DESC
LIMIT 10
```
