This is a personal site built with [Next.js 13](https://nextjs.org/). There will be more to come!

## Installation and usage

```bash
npm next dev
```

## Sections

### Log

The log is visible at https://xs.codes/log; each entry is created from .md files in the [src/log](https://github.com/xs/codes/tree/main/src/log) directory; two files perform most of the heavy lifting here to render these:

- [src/utils/log.ts](https://github.com/xs/codes/tree/main/src/utils/log.ts) reads the markdown files and creates in-memory Post objects
- [LogEntry.tsx](https://github.com/xs/codes/blob/main/src/components/LogEntry.tsx) takes those Post objects and renders these with [ReactMarkdown](https://github.com/remarkjs/react-markdown) (plus some additional Tailwind styling).
