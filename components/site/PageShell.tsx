import type { ReactNode } from 'react';

export default function PageShell({
  index,
  ghost,
  title,
  children,
  className = '',
}: {
  index: string;
  ghost: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`page-shell ${className}`}>
      <span className="ghost-word" aria-hidden="true">{ghost}</span>
      <div className="page-shell__content">
        <p className="eyebrow">{index} / {title}</p>
        {children}
      </div>
    </div>
  );
}
