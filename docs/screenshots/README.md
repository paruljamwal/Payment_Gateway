# Screenshot assets (committed)

These PNGs power the [**Visual showcase**](../../README.md#visual-showcase) in the root README. Filenames are stable so markdown links never drift.

| File | Content |
|------|---------|
| `01-desktop-checkout.png` | Visa flow — filled checkout + INR amount + live preview sync |
| `02-mobile-checkout.png` | First-load guidance — PAN/CVV tip strip + empty preview |
| `03-card-validation.png` | Mastercard — detection chip + digit-count validation |
| `04-processing-state.png` | American Express — PAN/CVV dependent validation *(filename legacy; not processing overlay)* |
| `05-terminal-outcome.png` | Mastercard — complete formatted PAN + preview parity *(filename legacy; pre-submit readiness)* |
| `06-transaction-history.png` | Success terminal — receipt summary + toast + history upsert |
| `07-transaction-details.png` | Detail modal — UUID copy, amount, timestamp, card type |
| `08-payment-failed.png` | Failed terminal — gateway reason, attempt count, retry / new payment |
| `09-payment-timeout.png` | Timed-out terminal — abort-style copy + matching Sonner toast |
| `10-desktop-success-toast.png` | Success desktop — receipt + prominent green toast |
| `11-mobile-payment-success.png` | Narrow viewport — card + successful terminal stack |
| `12-mobile-checkout-form.png` | Narrow viewport — full form + embedded brand badge |

**Tip:** `02` is the **marketing empty-state** tip strip; `12` is the **true mobile checkout** form capture—use both or replace `02` if you prefer a single mobile hero.

To refresh captures, overwrite PNGs **keeping filenames**. Prefer **single-monitor crops**, consistent zoom, and **hide unrelated bookmarks/toolbars** when presenting to hiring managers.
