import styled from 'styled-components';

export const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  background: var(--container-bg);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 900;
  margin-bottom: 1.5rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -0.02em;
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'ghost' | 'active' }>`
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background: var(--primary-solid);
          color: var(--bg-color);
          &:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(45, 212, 191, 0.3); }
        `;
      case 'danger':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: var(--danger-color);
          &:hover { background: var(--danger-color); color: white; }
        `;
      case 'active':
        return `
          background: rgba(45, 212, 191, 0.15);
          color: var(--primary-solid);
          border: 1px solid var(--primary-solid);
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-color);
          border: 1px solid var(--border-color);
          &:hover { background: rgba(255, 255, 255, 0.1); }
        `;
    }
  }}

  &:active { transform: scale(0.95); }
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 0.6rem;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-color);
  outline: none;
  transition: all 0.2s;
  font-size: 0.95rem;

  &:focus {
    border-color: var(--primary-solid);
    box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.1);
  }
`;

export const Select = styled.select`
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.6rem;
  padding: 0.75rem 0.5rem;
  color: var(--text-color);
  outline: none;
  cursor: pointer;
  font-weight: 500;
  transition: border-color 0.2s;

  &:focus { border-color: var(--primary-solid); }
`;
