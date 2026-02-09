import DOMPurify from 'dompurify';
import katex from 'katex';
import { memo, useMemo } from 'react';

interface Props {
  tex: string;
  displayMode?: boolean;
  className?: string;
  ariaLabel?: string;
}

function KaTeXRendererInner({ tex, displayMode = false, className, ariaLabel }: Props) {
  const html = useMemo(() => {
    try {
      const raw = katex.renderToString(tex, {
        throwOnError: false,
        displayMode,
      });
      return DOMPurify.sanitize(raw);
    } catch {
      return null;
    }
  }, [tex, displayMode]);

  if (!html) {
    return (
      <span role="math" aria-label={ariaLabel || tex} className={className}>
        {tex}
      </span>
    );
  }

  return (
    <span
      role="math"
      aria-label={ariaLabel || tex}
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: KaTeX output sanitized through DOMPurify
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

const KaTeXRenderer = memo(KaTeXRendererInner);
export default KaTeXRenderer;
