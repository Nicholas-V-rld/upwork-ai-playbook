# 2. Portfolio that gets opened

## Each card needs
- **A cover** at 1600×1200 (4:3): a keyword headline, the stack as chips, measured scores, and desktop + phone screenshots. `tools/thumbnails` makes these from a JSON file.
- **A title that leads with search words**, then the industry: "Car Rental WordPress Website with Online Booking Engine (Elementor)".
- **A description you could defend on a call:** what you did, the stack, and a measured score with its date.
- **5 skills** and the live link.

## Getting real numbers
- Stack: read the live HTML. `wp-content/plugins/<name>` and `<meta name="generator">` tell you the theme and plugins.
- Scores: run Lighthouse locally. The keyless PageSpeed API runs out of quota fast.
  ```bash
  npx lighthouse@12.8.2 https://example.com --only-categories=performance,accessibility,best-practices,seo --output=json --output-path=mobile.json --chrome-flags="--headless=new"
  ```
  Add `--preset=desktop` for desktop. Some sites block headless Chrome on desktop runs; if so, use the mobile run.
- **Only put a score on the card if it's 90 or higher.** Low performance scores belong in your notes, as the before half of a future before/after case study.

## Turn weak scores into your best card
If you still have access to a site that scores 50 on mobile, do a speed pass, measure again, and publish "Mobile 50 → 85, LCP 14.7s → 3.5s." That one card does more than five plain screenshots.

## Proposal angles
For each portfolio site, write one sentence that maps it to a new client's situation ("If you serve several audiences, I'd give each one its own route from the homepage, like <site>"). Put these in `me.md` so the scout can reuse them.
