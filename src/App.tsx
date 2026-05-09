import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { EmailPage } from './pages/EmailPage';
import { PriorityPage } from './pages/PriorityPage';
import { Customer360Page } from './pages/Customer360Page';
import { ProactivePage } from './pages/ProactivePage';
import { AvatarPage } from './pages/AvatarPage';
import { GamificationPage } from './pages/GamificationPage';
import { ActionsPage } from './pages/ActionsPage';
import { TravelPage } from './pages/TravelPage';
import { CompliancePage } from './pages/CompliancePage';
import { LearningPage } from './pages/LearningPage';
import { VoicePage } from './pages/VoicePage';
import { DocumentsPage } from './pages/DocumentsPage';
import { WorkflowsPage } from './pages/WorkflowsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SecurityPage } from './pages/SecurityPage';

const queryClient = new QueryClient();

const theme = {
  token: {
    colorPrimary: '#8b2252',
    borderRadius: 10,
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorBgContainer: '#ffffff',
    colorBorderSecondary: '#ebe5e5',
  },
  components: {
    Card: {
      paddingLG: 20,
    },
  },
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="email" element={<EmailPage />} />
              <Route path="priority" element={<PriorityPage />} />
              <Route path="customer360" element={<Customer360Page />} />
              <Route path="proactive" element={<ProactivePage />} />
              <Route path="avatar" element={<AvatarPage />} />
              <Route path="gamification" element={<GamificationPage />} />
              <Route path="actions" element={<ActionsPage />} />
              <Route path="travel" element={<TravelPage />} />
              <Route path="compliance" element={<CompliancePage />} />
              <Route path="learning" element={<LearningPage />} />
              <Route path="voice" element={<VoicePage />} />
              <Route path="documents" element={<DocumentsPage />} />
              <Route path="workflows" element={<WorkflowsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
