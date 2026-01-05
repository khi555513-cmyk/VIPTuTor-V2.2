
import React, { useEffect, useRef, useMemo, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Copy, Check } from 'lucide-react';
import ReactDOM from 'react-dom/client';

interface MarkdownRendererProps {
  content: string;
}

declare global {
  interface Window {
    katex: any;
    hljs: any;
  }
}

// Separate component for the Copy Button to use React state easily
const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className="copy-btn">
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [katexLoaded, setKatexLoaded] = useState(false);

  // 1. Check for external libraries
  useEffect(() => {
    if (window.katex) {
      setKatexLoaded(true);
    } else {
      const interval = setInterval(() => {
        if (window.katex) {
          setKatexLoaded(true);
          clearInterval(interval);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, []);

  // 2. Process Content (Math + Markdown -> HTML)
  const htmlContent = useMemo(() => {
    const mathEntries: { placeholder: string; math: string; display: boolean }[] = [];
    let processedContent = content || "";

    // 2a. Math Tokenization (Preserve LaTeX)
    const pushMath = (math: string, display: boolean) => {
      const placeholder = `%%%MATH_PLACEHOLDER_${mathEntries.length}%%%`;
      mathEntries.push({ placeholder, math, display });
      return placeholder;
    };

    // Regex for Math (Robust against common patterns)
    processedContent = processedContent.replace(/\$\$([\s\S]*?)\$\$/g, (_, math) => pushMath(math, true));
    processedContent = processedContent.replace(/\\\[([\s\S]*?)\\\]/g, (_, math) => pushMath(math, true));
    processedContent = processedContent.replace(/\$([^$]+)\$/g, (_, math) => pushMath(math, false));
    processedContent = processedContent.replace(/\\\(([\s\S]*?)\\\)/g, (_, math) => pushMath(math, false));

    // 2b. Parse Markdown
    const rawHtml = marked.parse(processedContent, { 
      breaks: true, 
      gfm: true,
      async: false 
    }) as string;

    // 2c. Sanitize
    let sanitizedHtml = DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['iframe'], 
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'target']
    });

    // 2d. Restore Math
    mathEntries.forEach(({ placeholder, math, display }) => {
      let rendered = placeholder;
      if (window.katex) {
        try {
          rendered = window.katex.renderToString(math, {
            displayMode: display,
            throwOnError: false,
            output: 'html',
            trust: true
          });
        } catch (e) {
          rendered = `<span class="katex-error" title="${e}">${math}</span>`;
        }
      } else {
        rendered = display ? `$$${math}$$` : `$${math}$`;
      }
      sanitizedHtml = sanitizedHtml.replace(placeholder, rendered);
    });

    return sanitizedHtml;
  }, [content, katexLoaded]);

  // 3. Post-Processing (DOM Manipulation)
  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // A. Syntax Highlighting
    if (window.hljs) {
      container.querySelectorAll('pre code').forEach((block) => {
        window.hljs.highlightElement(block as HTMLElement);
      });
    }

    // B. Enhance Code Blocks (Mac Window Style)
    container.querySelectorAll('pre').forEach((pre) => {
      // Check if already processed to avoid duplication on re-renders
      if (pre.closest('.code-block-wrapper')) return;

      const codeEl = pre.querySelector('code');
      const languageClass = (Array.from(codeEl?.classList || []) as string[]).find(c => c.startsWith('language-'));
      const language = languageClass ? languageClass.replace('language-', '') : 'text';
      const codeText = codeEl?.textContent || '';

      // Create Wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      // Create Header
      const header = document.createElement('div');
      header.className = 'code-header';
      
      const dots = document.createElement('div');
      dots.className = 'code-dots';
      dots.innerHTML = '<div class="code-dot dot-red"></div><div class="code-dot dot-yellow"></div><div class="code-dot dot-green"></div>';
      
      const langLabel = document.createElement('span');
      langLabel.className = 'code-lang';
      langLabel.textContent = language;

      const copyContainer = document.createElement('div'); // Container for React Portal

      header.appendChild(dots);
      header.appendChild(langLabel);
      header.appendChild(copyContainer);

      // Insert Wrapper
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);

      // Mount Copy Button React Component
      const root = ReactDOM.createRoot(copyContainer);
      root.render(<CopyButton text={codeText} />);
    });

    // C. Responsive Tables
    container.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode?.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // D. External Links
    container.querySelectorAll('a').forEach((link) => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
    });

  }, [htmlContent]);

  return (
    <div 
      ref={containerRef}
      className="prose-vip" // Changed class name
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default MarkdownRenderer;
