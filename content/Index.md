---
publish: true
title: Hi, I'm Tomo
created: 2026-08-09T09:37:37.140Z
modified: 2026-08-09T19:19:04.080Z
published: 2026-08-09T19:19:04.080Z
cssclasses:
  - hideReadTime
  - hideDate
up:
---

My full name is Tomáš Zamouřil. I work as an accountant and in my free time I like to explore whatever [[Hobbies|captures my interest]]

I am good at forgetting things, so I made this note vault to preserve ideas worth remembering. Those over time develop into [[Zettelkasten|Opinions]], and those with some (huge amounts of) luck later become [[Blog|Blogposts]].

You can reach me on [X](https://x.com/NeviTomii), or by email at tomas.zamouril@gmail.com

## Most recent blogposts

```dataviewjs
const blogposts = dv.pages('[[Blog]]')
  .where(page => page.up)
  .sort(page => page.file.ctime, "desc")
  .array()
  .slice(0, 3);

dv.table(
  ["Name", "Created"],
  blogposts.map(page => [
    page.file.link,
    page.file.ctime.toFormat("MMM dd, yyyy")
  ])
);
```

### Click [[Blog|Here]] for more

---

If you're interested in knowing how I set this website up for free see [[Blog structure]]
