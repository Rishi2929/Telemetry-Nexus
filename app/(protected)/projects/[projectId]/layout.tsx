export default async function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      {/* <ProjectHeader /> */}

      {/* <ProjectNavigation /> */}

      {children}
    </div>
  );
}