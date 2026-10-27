# Upwork AI Playbook

> Built by Daniel Oyinloluwa and Nicholas V. as a team.

Position an Upwork profile, build a portfolio clients actually open, and send a steady volume of honest proposals, with Claude doing the legwork.

It's built around one idea we watched work: **a narrow "fix and build" niche, small fixed-price jobs to stack reviews fast, and real before/after numbers in every claim.** A WordPress freelancer used it to go from 0 to 46 jobs in about 8 weeks. This repo turns that into a system.

## What's inside

| Part | What it does |
|---|---|
| [`playbook/1-position.md`](playbook/1-position.md) | Why the model works, plus a fill-in profile template (title, overview, skills, rate) |
| [`playbook/2-portfolio.md`](playbook/2-portfolio.md) | How to get real numbers (stack detection, Lighthouse) and write cards and proposal angles |
| [`tools/thumbnails`](tools/thumbnails) | Makes 1600×1200 portfolio covers from live sites: desktop + phone screenshots, stack chips, scores of 90+ |
| [`skills/upwork-scout`](skills/upwork-scout) | A Claude skill that searches, filters, scores and drafts proposals every day. Read-only unless you approve a send |

## Setup (about 15 minutes)

1. **Claude with the Upwork connector.** Use Claude Code or the Claude desktop app with Upwork's official MCP connector enabled. Sign it in to *your* freelancer account.
2. **Install the skill:**
   ```bash
   cp -r skills/upwork-scout ~/.claude/skills/
   ```
3. **Fill in your facts:**
   ```bash
   cp ~/.claude/skills/upwork-scout/me.example.md ~/.claude/skills/upwork-scout/me.md
   ```
   Edit `me.md`: your niche, rate, search terms, live links, measured numbers, and stories that really happened. This file is the only proof the scout is allowed to use.
4. **Run it.** Tell Claude "run the upwork scout". You'll get `proposals/YYYY-MM-DD.md` with a ranked shortlist and drafts.
5. **Daily (optional):** in the Claude desktop app, create a scheduled task that runs "run the upwork scout" every morning.

### Portfolio covers
```bash
cd tools/thumbnails
npm i && npx playwright install chromium
cp sites.example.json sites.json   # edit: url, headline, chips, accent, scores
npm run thumbs                     # → out/*.png
```

## The rules that make it work

1. **Only real proof.** Live links, measured numbers, things that actually happened. Anything only you can know shows up as `[CONFIRM: ...]` in drafts until you fill it in. AI-invented experience falls apart on the first client call.
2. **One person per account.** Every fact on a profile has to be true of whoever does the work. Upwork closes shared or misrepresented accounts, and the earnings get held with them.
3. **A human approves every send.** The scout drafts. You decide what goes out and what Connects get spent.
4. **Open with their problem.** Clients see two lines in their list. If the job names a site, look at it and lead with something real you found.
5. **Win small, then upsell.** Take the $50 fix, deliver it with a before/after report, then offer monthly care.

## What we learned the hard way
- Upwork's MCP keeps **one open proposal preview at a time**. Creating a second one silently invalidates the first, so preview and send one at a time.
- Fixed-price proposals need a payment mode, and you have to acknowledge Upwork's Dispute Assistance terms first.
- You can't boost a proposal when you miss the client's preferred qualifications.
- The keyless PageSpeed API runs out of quota fast. Run Lighthouse locally instead.
- Changing niche resets what Upwork recommends to you. Keep the old niche alive in a specialized profile.

## License
MIT
