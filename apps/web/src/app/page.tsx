import { workspaceImportProbe } from "@code-hammer/shared";

const coreModules = [
  "Workspace",
  "Documents",
  "AI runtime",
  "Workflows",
  "Integrations",
  "Observability",
];

export default function HomePage() {
  return (
    <main className="shell">
      <section className="panel">
        <p className="eyebrow">Code Hammer</p>
        <h1>Modular AI desk assistant foundation</h1>
        <p className="lede">
          This Next.js app is the user-facing SaaS shell for the Code Hammer
          monorepo.
        </p>
        <ul>
          {coreModules.map((module) => (
            <li key={module}>{module}</li>
          ))}
        </ul>
        <p className="probe">Shared package: {workspaceImportProbe}</p>
      </section>
    </main>
  );
}
