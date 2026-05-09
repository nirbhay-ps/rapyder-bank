import { Card } from 'antd';
import {
  Mail, Target, Users, Zap, Bot, Trophy, Sparkles,
  Plane, Shield, BookOpen, Mic, FileText, GitBranch,
  BarChart3, Lock,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  mail: Mail,
  target: Target,
  users: Users,
  zap: Zap,
  bot: Bot,
  trophy: Trophy,
  sparkles: Sparkles,
  plane: Plane,
  shield: Shield,
  book: BookOpen,
  mic: Mic,
  file: FileText,
  git: GitBranch,
  chart: BarChart3,
  lock: Lock,
};

const colorMap: Record<string, { bg: string; icon: string; gradient: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' },
  indigo: { bg: 'bg-indigo-50', icon: 'text-indigo-600', gradient: 'from-indigo-500 to-indigo-600' },
  emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', gradient: 'from-emerald-500 to-emerald-600' },
  amber: { bg: 'bg-amber-50', icon: 'text-amber-600', gradient: 'from-amber-500 to-amber-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600', gradient: 'from-purple-500 to-purple-600' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', gradient: 'from-violet-500 to-violet-600' },
  sky: { bg: 'bg-sky-50', icon: 'text-sky-600', gradient: 'from-sky-500 to-sky-600' },
  teal: { bg: 'bg-teal-50', icon: 'text-teal-600', gradient: 'from-teal-500 to-teal-600' },
  rose: { bg: 'bg-rose-50', icon: 'text-rose-600', gradient: 'from-rose-500 to-rose-600' },
  slate: { bg: 'bg-slate-100', icon: 'text-slate-600', gradient: 'from-slate-500 to-slate-600' },
  orange: { bg: 'bg-orange-50', icon: 'text-orange-600', gradient: 'from-orange-500 to-orange-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600', gradient: 'from-red-500 to-red-600' },
};

interface ModulePageProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export const ModulePage = ({ title, description, icon, color }: ModulePageProps) => {
  const Icon = iconMap[icon] || Sparkles;
  const colors = colorMap[color] || colorMap.blue;

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <Card className="!shadow-sm !border-slate-200/80">
        <div className="flex flex-col items-center text-center py-16">
          <div className={`flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${colors.gradient} shadow-lg mb-6`}>
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
          <p className="text-sm text-slate-500 max-w-md mb-8">{description}</p>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-slate-600">Module active — Full UI coming soon</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
