import { useState } from 'react';

interface CodeProps {
  children: string;
  className?: string;
  node?: unknown;
}

const CodeBlock = ({ children, className }: CodeProps) => {
  const [copied, setCopied] = useState(false);
  const language = className ? className.replace('language-', '') : '';
  
  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="text-sm font-mono">{language || 'code'}</span>
        <button 
          className="copy-button"
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto bg-gray-800 text-gray-100 p-4 rounded-b-lg m-0">
        <code className={className}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock; 