# Screenshot assets

PNG captures for the [**Visual showcase**](../../README.md#visual-showcase) in the root README.

**Convention:** `NN-kebab-description.png` where **`NN`** matches the numbered captions (**1–12**). Stable filenames keep relative `<img src="docs/screenshots/…">` links valid across forks and mirrors.

---

## Catalogue

Rough narrative flow mirrors how a reviewer scans the project: **happy-path checkout → validation depth → outcomes → receipts → resilience → narrow layouts**.

| # | File | What it is meant to show |
|---|------|---------------------------|
| 1 | `01-desktop-checkout.png` | Desktop two-column shell: Visa-inferred PAN group, INR amount, CVV mask, preview in sync with typed PAN / name / expiry. |
| 2 | `02-mobile-checkout.png` | **Empty-state / guidance** — tip copy around PAN prefixes and CVV expectations (desktop-framed capture; not the narrow-form mock-up). |
| 3 | `03-card-validation.png` | Mastercard path: brand chip + **16-digit** rule surfaced as inline validation (preview swaps artwork). |
| 4 | `04-processing-state.png` | Amex path: **15-digit** PAN expectation + **CVV blocked until PAN is healthy**. Filename predates this capture *(does **not** show the processing overlay).* |
| 5 | `05-terminal-outcome.png` | Fully formatted Mastercard PAN + badge + preview parity before submit. Filename predates this capture *(not an exclusive “terminal outcome” shot).* |
| 6 | `06-transaction-history.png` | **Success** terminal with UUID receipt, **transaction history** row, Sonner toast — ledger upsert story. |
| 7 | `07-transaction-details.png` | **`<dialog>`** drill-down: status badge, copy control on transaction id, formatted amount & timestamp. |
| 8 | `08-payment-failed.png` | **Failed** terminal: `failureReason`, attempt budget (**Retry** vs **New payment**), same reference across retries. |
| 9 | `09-payment-timeout.png` | **`AbortController` timeout** terminal + Sonner echo — distinct copy from generic network failure. |
| 10 | `10-desktop-success-toast.png` | Success receipt emphasising **toast reinforcement** (pair with **#6** when history strip isn’t the hero). |
| 11 | `11-mobile-payment-success.png` | **~375px-style stack**: preview card above success terminal; history teaser below — responsive composition. |
| 12 | `12-mobile-checkout-form.png` | **True narrow checkout form**: stacked fields, **embedded Visa** in PAN group, masked CVV. |

**Disambiguation:** **#2** sells *onboarding copy* on first load; **#12** sells *mobile form density* and the composite input — keep both unless you deliberately collapse the showcase.

---

## Renaming legacy files (`04`, `05`)

If you rename **only** those two for semantic clarity (for example `04-amex-validation.png`, `05-mastercard-ready.png`), update **every** reference:

- Root [`README.md`](../README.md) — both `<details>` blocks and any prose links.
- This file — table above.

Search: `04-processing-state` and `05-terminal-outcome`.

---

## Replacing images safely

1. Capture at **100%** browser zoom; crop consistently (avoid mixed device-pixel ratios across the set).
2. **Overwrite** the existing PNG **without changing the filename** when possible — GitHub diff stays a binary swap, links stay green.
3. If you **add** a new slide, pick the next **`NN`**, drop the file here, then add the matching `<img>` + caption block to [`README.md`](../README.md#visual-showcase) (and extend this table).
4. **Alt text** lives in the root README; keep it concrete (brand, state, visible amounts) so the showcase stays accessible in repo viewers.

---

## Capture checklist (portfolio polish)

- **Theme:** dark UI only — mixed light/dark shots read as inconsistency.
- **Chrome:** hide bookmarks bar and unrelated tabs where possible.
- **Mobile:** use a fixed viewport width (for example **390×844** or **375×667**) and the same zoom as desktop captures.
- **Data:** demo PANs only; avoid real credentials even masked.
