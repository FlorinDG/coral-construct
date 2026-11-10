import Link from "next/link";

// Temporary chooser while the two directions are compared.
export default function Home() {
  return (
    <main className="grid min-h-svh place-content-center gap-6 p-6 text-center">
      <p className="eyebrow">Coral Construct · ^design review</p>
      <h1 className="text-4xl font-bold tracking-tight">Pick a direction</h1>
      <div className="flex flex-wrap justify-center gap-4">
        <Link className="btn btn-primary" href="/modern">
          Ultra modern
        </Link>
        <Link className="btn btn-primary" href="/neumorphism">
          Neumorphism
        </Link>
      </div>
    </main>
  );
}
