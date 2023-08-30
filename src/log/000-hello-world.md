---
title: hello world!
date: 2023-08-28
time: 17:00
---

# Hi, it's me.

If this goes well, this should render as a readable[^1] web page.

## Purpose

I'm essentially using this as my test Markdown file – this file is intended to contain a mix of elements, including, but not limited to, the following:

- headers of all kinds
- lists that are...
  - ordered
  - unordered
- images?
- a whole bunch of typographic styles
- and more! (like special Github-flavored markdown)

### A todo list for your daily life

- [x] wake up
- [ ] get up
- [ ] get out there

```ruby
def hello
  puts "hi, it's good to be here"
end
```

## Code

Inline `code`

Indented code

    // Some comments
    line 1 of code
    line 2 of code
    line 3 of code

Block code "fences"

```
Sample text here...
```

Syntax highlighting

```js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
```

## Tables

| Option | Description                                                               |
| ------ | ------------------------------------------------------------------------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default.    |
| ext    | extension to be used for dest files.                                      |

Right aligned columns

| Option |                                                               Description |
| -----: | ------------------------------------------------------------------------: |
|   data | path to data files to supply the data that will be passed into templates. |
| engine |    engine to be used for processing templates. Handlebars is the default. |
|    ext |                                      extension to be used for dest files. |

## Links

[link text](http://dev.nodeca.com)

[link with title](http://nodeca.github.io/pica/demo/ "title text!")

Footnote 2 link[^first].

Footnote 3 link[^second].

Duplicated footnote reference[^second].

[^first]: Footnote **can have markup**

    and should be able to have multiple paragraphs.

[^second]: Footnote text.
[^1]: Will these footnotes work? I guess we'll find out.
