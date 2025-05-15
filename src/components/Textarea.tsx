import React from 'react';

type TextareaProps = {
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  rows?: number;
};

export const Textarea: React.FC<TextareaProps> = ({ placeholder, value, onChange, style, rows }) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      style={{
        width: '100%',
        marginTop: 10,
        padding: 10,
        borderRadius: 4,
        border: '1px solid #ccc',
        ...style,
      }}
    />
  );
};
