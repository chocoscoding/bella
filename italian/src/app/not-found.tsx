import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" className="not-found">
      <span className="eyebrow">A little off the menu</span>
      <h1>404</h1>
      <h2>This plate is empty.</h2>
      <p>Let’s get you back to something delicious.</p>
      <Link href="/" className="sticker sticker-yellow">
        Back to home ↗
      </Link>
    </main>
  );
}
