// Remove MDX imports to avoid dependency issues
// import { MDXRemote } from 'next-mdx-remote';
// import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import ReactMarkdown from 'react-markdown';
import '@/styles/markdown.css';
import CodeBlock from './CodeBlock';

interface UnitDescriptionProps {
  // mdxSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> | null;
  markdownContent?: string;
  fallbackText: string;
}

const blackTextStyle = { 
  color: '#000000 !important',
  textShadow: 'none' 
};

export default function UnitDescription({ markdownContent, fallbackText }: UnitDescriptionProps) {
  const content = markdownContent || fallbackText;
  
  return (
    <div className="markdown-content" style={{ color: '#000000', fontFamily: 'inherit' }}>
      <ReactMarkdown
        components={{
          // Force black text on all elements
          p: ({children, ...props}) => (
            <p style={blackTextStyle} className="text-black !important" {...props}>{children}</p>
          ),
          h1: ({children, ...props}) => (
            <h1 style={blackTextStyle} className="text-black !important font-bold text-2xl my-4" {...props}>{children}</h1>
          ),
          h2: ({children, ...props}) => (
            <h2 style={blackTextStyle} className="text-black !important font-bold text-xl my-3" {...props}>{children}</h2>
          ),
          h3: ({children, ...props}) => (
            <h3 style={blackTextStyle} className="text-black !important font-bold text-lg my-2" {...props}>{children}</h3>
          ),
          li: ({children, ...props}) => (
            <li style={blackTextStyle} className="text-black !important" {...props}>{children}</li>
          ),
          span: ({children, ...props}) => (
            <span style={blackTextStyle} className="text-black !important" {...props}>{children}</span>
          ),
          strong: ({children, ...props}) => (
            <strong style={blackTextStyle} className="text-black !important font-bold" {...props}>{children}</strong>
          ),
          em: ({children, ...props}) => (
            <em style={blackTextStyle} className="text-black !important italic" {...props}>{children}</em>
          ),
          // Handle code blocks with default styling
          code: ({className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <CodeBlock className={className} {...props}>
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 