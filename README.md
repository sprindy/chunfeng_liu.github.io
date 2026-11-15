# Chunfeng Liu · Portfolio

[Live site](https://sprindy.github.io/chunfeng_liu.github.io/)

The site uses Jekyll and deploys from the root of `main` through GitHub Pages. The six homepage sections are in `index.html`. Case studies are in `_work/`.

## Publish a blog post

1. Copy `_drafts/post-template.md` to `_posts/YYYY-MM-DD-your-title.md`.
2. Set `series` to `ai-jargon-101`, `five-layer-ai-cake`, or `ai-in-perspective`. Supply a title and summary, then write in Markdown.
3. Commit to `main` or merge a pull request. GitHub Pages deploys automatically. The homepage lists only the series names. A series name links to its archive once a post in that series is published.

The initial blog posts migrated from the earlier site are in `_drafts/`. Draft source is visible in this public repository.

For a local preview, run `bundle install` and `bundle exec jekyll serve`, then use the printed project URL.

## Private visitor analytics

The public site stays on GitHub Pages. The collector, private dashboard and D1 database run in your Cloudflare account. The public site starts sending analytics only after a visitor allows it and a deployed collector URL is configured.

1. From `_analytics/`, run `npx wrangler login` in your terminal and sign in to your Cloudflare account.
2. Run `npx wrangler d1 create portfolio-analytics`. In your local copy of `wrangler.toml`, replace the example `database_id` with the returned ID.
3. Run `npx wrangler d1 migrations apply portfolio-analytics --remote`, then `npx wrangler deploy`.
4. Set `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and `SESSION_SECRET` with `npx wrangler secret put NAME`, once per secret. Choose a password of at least 12 characters and an independent random session secret of at least 32 characters. Enter secrets directly in Wrangler or the Cloudflare dashboard. Changing the password or session secret invalidates active sign-ins.
5. Open the Worker URL and sign in with the username and password you chose. Set `visitor_analytics_url` in the site's `_config.yml` to the HTTPS Worker URL and publish the change. On the portfolio, double-click **Chunfeng Liu · Singapore** at the bottom left to open the sign-in. You can also focus the label and press Enter.
6. On the portfolio, open **Visitor analytics preferences** below the footer and allow analytics. Open two pages, then check the private dashboard. Turn it off again if you prefer to exclude your browser.

Reports include 7-, 30-, and 90-day ranges, page views and visible time per page, repeat visits by browser, and visits grouped by the network that handled them. Browsers can share networks or clear their saved IDs. Company attribution reflects the network owner, which can instead be an ISP or VPN. Collection starts when analytics are enabled. There is no historical backfill.

The dashboard displays IP prefixes by default. To record full IP addresses for new page views, set `STORE_FULL_IP = "true"` in the Worker configuration and redeploy. The Worker deletes analytics rows older than 90 days on a daily schedule. Keep dashboard credentials and visitor data out of Git.

## Public blog engagement

Each post footer shows the existing view count, a LinkedIn repost link, and a Share button. Likes and comments appear when the engagement endpoint is available. Submitted comments go to **Moderate comments** in the private dashboard, where you can approve or reject them.

For an existing analytics deployment, apply `_analytics/migrations/0002_post_engagement.sql` to the existing D1 database before deploying the updated Worker. If the database was provisioned in the Cloudflare console without Wrangler migration records, run the statements in that file from the console. Keep the existing database binding, variables and secrets.
