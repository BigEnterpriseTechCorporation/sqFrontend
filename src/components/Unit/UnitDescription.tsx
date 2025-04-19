import { MDXRemote } from 'next-mdx-remote';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface UnitDescriptionProps {
  mdxSource: MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> | null;
  fallbackText: string;
}

export default function UnitDescription({ mdxSource, fallbackText }: UnitDescriptionProps) {
  return (
    <div className="prose prose-lg max-w-none mb-6">
      {mdxSource ? (
        <MDXRemote {...mdxSource} />
      ) : (
        <p>{fallbackText}</p>
      )}
    </div>
  );
} 