"""Regenerate the donation-page QR code.

Run this whenever the canonical URL changes (custom domain, Netlify
rename, etc.) - the QR must always point at the *page*, not directly
at the Stripe payment link, so swapping the payment provider or the
page implementation later never invalidates printed/QR materials.

Usage:
    pip install qrcode[pil]
    python scripts/generate_qr.py https://your-final-domain.example/
"""
import sys
import qrcode

DEFAULT_URL = "https://tunatruth-support.netlify.app/"

def main():
    url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL
    img = qrcode.make(url, box_size=12, border=4)
    out_path = "assets/qr/tunatruth-donate-qr.png"
    img.save(out_path)
    print(f"QR for {url} saved to {out_path}")

if __name__ == "__main__":
    main()
