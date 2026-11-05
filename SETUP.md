# Setup: the 3 things you fill in

Everything you edit is in one file: `assets/config.js`. Nothing else needs to change.

---

## 1. Connect the booking form (Formspree, free)

This is what sends booking requests from both pages to your email.

1. Go to https://formspree.io and sign up with the email where you want bookings to arrive.
2. Click **New Form**, name it `Bookings`, and confirm your email when Formspree asks.
3. Copy the form endpoint. It looks like `https://formspree.io/f/abcdwxyz`.
4. In `assets/config.js`, replace the placeholder:

   ```js
   FORM_ENDPOINT: "https://formspree.io/f/abcdwxyz",
   ```

5. Open the live site and send yourself a test booking. The first submission may ask you to confirm in your inbox.

Both pages use this same form. Each email tells you which page it came from (`page: Sessions (FIX / POUR)` or `page: Contractors`).

Free tier note: Formspree's free plan has a monthly submission limit (it was 50 per month last time I checked). Check https://formspree.io/plans before you start advertising heavily.

Until this is filled in, the form shows "not connected yet" instead of sending.

---

## 2. Add your payment links

In `assets/config.js`, replace each `YOUR_...` with your own handle:

| Service  | Format                                     | Where to find your handle                       |
|----------|--------------------------------------------|-------------------------------------------------|
| PayPal   | `https://paypal.me/YOURNAME/50`            | paypal.com/paypalme (create your PayPal.Me link) |
| Cash App | `https://cash.app/$YOURCASHTAG/50`         | Your $Cashtag in the Cash App profile           |
| Venmo    | `https://venmo.com/u/YOURNAME`             | Your @username in the Venmo app, without the @  |
| Zelle    | Leave as `""` (recommended)                | See note below                                  |

The `/50` at the end of PayPal and Cash App pre-fills $50. Venmo web links cannot reliably pre-fill an amount, so the page tells customers to send $50.

**Zelle:** Zelle has no public pay link. It only works with your email or phone number, and this repo is public, so anything you put there is visible to everyone. Leave `ZELLE: ""` and the button tells customers you will send Zelle details when you confirm their booking. If you want to use a separate business email for Zelle, you can put that in instead.

Any button still showing `YOUR_` is greyed out on the site, so nothing broken goes live.

**Privacy check:** use handles that do not show your full legal name if you want to stay anonymous. PayPal.Me, Cash App and Venmo can all show your display name on their pay screen. Change that in each app's profile settings if needed.

---

## 3. Turn on GitHub Pages

1. On GitHub, open this repo, then **Settings** > **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then click **Save**.
4. Wait 1 to 2 minutes. Your site will be live at:

   - Sessions page: `https://raskull-ux.github.io/Hartford-AI/`
   - Contractors page: `https://raskull-ux.github.io/Hartford-AI/contractors.html`

After that, every change you push to `main` updates the site automatically within a minute or two.

---

## Optional tweaks (not required)

- **Session length:** the page says "about one hour." Change it in `index.html` if you want a different length.
- **Preselect a service in a link:** `https://raskull-ux.github.io/Hartford-AI/?service=POUR#book` opens the form with POUR already chosen. Good for latte art posts.
- **Custom domain:** buy a domain, then add it in **Settings** > **Pages** > **Custom domain**.

## Files

```
index.html         $50 FIX and POUR sessions page
contractors.html   Winter contractor setup page
assets/config.js   The only file you edit (form + payment links)
assets/styles.css  Look and layout
assets/main.js     Form sending, payment buttons
.nojekyll          Tells GitHub Pages to serve files as is
```
