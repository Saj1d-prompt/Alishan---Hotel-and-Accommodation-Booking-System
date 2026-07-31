import QuickActions from "@/components/dashboard/QuickActions";
import RevenueCard from "@/components/dashboard/RevenueCard";
import OccupancyCard from "@/components/dashboard/OccupancyCard";
import RecentBookings from "@/components/dashboard/RecentBookings";
import ActivityTimeline from "@/components/dashboard/ActivityTimeline";
import StatCard from "@/components/dashboard/StatCard";
import WelcomeHero from "@/components/dashboard/WelcomeHero";

import PageContainer from "@/components/ui/PageContainer";

import { dashboardStats } from "@/data/dashboard";

export default function Dashboard() {
  return (
    <PageContainer>

      <WelcomeHero />

      <section className="mt-8">

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.title}
              {...stat}
            />
          ))}

        </div>

      </section>

      <section className="mt-8">

        <div className="grid gap-6 lg:grid-cols-3">

          <QuickActions />

          <div className="space-y-6 lg:col-span-2">

            <OccupancyCard />

            <RevenueCard />

          </div>

        </div>

      </section>

      <section className="mt-8">

        <div className="grid gap-6 xl:grid-cols-3">

          <div className="xl:col-span-2">

            <RecentBookings />

          </div>

          <ActivityTimeline />

        </div>

      </section>

    </PageContainer>
  );
}