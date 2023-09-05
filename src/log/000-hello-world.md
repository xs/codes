---
title: hello world
date: 2023-08-30
time: 16:20
---

# An Introduction

If this goes well, this should render as a readable blog entry.

## Purpose

I'm essentially using this as my test Markdown file – this file is intended to contain a mix of elements[^1].

### Most days

- [x] wake up
- [x] get up
- [x] get out there

### Today, specifically

#### On my plans

I'm working on setting up this blog.

> The only thing that is constant is change.

#### On the weather

```ruby
class Sky
  def initialize(color)
    @color = color
  end
end

class Sun
  def initialize(brightness)
    @brightness = brightness
  end
end

sky = Sky.new('blue')
sun = Sun.new('bright')
```

## This is what the blog looks like to me, as I edit

```md
---
title: a quote
date: 2023-08-30
time: 17:25
---

> It does not matter how slow you go so long as you do not stop.[^1]

[^1]: but wait, what if this post also[^2] has footnotes[^3]?
[^2]: "also" here refers to the previous post ("hello world"), which also has a footnote. there was previously an issue where both footnotes would be rendered with the same id, causing issues when linking. this has since been fixed!
[^3]: speaking of footnotes, we're **also** going to find out here if footnotes themselves can have footnotes. (they can!)
```

[^1]: As supported by Github-flavored markdown
