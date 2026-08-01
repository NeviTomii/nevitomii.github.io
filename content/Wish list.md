---
up:
  - "[[Hobbies]]"
---
# What i want to receive as a gift?

- 
## Books

- mars knížky jenom ty s novějším cover artem

~~~dataview
table without id
file.link as "Title",
author, pages, want-to-buy
from #Book AND -"templates" WHERE want-to-buy = true
sort author desc
~~~

