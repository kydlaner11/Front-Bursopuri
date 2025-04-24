import React from 'react';

interface TagProps {
  label: string;
  value: string;
  onClick?: () => void;
}

export const Tag: React.FC<TagProps> = ({ label, value, onClick }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        border: '1px solid var(--main-turquoise)',
        borderRadius: 10,
        backgroundColor: 'rgba(252, 0, 0, 0.08)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      <span style={{ fontSize: 14, color: 'var(--main-dark)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--main-dark)' }}>
        {value}
      </span>
    </div>
  );
};
