export default function Section({
  title,
  subtitle,
  children,
}) {
  return (
    <section className="mb-8">

      {(title || subtitle) && (

        <div className="mb-5">

          {title && (
            <h2 className="text-2xl font-bold text-slate-900">
              {title}
            </h2>
          )}

          {subtitle && (
            <p className="mt-1 text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

      )}

      {children}

    </section>
  );
}