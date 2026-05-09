import { Tag, Progress } from 'antd';
import { BookOpen, Clock, Star, Award, Play, CheckCircle2, Target, Lightbulb } from 'lucide-react';

const courses = [
  { id: 1, title: 'Advanced Portfolio Management', category: 'Investment', duration: '4.5 hrs', progress: 72, rating: 4.8, enrolled: 234, level: 'Advanced', recommended: true },
  { id: 2, title: 'Anti-Money Laundering (AML) Essentials', category: 'Compliance', duration: '2 hrs', progress: 100, rating: 4.5, enrolled: 456, level: 'Mandatory', recommended: false },
  { id: 3, title: 'Cross-selling Techniques for RMs', category: 'Sales', duration: '3 hrs', progress: 45, rating: 4.7, enrolled: 189, level: 'Intermediate', recommended: true },
  { id: 4, title: 'Digital Banking & Fintech Trends', category: 'Technology', duration: '2.5 hrs', progress: 0, rating: 4.9, enrolled: 312, level: 'Beginner', recommended: true },
  { id: 5, title: 'Customer Relationship Excellence', category: 'Soft Skills', duration: '3.5 hrs', progress: 88, rating: 4.6, enrolled: 278, level: 'Intermediate', recommended: false },
  { id: 6, title: 'Cybersecurity Awareness Training', category: 'Security', duration: '1.5 hrs', progress: 30, rating: 4.3, enrolled: 567, level: 'Mandatory', recommended: false },
];

const recommendedPaths = [
  { name: 'HNI Client Management', courses: 5, duration: '12 hrs', progress: 60, reason: 'Based on your client portfolio composition' },
  { name: 'Compliance Mastery', courses: 4, duration: '8 hrs', progress: 75, reason: 'Required for Q1 certification renewal' },
  { name: 'Digital Transformation', courses: 6, duration: '15 hrs', progress: 20, reason: 'Aligned with bank\'s 2025 digital strategy' },
];

const achievements = [
  { title: 'Compliance Champion', date: 'Dec 2024', description: 'Completed all mandatory compliance modules' },
  { title: 'Quick Learner', date: 'Nov 2024', description: 'Finished 5 courses in one month' },
  { title: 'Perfect Score', date: 'Oct 2024', description: 'Scored 100% on AML assessment' },
];

const categoryColors: Record<string, string> = { Investment: 'blue', Compliance: 'orange', Sales: 'purple', Technology: 'cyan', 'Soft Skills': 'green', Security: 'red' };
const levelColors: Record<string, string> = { Beginner: 'green', Intermediate: 'blue', Advanced: 'purple', Mandatory: 'red' };

export const LearningPage = () => {
  return (
    <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #14b8a6, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen style={{ width: '24px', height: '24px', color: 'white' }} />
        </div>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)', margin: 0 }}>Learning & Development</h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '2px 0 0' }}>Personalized upskilling paths aligned to role and performance gaps.</p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px' }}>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f0fdfa', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#0d9488', fontFamily: 'var(--font-heading)' }}>18</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Courses Done</div>
          </div>
          <div style={{ textAlign: 'center', padding: '8px 16px', background: '#eff6ff', borderRadius: '10px' }}>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb', fontFamily: 'var(--font-heading)' }}>42 hrs</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>Total Learning</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--section-gap)' }} className="lg:!grid-cols-[1fr_340px]">
        {/* Course Catalog */}
        <div className="widget-card">
          <div className="widget-header">
            <Play style={{ width: '18px', height: '18px', color: '#14b8a6' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Course Catalog</span>
            <Tag color="cyan" style={{ marginLeft: 'auto', fontSize: '11px', borderRadius: '8px', padding: '1px 10px' }}>6 courses</Tag>
          </div>
          <div>
            {courses.map((course) => (
              <div key={course.id} style={{ padding: '16px var(--card-padding)', borderBottom: '1px solid #f8fafc', display: 'flex', gap: '14px', alignItems: 'center' }} className="hover:bg-teal-50/30 transition-colors cursor-pointer">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: course.progress === 100 ? '#f0fdf4' : course.progress > 0 ? '#eff6ff' : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {course.progress === 100 ? <CheckCircle2 style={{ width: '20px', height: '20px', color: '#16a34a' }} /> :
                   course.progress > 0 ? <Play style={{ width: '20px', height: '20px', color: '#2563eb' }} /> :
                   <BookOpen style={{ width: '20px', height: '20px', color: '#94a3b8' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{course.title}</span>
                    {course.recommended && <Lightbulb style={{ width: '14px', height: '14px', color: '#f59e0b', flexShrink: 0 }} />}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <Tag color={categoryColors[course.category]} style={{ fontSize: '10px', padding: '0 6px' }}>{course.category}</Tag>
                    <Tag color={levelColors[course.level]} style={{ fontSize: '10px', padding: '0 6px' }}>{course.level}</Tag>
                    <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '3px' }}><Clock style={{ width: '12px', height: '12px' }} />{course.duration}</span>
                    <span style={{ fontSize: '11px', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '3px' }}><Star style={{ width: '12px', height: '12px', fill: '#f59e0b' }} />{course.rating}</span>
                  </div>
                </div>
                <div style={{ width: '60px', flexShrink: 0 }}>
                  {course.progress > 0 ? (
                    <Progress type="circle" percent={course.progress} size={36} strokeWidth={8} strokeColor={course.progress === 100 ? '#10b981' : '#14b8a6'} format={(p) => <span style={{ fontSize: '10px', fontWeight: 700 }}>{p}%</span>} />
                  ) : (
                    <span style={{ fontSize: '11px', color: '#94a3b8' }}>Not started</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--section-gap)' }}>
          {/* Recommended Paths */}
          <div className="widget-card">
            <div className="widget-header">
              <Target style={{ width: '18px', height: '18px', color: '#7c3aed' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Recommended Paths</span>
            </div>
            <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {recommendedPaths.map((path, i) => (
                <div key={i} style={{ padding: '14px', borderRadius: '10px', border: '1px solid #f1f5f9', background: '#fafbfd' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{path.name}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '11px', color: '#64748b' }}>
                    <span>{path.courses} courses</span>
                    <span>•</span>
                    <span>{path.duration}</span>
                  </div>
                  <Progress percent={path.progress} size="small" strokeColor="#7c3aed" style={{ marginTop: '8px' }} format={(p) => <span style={{ fontSize: '11px' }}>{p}%</span>} />
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', fontStyle: 'italic' }}>{path.reason}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="widget-card">
            <div className="widget-header">
              <Award style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
              <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-heading)' }}>Achievements</span>
            </div>
            <div className="widget-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {achievements.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Award style={{ width: '16px', height: '16px', color: '#f59e0b' }} />
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{a.title}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{a.date} — {a.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
