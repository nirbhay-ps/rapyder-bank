import { Badge, Input, Avatar, Dropdown, type MenuProps } from 'antd';
import { Bell, Search, MessageSquare, Settings } from 'lucide-react';

export const TopBar = () => {
  const notificationItems: MenuProps['items'] = [
    { key: '1', label: <div style={{ padding: '6px 0' }}><p style={{ fontSize: '13px', fontWeight: 500, color: '#2d2d2d' }}>SLA Alert: Rajesh Kumar</p><p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Response due in 2 hours</p></div> },
    { key: '2', label: <div style={{ padding: '6px 0' }}><p style={{ fontSize: '13px', fontWeight: 500, color: '#2d2d2d' }}>Cross-sell opportunity</p><p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Mutual fund for Anita Desai</p></div> },
    { key: '3', label: <div style={{ padding: '6px 0' }}><p style={{ fontSize: '13px', fontWeight: 500, color: '#2d2d2d' }}>Compliance reminder</p><p style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>KYC renewal — 3 clients</p></div> },
  ];

  return (
    <header style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      height: '60px', padding: '0 clamp(20px, 3vw, 36px)',
      background: '#fff', borderBottom: '1px solid #ebe5e5', flexShrink: 0, zIndex: 20,
    }}>
      <div style={{ minWidth: 0 }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#2d2d2d', fontFamily: 'var(--font-heading)' }}>
          Good morning, Priya
        </h2>
        <p style={{ fontSize: '12px', color: '#999', marginTop: '1px' }}>
          Tue, 9 May · 14 tasks · <span style={{ color: '#8b2252', fontWeight: 600 }}>3 alerts</span>
        </p>
      </div>

      <div style={{ maxWidth: '360px', width: '100%', margin: '0 24px', display: 'none' }} className="xl:!flex">
        <Input
          prefix={<Search style={{ width: '15px', height: '15px', color: '#aaa' }} />}
          placeholder="Search..."
          style={{ borderRadius: '10px', height: '38px', fontSize: '13px', background: '#f9f7f7', border: '1px solid #ebe5e5' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
        <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }} className="hover:bg-gray-100 transition-colors">
          <Badge count={4} size="small" offset={[-2, 2]}>
            <MessageSquare style={{ width: '17px', height: '17px', color: '#777' }} />
          </Badge>
        </button>
        <Dropdown menu={{ items: notificationItems }} placement="bottomRight" trigger={['click']}>
          <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }} className="hover:bg-gray-100 transition-colors">
            <Badge count={7} size="small" offset={[-2, 2]}>
              <Bell style={{ width: '17px', height: '17px', color: '#777' }} />
            </Badge>
          </button>
        </Dropdown>
        <button style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer' }} className="hover:bg-gray-100 transition-colors">
          <Settings style={{ width: '17px', height: '17px', color: '#777' }} />
        </button>
        <div style={{ marginLeft: '8px', paddingLeft: '12px', borderLeft: '1px solid #ebe5e5' }}>
          <Avatar size={34} style={{ background: 'linear-gradient(135deg, #8b2252, #d4547a)', fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
            PS
          </Avatar>
        </div>
      </div>
    </header>
  );
}
