# Christoph Clement

Personal website built with [al-folio](https://github.com/alshedivat/al-folio).

Visit: [https://chris-clem.github.io](https://chris-clem.github.io)

## Local development

Requires Ruby 3.3, Bundler 2.6.9, Node.js/npm, ImageMagick, and `uv`.

```bash
uv venv --python 3.13 .bundle/python
uv pip install --python .bundle/python/bin/python -r requirements.txt
gem install bundler -v 2.6.9
bundle _2.6.9_ config set --local path vendor/bundle
bundle _2.6.9_ install
npm ci
export PATH="$PWD/.bundle/python/bin:$PATH"
bundle _2.6.9_ exec jekyll serve --host 127.0.0.1 --port 4000
```

On Apple Silicon Macs with Homebrew Ruby, prepend `/opt/homebrew/opt/ruby@3.3/bin`
to `PATH` before running the Ruby commands. Open <http://localhost:4000>.

```bash
npx prettier . --check
JEKYLL_ENV=production bundle _2.6.9_ exec jekyll build
```

The production build writes to `_site/`. Sass compresses the main stylesheet;
the redundant CSSminify2 pass is disabled to avoid slow builds.

## Content

- `_pages/about.md`: introduction and personal motivation.
- `_data/profile.yml`: experience and education, shared by the homepage and CV.
- `_data/socials.yml`: contact details and profile links.
- `assets/img/christoph-clement.png`: portrait.
- `assets/css/profile.css`: profile layout and shared navigation styles.
- `_posts/`: technical notes.

Publications link directly to Google Scholar. `/about/` redirects to the homepage,
and `/publications/` redirects to the Scholar profile. Pushes to `main` trigger
the existing GitHub Pages deployment workflow.
