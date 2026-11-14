# Chunfeng Liu · Portfolio

[Live site](https://sprindy.github.io/chunfeng_liu.github.io/)

The site uses Jekyll and deploys from the root of `main` through GitHub Pages. The six homepage sections are in `index.html`. Case studies are in `_work/`.

## Publish a blog post

1. Copy `_drafts/post-template.md` to `_posts/YYYY-MM-DD-your-title.md`.
2. Set `series` to `ai-jargon-101`, `five-layer-ai-cake`, or `ai-in-perspective`. Supply a title and summary, then write in Markdown.
3. Commit to `main` or merge a pull request. GitHub Pages deploys automatically. The homepage lists only the series names. A series name links to its archive once a post in that series is published.

The initial blog posts migrated from the earlier site are in `_drafts/`. Draft source is visible in this public repository.

For a local preview, run `bundle install` and `bundle exec jekyll serve`, then use the printed project URL.
