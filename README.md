# MSMS Website

Source for the Maliyadeva Simulation & Modelling Society's website.
Published via GitHub Pages. Built with Jekyll.

This README is for anyone who needs to update the site — add an event,
edit a page, fix a typo, or add a document. You don't need to know
Jekyll, Ruby, or how GitHub Pages works to do any of that. You need to
know which file to open and what to type.

If you're new: start with **Common tasks**. Read **How the site is
structured** when you need to understand why things are where they are.
The rest is reference.

---

## Contents

1. [Common tasks](#common-tasks)
   - [Add an event](#add-an-event)
   - [Edit a page](#edit-a-page)
   - [Add a new page](#add-a-new-page)
   - [Add a resource page](#add-a-resource-page)
   - [Update the join form](#update-the-join-form)
   - [Add a governing document](#add-a-governing-document)
2. [How the site is structured](#how-the-site-is-structured)
3. [The design system](#the-design-system)
4. [Deploying](#deploying)
5. [If something breaks](#if-something-breaks)

---

## Common tasks

### Add an event

Open **`_data/events.yml`** and copy an existing block. Edit the values.

```yaml
- date: 2026-11-12
  title: Your session title
  summary: >
    One or two sentences. You can wrap this across multiple
    lines in the file — it joins into one paragraph when shown.
  type: Workshop
  notes: Optional. Only appears on the "next session" card.
```

**The date format is `YYYY-MM-DD`.** Get this right. Everything else
is forgiving, but a bad date puts the event in the wrong section.

Save, commit, push. Jekyll sorts automatically:

- The next upcoming event becomes the large featured card.
- Later events appear in the "Upcoming" list.
- Events whose date has passed move to "Past sessions" on their own.

**You never need to edit `events.html`.** It reads `_data/events.yml`
and builds the page from that. Adding an event is a one-file edit.

Optional fields:

| Field | Default if omitted |
| --- | --- |
| `time` | `3:30–5:00 PM` |
| `location` | `Room 214` |
| `type` | not shown |
| `notes` | not shown |

Order doesn't matter in the file — Jekyll sorts by date.

---

### Edit a page

All content lives in the `.html` files at the repository root and in
`resources/`. Open the file, find the text, change it, save, push.

| File | What it is |
| --- | --- |
| `index.html` | Home |
| `about.html` | About the society |
| `events.html` | Events (reads `_data/events.yml` — usually don't edit) |
| `join.html` | Join / application |
| `404.html` | Page-not-found |
| `resources/index.html` | Resources landing page |
| `resources/getting-started.md` | Getting started guide |
| `resources/external.md` | External reading list |
| `resources/linux.md` | Linux recommendation |

**Do not** add `<!DOCTYPE html>`, `<head>`, `<body>`, a header, a
footer, or `<script>` tags to any of these. The layout
(`_layouts/default.html`) provides all of that. Files at the root
contain only the front matter and the content that goes inside
`<main>`.

---

### Add a resource page

The `resources/` folder is written in **markdown**, not HTML, because
it's the part of the site meant to grow. Guides, reading lists, notes,
explanations — anything that reads like a document rather than a
brochure page — goes here.

**Why markdown for this and HTML for everything else?** The root
pages (`index.html`, `about.html`, `join.html`) are fixed layouts with
specific structure. The resources are content: they'll accumulate,
get edited, get rewritten, get new sections added by people who
shouldn't have to think about `<div class="wrap">` and
`<section class="panel">`. Markdown lets you write a heading with `##`
and a list with `-` and be done.

#### Adding a page

1. Create a new `.md` file in `resources/`. Use lowercase and hyphens:
   `debugging-tips.md`, not `DebuggingTips.md`.

2. Add front matter and content:

   ```markdown
   ---
   layout: prose
   title: Debugging tips
   description: One sentence for search engines.
   ---

   <p class="eyebrow">Resources · Debugging</p>

   # Debugging tips

   Intro paragraph.

   ## A section

   Normal markdown from here. Lists, **bold**, [links](https://example.com),
   `code`, blockquotes, tables, code blocks — all work.

   ## Another section

   More content.
   ```

3. Add a link in `resources/index.html` so people can find it. Open
   the file, find a suitable panel, and copy the button pattern:

   ```html
   <p><a class="btn" href="{{ '/resources/debugging-tips.html' | relative_url }}">Read →</a></p>
   ```

   Or add it as a card in an existing panel. Either works.

4. Commit and push.

#### What the markdown gives you

The `layout: prose` front matter wraps your content in the site's
typography for long-form reading: serif body text, restrained
headings, hairline rules between sections, clean tables and lists.
You don't write any of that — just the markdown, and the styling
comes for free.

Supported out of the box:

| You write | You get |
| --- | --- |
| `# Heading` | The page title (use once) |
| `## Heading` | A section with a top border and letter-spacing |
| `### Heading` | A subsection |
| `- item` | A bulleted list |
| `1. item` | A numbered list |
| `**bold**`, `*italic*` | Emphasis |
| `[text](url)` | A link |
| `` `code` `` | Inline code |
| ` ``` ` fenced blocks | Code blocks |
| `> quote` | A blockquote |
| ` | a | b | ` tables | A styled table |
| `---` on its own line | A horizontal rule |

#### The eyebrow line

Every resource page starts with an eyebrow — a small monospace
label above the title, telling the reader which section they're in.
It's the one piece of HTML you need:

```html
<p class="eyebrow">Resources · Getting started</p>
```

Follow the existing pattern: `Resources · <Topic>`. Look at
`getting-started.md`, `external.md`, and `linux.md` for examples.
The middle dot is `·` (U+00B7), not a period or hyphen.

#### Adding a checklist

For a "things to do" list — like the one at the bottom of
Getting Started — use a plain list with the `checklist` class
instead of GFM checkboxes:

```markdown
- First thing
- Second thing
- Third thing
{: .checklist }
```

Note: the `{: .checklist }` goes on its own line **immediately after**
the last item, with no blank line between them. That's Kramdown
syntax for "attach this class to the list I just wrote."

This renders as a list of empty squares you can read at a glance.
They're not clickable — the site is static — which is the honest
presentation for a printed checklist.

**Do not use `- [ ]`** GFM checkbox syntax. It renders as a real
(non-functional) `<input type="checkbox" disabled>`, which browsers
style inconsistently and which fights the site's visual system.
The `{: .checklist }` approach was specifically chosen to avoid this.

#### Linking between resource pages

Use the `relative_url` filter for all internal links:

```markdown
See [the Linux page]({{ '/resources/linux.html' | relative_url }}).
```

Not `[the Linux page](linux.md)` and not `[the Linux page](linux.html)`.
The `relative_url` filter is what keeps links working if the site is
ever moved to a subpath. It's the same reason the HTML pages use it.

For external links, write the URL normally:

```markdown
[Project Euler](https://projecteuler.net/)
```

External links open in the same tab by default. If you want them to
open in a new tab, use raw HTML:

```html
<a href="https://example.com" target="_blank" rel="noopener noreferrer">Example</a>
```

But for a reading list, same-tab is usually the right choice — the
reader can decide whether to open a new tab, and the back button
still works.

#### When to make a resource page vs. a root page

- **Resource page (markdown):** a guide, a reading list, an
  explanation, a set of notes, anything that reads like a document
  and might get longer over time.
- **Root page (HTML):** a landing page, the About page, the Join
  page, anything with a specific visual structure the markdown
  layout doesn't give you.

If you're not sure: start as a resource. If it turns out you need
full control over the layout, converting `.md` to `.html` later is
mostly a matter of adding `<div class="wrap">` at the top and
closing it at the bottom.

#### A note on the index

`resources/index.html` is HTML, not markdown, because it's a landing
page — it collects the resource pages and links out to them. When
you add a new resource page, add a link here. Nothing happens
automatically; a page that isn't linked is a page nobody finds.

The layout for a resource card in the index:

```html
<section class="panel panel--simN">
  <h2>Section title</h2>
  <p>One or two sentences describing what's behind the button.</p>
  <p><a class="btn" href="{{ '/resources/your-page.html' | relative_url }}">Read →</a></p>
</section>
```

Pick `panel--simN` to match the topic family — `sim3` for learning
content, `sim2` for logistics, `sim1` for technical reference,
`sim4` for identity-adjacent material

---

### Add a new page

1. Create a new `.html` file at the repository root. Name it
   lowercase, hyphen-separated: `projects.html`, not `Projects.HTML`.

2. Add front matter and content:

   ```html
   ---
   title: Projects
   description: One sentence for search engines and social previews.
   ---

   <div class="wrap">

     <section class="hero">
       <div class="hero-text">
         <p class="eyebrow">Maliyadeva Simulation &amp; Modelling Society</p>
         <h1>Projects</h1>
         <p class="lede">A short intro paragraph.</p>
       </div>
     </section>

     <section class="panel panel--sim3">
       <h2>Section heading</h2>
       <p>Content.</p>
     </section>

   </div>
   ```

   Use `panel--sim1` through `panel--sim4` for the accent colour
   (see [The design system](#the-design-system)).

3. Add a link to the new page in **`_includes/nav.html`** and
   **`_includes/footer.html`**. Use the same `relative_url` pattern
   as the existing links:

   ```liquid
   <li><a href="{{ '/projects.html' | relative_url }}"{% if page.url == '/projects.html' %} aria-current="page"{% endif %}>Projects</a></li>
   ```

   The `aria-current` bit tells browsers which page is active. It's
   what makes the current-page underline appear in the nav.

4. Commit and push.

---

### Update the join form

The Join page's main button links to a Google Form. To point it at a
different form, open **`join.html`** and find the `<a class="btn accent">`
element. Replace the `href`.

The form itself lives on Google Forms, not in this repository. To change
the questions, open the form in Google Forms and edit it there.

---

### Add a governing document

Governing documents are written in **LaTeX** and converted to HTML.
The pipeline is:

```
tex/your-document.tex
      ↓  ./build-docs.sh   (runs pandoc)
documents/your-document-body.html   (generated — do not edit by hand)
      ↓  documents/your-document.html   (wrapper you write once)
published page at /documents/your-document.html
```

To add a new one:

1. Write the LaTeX source in `tex/your-document.tex`.

2. Add the name to the `DOCS=(...)` array at the top of
   `build-docs.sh`:

   ```bash
   DOCS=(
     constitution
     bylaws
     code-of-conduct
     your-document
   )
   ```

3. Create `documents/your-document.html` as the wrapper:

   ```html
   ---
   layout: prose
   title: Your Document Title
   description: One sentence.
   ---

   <div class="doc-header">
     <h1>Your Document Title</h1>
     <p class="doc-meta">Maliyadeva College, Kurunegala</p>
   </div>

   {% include_relative your-document-body.html %}
   ```

4. Run `./build-docs.sh` to generate the body file.

5. Commit both the `.tex` source and the generated `.html`.

6. Add a link in `resources/index.html` under the
   "Governing documents" section.

**You need Pandoc installed to run `build-docs.sh`:**

- macOS: `brew install pandoc`
- Ubuntu/Debian: `sudo apt install pandoc`
- Windows: <https://pandoc.org/installing.html>

---

## How the site is structured

```
.
├── _config.yml                  Jekyll configuration
├── _data/
│   └── events.yml               ← edit this to add events
├── _includes/
│   ├── footer.html              site footer
│   └── nav.html                 top navigation
├── _layouts/
│   ├── default.html             wraps every page
│   └── prose.html               for the long-form document pages
├── documents/                   governing document pages
│   ├── constitution.html        wrapper
│   ├── constitution-body.html   ← generated by build-docs.sh
│   └── ...
├── tex/                         LaTeX sources
│   └── *.tex                    ← edit these for document changes
├── resources/                   learning guides and links
│   ├── index.html
│   ├── getting-started.md
│   ├── external.md
│   └── linux.md
├── index.html                   home
├── about.html
├── events.html                  reads _data/events.yml
├── join.html
├── 404.html
├── style.css                    all styling
├── script.js                    nav toggle + Life canvas
├── build-docs.sh                regenerates documents from tex/
├── favicon.ico, favicon.svg, apple-touch-icon.png
├── site.webmanifest
└── README.md                    this file
```

Files and folders starting with `_` are Jekyll internals — they don't
appear in the published site but they're where the templates live.

**Do not rename these files.** They're referenced by name in the layout
or by other files:

- `style.css` — referenced in `_layouts/default.html`
- `script.js` — referenced in `_layouts/default.html`
- `_data/events.yml` — referenced in `events.html`
- `_layouts/default.html` — the default layout every page uses
- `_layouts/prose.html` — referenced by `layout: prose` in the document wrappers
- `_includes/nav.html`, `_includes/footer.html` — referenced in `default.html`

---

## The design system

You don't need to understand this to edit text. Skim it if you're
adding a section or a page, so the new content matches what's already
there.

**Colour is semantic.** Four hue families, each with a job:

| Family | Colour | Used for |
| --- | --- | --- |
| `--sim1` | Sky blue | Simulation, the Life canvas |
| `--sim2` | College Gold | Events, dates, logistics |
| `--sim3` | Emerald | Methods, techniques, learning |
| `--sim4` | Crimson | Identity, CTAs, the club's voice |

Every colour is defined once at the top of `style.css`. There's a
light theme and a dark theme — `@media (prefers-color-scheme: dark)`
handles the switch based on the visitor's OS setting. **If you change
a colour, change it in both blocks**, or the site will look broken in
one theme.

**Panels.** Every content section is a `<section class="panel panel--simN">`.
The `panel--simN` class controls the accent colour of the heading marker
and the hover wash.

**Cards.** Two flavours:

- `<div class="cards">` — bordered grid of equal cards. Each card can
  be `<div class="card card--simN">` to colour it.
- `<div class="cards cards--editorial">` — two-column layout with hairline
  dividers instead of a border. Used on the homepage for "Questions we
  chase" and on the About page for "What we do".

**Typography.** IBM Plex Sans for headings and UI, IBM Plex Mono for
metadata (dates, eyebrows, tags), IBM Plex Serif for the long-form
document pages. All loaded from Google Fonts.

**Buttons.** `<a class="btn">` is neutral. `<a class="btn accent">` is
the crimson primary — used for the main call to action on a page. Don't
use `accent` for more than one button per page.

**The Life canvas.** `script.js` renders a Conway's Game of Life
simulation in any element with `id="life"`. Only `index.html` has one.
It reads `--sim1-bright` and `--grid` from `style.css` at runtime, so
changing those CSS variables also changes the canvas.

---

## Deploying

The site is hosted on GitHub Pages. Pushing to `main` publishes it.
Nothing else is needed.

```bash
git add .
git commit -m "Add November session"
git push
```

To check the build: open the repository on GitHub, click the **Actions**
tab. A green checkmark means it's live. It usually takes 30–60 seconds.

If you're new to git and just want to edit one file:

1. Open the file on github.com.
2. Click the pencil icon.
3. Make your change.
4. Scroll down, write a short message, click "Commit changes."
5. The site rebuilds automatically.

You can't permanently break anything — every version of every file is
saved. If you push something wrong, you can revert it.

**Config changes are cached.** If you edit `_config.yml`, the change
might not take effect for a minute or two. Wait, then hard-refresh.

---

## If something breaks

**The build fails.** Go to the **Actions** tab on GitHub, click the
failed build, read the error. It usually names a file and a line
number. Common causes:

- YAML syntax error in `_data/events.yml` — bad indentation, missing
  colon, unquoted special character. YAML is whitespace-sensitive.
- Liquid syntax error in a template — unclosed `{% if %}`, missing `%}`.
- A file referenced but not committed.

**A page looks unstyled.** You probably saved a complete HTML document
(with `<!DOCTYPE html>`, `<head>`, `<body>`) where a Jekyll fragment
was expected. Strip the file down to just the content between `<main>`
and `</main>` — the layout provides the rest.

**Events are in the wrong section.** Check the dates in
`_data/events.yml`. The format must be `YYYY-MM-DD`. There's no time
component — the whole day is either past or upcoming, based on the
site's timezone (`Asia/Colombo`, set in `_config.yml`).

**An event that already happened is still showing as "next".** This
is a known limitation. Jekyll computes `site.time` when the site
builds, which happens when you push. If nothing has been pushed since
before the event, the site doesn't know the event has passed. Push
any change — even a comment — to trigger a rebuild.

**A document page won't build.** Check that `build-docs.sh` has
generated the `-body.html` file and that the wrapper's
`{% include_relative %}` name matches. Re-run `./build-docs.sh`.

**Everything is broken and you don't know why.** Go to the GitHub
repository, look at the commit history, and revert to a commit that
worked.

```bash
git log --oneline            # see recent commits
git revert COMMIT_HASH       # undo a specific commit
git push
```

---

## A note for whoever comes next

This site is meant to outlive whoever built it. If you find something
confusing, fix the README before you move on. If you find a bug,
write down what you did to fix it. If you add a new pattern, add a
line about it to the design system section.

The next person is you, two years from now, having forgotten
everything. Write for them.
