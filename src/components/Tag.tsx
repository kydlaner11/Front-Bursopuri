import React from 'react';
import { CheckCircleOutlined } from '@ant-design/icons';

interface TagProps {
  label: string;
  value: string;
  onClick?: () => void;
  icon?: React.ReactNode;
}

export const Tag: React.FC<TagProps> = ({ label, value, onClick, icon = <CheckCircleOutlined /> }) => {
  const isTakeAway = value === "Take Away";
  
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        border: isTakeAway ? '1px solid #007bff' : '1px solid var(--main-turquoise)',
        borderRadius: 10,
        backgroundColor: isTakeAway ? 'rgba(0, 123, 255, 0.08)' : 'rgba(252, 0, 0, 0.08)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 14, color: 'var(--main-dark)' }}>{label}</span>
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--main-dark)',
        }}
      >
        {value}
        {icon && <span style={{ marginLeft: 8 }}>{icon}</span>}
      </span>
    </div>
  );
};
