---
name: upwork-scout
description: Find, filter and score fresh Upwork jobs for your niche with Upwork's official MCP connector, then draft honest proposals for the best 3–5. Read-only by default; it never submits or spends Connects without explicit approval. Use when the user says "scout upwork", "find me jobs", "run the scout", "daily scout", or wants proposal drafts for their niche.
---

# Upwork scout

Finds jobs worth Connects, drops the ones that waste them, and drafts proposals that only use proof the freelancer can back up.

## Before you start

1. Read `me.md` (copy `me.example.md` the first time and fill it in). It holds the niche, rate, search terms, and the **only** proof you may use.
2. Call `list_accounts` and pick the TALENT account named in `me.md`. The connector can switch accounts between sessions. If the named account isn't there, stop and say so. Never draft for the wrong person.
3. Read the Connects balance with `get_profile action=connects_balance`.

## 1. Search

Run every search, then de-duplicate by job id:

- `find_jobs smart_search` mode=most_recent, days_posted=2, verified_payment_only=true
- `find_jobs search` with `title` = each title term in `me.md`, verified_payment_only=true, proposals_max=10
- `find_jobs search` with `query` = the "problem words" in `me.md` (e.g. "hacked OR slow OR broken"), same filters

Gotchas: `title` can't be combined with `query` or with sort=relevance. `search` has no date filter, so use `smart_search` mode=most_recent for "posted today".

Skip any job id already listed in an earlier file in the output folder.

## 2. Check, then drop

Call `find_jobs get` on the best ~10. Drop a job if:
- `applied` is true, or `activityStat.jobActivity.totalHired` ≥ 1, or `totalOffered` ≥ 1
- `preferred_locations.location_required` is true and excludes the freelancer's country
- the client's `feedback_score` is under 4.0, or recent reviews are 1–2★ (flag it if the job is otherwise great)
- it's outside the niche in `me.md`

## 3. Score (0–10), keep the top 3–5

| Signal | Points |
|---|---|
| A fix job (broken, hacked, slow, failing checkout, migration) | +3 |
| Core build in the niche | +2 |
| Ongoing or retainer work mentioned | +2 |
| Client spent $1K+ with a 4.5★+ rating | +2 |
| 0 interviewed and fewer than 5 proposals | +1 |
| Costs more than 20 Connects | −1 |

## 4. Draft

For every pick:
- **First line is about their job.** If the post names a public URL, fetch it (20s timeout) and open with one real thing you saw. Clients only see the first two lines in their list, so a generic opener never gets opened.
- Then a numbered plan, a price, and one question at the end.
- Answer every screening question, and obey any "start your proposal with X" instruction exactly.
- Proof comes only from `me.md`: live links, measured numbers, confirmed stories. Anything only the freelancer can know (role on a project, a past fix, turnaround, a price they haven't set) goes in as `[CONFIRM: ...]`. **Never invent results, clients, numbers or experience.**
- While the account has fewer than 10 reviews, price to win and plan to upsell a care plan after delivery.

## 5. Write the file

Write `<output folder>/YYYY-MM-DD.md` containing:
1. A header line with today's Connects balance.
2. A ranked table: job link, client (country, spend, rating), Connects cost, and why it was picked.
3. A "Skipped" line explaining why the others were dropped.
4. The total Connects for all picks.
5. One draft per pick.

If nothing passes the filters, still write the file with an empty table and the reason.

## 6. Sending (only when the user says so)

Do this one proposal at a time. Upwork keeps a single open preview, and creating a second one invalidates the first.

1. `list_freelancer_proposals action=invitations` and `action=list`. If there's an invitation for the job, use `accept_invitation` instead of `create`.
2. `manage_proposals create` builds a preview. Show the user the full text, `connects_cost`, `connects_balance`, any `unmet_preferred_qualifications`, and the boost block (`current_top_bids` and `recommended_connects`, or "boost unavailable").
3. Fixed-price jobs need a `payment_mode` (`by_project` or `by_milestone`), and the user must acknowledge Upwork's Dispute Assistance text before you submit.
4. Ask about file attachments, and suggest attaching relevant portfolio projects via `portfolio_project_ids` (from `get_profile action=list_highlights`).
5. Call `confirm_preview` only after an explicit yes. Then read the proposal back with `list_freelancer_proposals action=get` and check that `connectsBid` matches the approved boost.

## Never

- Submit, edit, withdraw, message, or accept anything without the user's explicit OK for that specific action.
- Put one person's facts on another person's account.
- Fill a `[CONFIRM]` gap with a guess.
