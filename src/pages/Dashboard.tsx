import { MetricsRow } from '../components/dashboard/MetricsRow';
import { EmailIntelligence } from '../components/dashboard/EmailIntelligence';
import { PriorityStack } from '../components/dashboard/PriorityStack';
import { Customer360Panel } from '../components/dashboard/Customer360Panel';
import { AutonomousActions } from '../components/dashboard/AutonomousActions';
import { PerformanceChart } from '../components/dashboard/PerformanceChart';
import { ProactiveAlerts } from '../components/dashboard/ProactiveAlerts';
import { GamificationWidget } from '../components/dashboard/GamificationWidget';
import { ComplianceMeter } from '../components/dashboard/ComplianceMeter';

export const Dashboard = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      <MetricsRow />

      {/* Two-column: main + sidebar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="xl:!grid-cols-[1fr_320px]">
        {/* Main content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          <Customer360Panel />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-2">
            <EmailIntelligence />
            <PriorityStack />
          </div>
          <AutonomousActions />
          <PerformanceChart />
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          <ProactiveAlerts />
          <GamificationWidget />
          <ComplianceMeter />
        </div>
      </div>
    </div>
  );
}
