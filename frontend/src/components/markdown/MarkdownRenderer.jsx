import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const headingBase =
  'font-semibold tracking-tight text-white border-b border-white/10 pb-2 mb-4';

const headingStyles = {
  h1: `text-2xl md:text-3xl ${headingBase}`,
  h2: `text-xl md:text-2xl ${headingBase}`,
  h3: `text-lg md:text-xl font-semibold text-[#A7BFFF] mb-3`,
};

const listBase = 'space-y-2 pl-6 text-sm md:text-base text-[#E0E0E0]';

const MarkdownRenderer = ({ content, className = '', components = {} }) => {
  if (!content) return null;

  return (
    <div
      className={`markdown-content prose prose-invert max-w-none text-[#E0E0E0] prose-headings:text-white prose-p:text-[#C7CBE6] prose-strong:text-white prose-ul:text-[#E0E0E0] prose-li:text-[#E0E0E0] ${className}`}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className={headingStyles.h1} {...props} />,
          h2: ({ node, ...props }) => <h2 className={headingStyles.h2} {...props} />,
          h3: ({ node, ...props }) => <h3 className={headingStyles.h3} {...props} />,
          h4: ({ node, ...props }) => (
            <h4 className="text-lg font-semibold text-[#D3E4FF] mb-2" {...props} />
          ),
          p: ({ node, ...props }) => (
            <p className="leading-relaxed text-sm md:text-base text-[#C7CBE6]" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className={`list-disc ${listBase}`} {...props} />,
          ol: ({ node, ...props }) => (
            <ol className={`list-decimal ${listBase}`} {...props} />
          ),
          li: ({ node, children, ...props }) => (
            <li className="pl-1 marker:text-[#4DCFFF]" {...props}>
              <span className="text-[#E8ECFF]">{children}</span>
            </li>
          ),
          strong: ({ node, ...props }) => (
            <strong className="text-white font-semibold" {...props} />
          ),
          em: ({ node, ...props }) => <em className="italic text-[#B3B8DD]" {...props} />,
          code: ({ node, inline, ...props }) =>
            inline ? (
              <code
                className="bg-white/10 text-[#FFB7D5] px-1.5 py-0.5 rounded"
                {...props}
              />
            ) : (
              <code
                className="block bg-black/40 border border-white/10 rounded-lg p-4 text-[#FFB7D5] text-sm overflow-x-auto"
                {...props}
              />
            ),
          blockquote: ({ node, ...props }) => (
            <blockquote
              className="border-l-4 border-[#4DCFFF] bg-white/5 rounded-xl px-4 py-3 text-[#E8ECFF] italic"
              {...props}
            />
          ),
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto">
              <table
                className="min-w-full border border-white/10 text-sm text-left"
                {...props}
              />
            </div>
          ),
          th: ({ node, ...props }) => (
            <th
              className="bg-white/10 text-[#E8ECFF] font-semibold px-3 py-2 border border-white/10"
              {...props}
            />
          ),
          td: ({ node, ...props }) => (
            <td className="px-3 py-2 border border-white/10 text-[#C7CBE6]" {...props} />
          ),
          ...components,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;