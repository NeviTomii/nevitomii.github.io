---
publish: true
---

this is a parent note for books, ownership status and wish list will be in the properties, wish list also exported [[Wish list|here]]
For non-book reading see [[World opinions#Where to find information]]

# Books I want to read

for more inspiration on what to read visit [casey Handmer's blog](https://caseyhandmer.wordpress.com/2020/07/26/book-reviews/)

table test change

```dataview
table without id
file.link as "Title",
author, pages
from #Book AND -"templates" WHERE Read = false
sort pages desc
```

# All books ordered by rating

```dataviewjs
// 1. Fetch, filter for all books with a rating, and convert to standard array
const books = dv.pages('#Book and -"templates"')
    .where(b => b.rating && b.rating > 0)
    .sort(b => b.rating, 'desc')
    .array();

// 2. Calculate the dynamic sum of all pages across all years safely
const totalPages = books.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);

// 3. Render the table with a plain Title header and dynamic pages header
dv.table(
    ["Title", "author", `pages (${totalPages.toLocaleString()})`, "rating", "Times read"],
    books.map(b => [
        b.file.link,
        b.author,
        b.pages,
        b.rating,
        b['years-read'] ? (Array.isArray(b['years-read']) ? b['years-read'].length : 1) : 0
    ])
);

```

# Books read in 2027

```dataviewjs
// 1. Fetch, filter for books read in 2026, and convert to standard array
const books = dv.pages('#Book and -"templates"')
    .where(b => {
        // Ensure book has a rating > 0
        if (!b.rating || b.rating <= 0) return false;
        
        // Ensure the years-read list property exists
        if (!b['years-read']) return false;
        
        // Convert to array if it isn't one, then check for 2027 as a number OR string
        const years = Array.isArray(b['years-read']) ? b['years-read'] : [b['years-read']];
        return years.some(y => String(y).trim() === "2027");
    })
    .sort(b => b.rating, 'desc')
    .array();

// 2. Calculate the dynamic sum of pages read in 2026 safely
const totalPages = books.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);

// 3. Render the table with a plain Title header and dynamic pages header
dv.table(
    ["Title", "author", `pages (${totalPages.toLocaleString()})`, "rating", "Times read"],
    books.map(b => [
        b.file.link,
        b.author,
        b.pages,
        b.rating,
        b['years-read'] ? (Array.isArray(b['years-read']) ? b['years-read'].length : 1) : 0
    ])
);

```

# Books read in 2026

```dataviewjs
// 1. Fetch, filter for books read in 2026, and convert to standard array
const books = dv.pages('#Book and -"templates"')
    .where(b => {
        // Ensure book has a rating > 0
        if (!b.rating || b.rating <= 0) return false;
        
        // Ensure the years-read list property exists
        if (!b['years-read']) return false;
        
        // Convert to array if it isn't one, then check for 2026 as a number OR string
        const years = Array.isArray(b['years-read']) ? b['years-read'] : [b['years-read']];
        return years.some(y => String(y).trim() === "2026");
    })
    .sort(b => b.rating, 'desc')
    .array();

// 2. Calculate the dynamic sum of pages read in 2026 safely
const totalPages = books.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);

// 3. Render the table with a plain Title header and dynamic pages header
dv.table(
    ["Title", "author", `pages (${totalPages.toLocaleString()})`, "rating", "Times read"],
    books.map(b => [
        b.file.link,
        b.author,
        b.pages,
        b.rating,
        b['years-read'] ? (Array.isArray(b['years-read']) ? b['years-read'].length : 1) : 0
    ])
);

```

# Books read in 2025

```dataviewjs
// 1. Fetch, filter for books read in 2026, and convert to standard array
const books = dv.pages('#Book and -"templates"')
    .where(b => {
        // Ensure book has a rating > 0
        if (!b.rating || b.rating <= 0) return false;
        
        // Ensure the years-read list property exists
        if (!b['years-read']) return false;
        
        // Convert to array if it isn't one, then check for 2025 as a number OR string
        const years = Array.isArray(b['years-read']) ? b['years-read'] : [b['years-read']];
        return years.some(y => String(y).trim() === "2025");
    })
    .sort(b => b.rating, 'desc')
    .array();

// 2. Calculate the dynamic sum of pages read in 2026 safely
const totalPages = books.reduce((sum, b) => sum + (Number(b.pages) || 0), 0);

// 3. Render the table with a plain Title header and dynamic pages header
dv.table(
    ["Title", "author", `pages (${totalPages.toLocaleString()})`, "rating", "Times read"],
    books.map(b => [
        b.file.link,
        b.author,
        b.pages,
        b.rating,
        b['years-read'] ? (Array.isArray(b['years-read']) ? b['years-read'].length : 1) : 0
    ])
);

```
