import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  background: var(--container-bg);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 1.2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 2rem;
  background: var(--primary-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: -0.04em;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
`;

export const Button = styled.button<{ variant?: 'primary' | 'danger' | 'ghost' | 'active' | 'small' }>`
  padding: ${({ variant }) => variant === 'small' ? '0.3rem 0.6rem' : '0.75rem 1.2rem'};
  border-radius: 0.6rem;
  border: 1px solid transparent;
  font-weight: 600;
  font-size: ${({ variant }) => variant === 'small' ? '0.7rem' : '0.95rem'};
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
          &:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(45, 212, 191, 0.4); }
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
          border-color: var(--primary-solid);
        `;
      case 'small':
        return `
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-color);
          border-color: var(--border-color);
          &:hover { background: rgba(255, 255, 255, 0.1); }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.05);
          color: var(--text-color);
          border-color: var(--border-color);
          &:hover { background: rgba(255, 255, 255, 0.1); }
        `;
    }
  }}

  &:active { transform: scale(0.96); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1.2rem;
  border-radius: 0.7rem;
  border: 1px solid var(--border-color);
  background: var(--input-bg);
  color: var(--text-color);
  outline: none;
  transition: all 0.2s;
  font-size: 1rem;

  &::placeholder { opacity: 0.4; }
  &:focus {
    border-color: var(--primary-solid);
    box-shadow: 0 0 0 3px rgba(45, 212, 191, 0.1);
  }
`;

export const Select = styled.select<{ $priorityColor?: string }>`
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  border-radius: 0.7rem;
  padding: 0.75rem 0.6rem;
  color: ${({ $priorityColor }) => $priorityColor || 'var(--text-color)'};
  outline: none;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;

  &:focus { border-color: var(--primary-solid); }
`;

export const Badge = styled.span<{ $type?: 'overdue' | 'priority' }>`
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border-radius: 0.3rem;
  font-weight: 700;
  background: ${({ $type }) => $type === 'overdue' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $type }) => $type === 'overdue' ? 'var(--danger-color)' : 'inherit'};
`;
