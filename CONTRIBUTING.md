# Contributing to tinytinker.tools

First off — thank you for being here! tinytinker.tools is a community toolkit and every contribution makes it better. ☻ ✦

## Ways to contribute

- **Add a new tool** — the most impactful way to contribute
- **Fix a bug** — something broken? open an issue or a PR
- **Improve an existing tool** — better UX, more accurate calculations, more options
- **Improve docs** — README, comments, or this file
- **Suggest a tool** — use the [request form](https://tinytinker.tools/request)

---

## Adding a new tool

Each tool is a single self-contained file. Here is the full process:

### 1. Create the folder and page

```
app/tools/your-tool-name/page.tsx
```

Use `components/ToolPage.tsx` as the wrapper:

```tsx
import ToolPage from "@/components/ToolPage";

export default function YourToolPage() {
  return (
    <ToolPage
      title="your tool name"
      description="one sentence description of what it does."
      category="electronics"
    >
      {/* your tool content */}
    </ToolPage>
  );
}
```

### 2. Add it to the nav

In `app/layout.tsx`, add to the relevant section:

```tsx
{ href: "/tools/your-tool-name", label: "your tool name" },
```

### 3. Add it to the tool grid

In `components/ToolGrid.tsx`, add to the relevant section:

```tsx
{ href: "/tools/your-tool-name", label: "your tool name", desc: "short description", tag: "calc" },
```

### 4. Add it to FeaturedTools

In `components/FeaturedTools.tsx`, add to the `ALL_TOOLS` array:

```tsx
{ href: "/tools/your-tool-name", label: "your tool name", desc: "short description", category: "electronics", tag: "calc" },
```

### 5. Open a pull request

That is it. Open a PR with a short description of what the tool does and who it is for.

---

## Tool tags

| tag       | means                        |
| --------- | ---------------------------- |
| `calc`    | computes a value from inputs |
| `gen`     | generates content            |
| `ref`     | lookup or reference table    |
| `decode`  | decodes a code or format     |
| `convert` | converts between formats     |
| `test`    | lets you test something live |
| `plan`    | helps you plan or design     |
| `guide`   | educational reference        |

---

## Design system

Please follow the existing design language. The full system lives in `app/globals.css`.

**Key rules:**

- Use CSS variables for all colors — never hardcode hex values
- Font: IBM Plex Mono only
- All tools must work 100% client-side — no API calls, no backend
- Dark mode must work — test both light and dark before submitting
- Mobile responsive — test at 375px width

**CSS variables to use:**

```css
--ink          /* primary text */
--ink-soft     /* secondary text */
--ink-muted    /* tertiary text */
--ink-ghost    /* placeholder/disabled text */
--accent       /* purple accent */
--border       /* borders */
--card         /* card background */
--bg           /* page background */
--bg-sidebar   /* sidebar background */
```

**Aesthetic:** soft, warm, handmade. Lavender palette. Monospace. Cybertwee energy. If it feels too corporate or too generic, it probably needs adjusting.

---

## Code style

- TypeScript — all files should be `.tsx` or `.ts`
- No external dependencies unless absolutely necessary
- Keep tools self-contained — no shared state between tools
- Client components need `"use client"` at the top
- Use `const` over `let` where possible

---

## Pull request checklist

Before opening a PR, make sure:

- [ ] Tool works in both light and dark mode
- [ ] Tool works on mobile (375px)
- [ ] Tool is added to nav, ToolGrid, and FeaturedTools
- [ ] No hardcoded colors — only CSS variables
- [ ] No external API calls
- [ ] TypeScript has no errors
- [ ] Follows the existing aesthetic

---

## Questions?

Open a [github discussion](https://github.com/yafira/tinytinker-tools/discussions) or email [yafira@proton.me](mailto:yafira@proton.me).
