import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-24 text-center">
      <p className="v v-unknown">Not verified</p>
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight">This page does not exist</h1>
      <p className="mx-auto mt-3 max-w-md text-[var(--muted)]">
        Like an announced rollout with nothing in the air. Try the airline directory instead.
      </p>
      <p className="mt-6">
        <Link href="/airlines/">Browse all airlines</Link>
      </p>
    </section>
  );
}
