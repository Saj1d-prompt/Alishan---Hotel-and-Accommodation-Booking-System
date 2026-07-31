import PageContainer from "@/components/ui/PageContainer";
import PageHeader from "@/components/ui/PageHeader";

export default function Dashboard() {
  return (
    <PageContainer>

      <PageHeader
        title="Dashboard"
        description="Welcome back to Alishan Accommodation."
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-20 text-center shadow-sm">

        <h2 className="text-3xl font-bold">
          Dashboard UI Coming Next
        </h2>

      </div>

    </PageContainer>
  );
}