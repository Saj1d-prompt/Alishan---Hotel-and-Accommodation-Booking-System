export default function PageHeader({
  title,
  description,
  action,
}) {
  return (
    <div className="mb-10 flex items-center justify-between">

      <div>

        <h1 className="text-4xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-2 text-slate-500">
          {description}
        </p>

      </div>

      {action}

    </div>
  );
}