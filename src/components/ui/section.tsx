
export const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
)