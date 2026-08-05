import PageContainer from "@/components/ui/PageContainer";

const AdminPlaceholder = ({ title }) => {
  return (
    <PageContainer>
      <section className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">
          Admin
        </p>

        <h1 className="mt-4 text-4xl font-bold text-slate-950">
          {title}
        </h1>

        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          This route is connected correctly. The
          management interface for{" "}
          {title.toLowerCase()} will be implemented
          with the corresponding Laravel API.
        </p>
      </section>
    </PageContainer>
  );
};

export default AdminPlaceholder;