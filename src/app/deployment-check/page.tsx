/** Minimal route to confirm Netlify serves App Router HTML (visit `/deployment-check`). */
export default function DeploymentCheckPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50">
      <h1 className="text-2xl font-semibold">Deployment Working</h1>
    </main>
  );
}
