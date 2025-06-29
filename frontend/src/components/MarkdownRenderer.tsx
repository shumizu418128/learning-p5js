import { Box, Typography } from '@mui/material'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  sx?: any
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, sx }) => {
  return (
    <Box sx={sx} className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // コードブロックのカスタマイズ
          code: (props) => {
            const { inline, className, children, ...rest } = props
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''

            if (inline) {
              return (
                <code
                  style={{
                    backgroundColor: '#f1f3f4',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontSize: '0.9em',
                    fontFamily: 'monospace',
                    color: '#d73a49'
                  }}
                  {...rest}
                >
                  {children}
                </code>
              )
            }

            return (
              <Box
                component="div"
                sx={{
                  p: 2,
                  my: 1,
                  background: '#1e1e1e',
                  color: '#d4d4d4',
                  borderRadius: '8px',
                  overflow: 'auto',
                  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  border: '1px solid #333'
                }}
              >
                {language && (
                  <Typography
                    variant="caption"
                    sx={{
                      display: 'block',
                      mb: 1,
                      color: '#888',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  >
                    {language}
                  </Typography>
                )}
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  <code className={className} {...rest}>
                    {children}
                  </code>
                </pre>
              </Box>
            )
          },
          // 見出しのカスタマイズ
          h1: ({ children }) => (
            <Typography variant="h4" sx={{ mt: 2, mb: 1, fontWeight: 700, color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          h2: ({ children }) => (
            <Typography variant="h5" sx={{ mt: 2, mb: 1, fontWeight: 600, color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          h3: ({ children }) => (
            <Typography variant="h6" sx={{ mt: 1.5, mb: 0.5, fontWeight: 600, color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          // 段落のカスタマイズ
          p: ({ children }) => (
            <Typography variant="body2" sx={{ mb: 1, lineHeight: 1.6, color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          // リストのカスタマイズ
          ul: ({ children }) => (
            <Box component="ul" sx={{ pl: 2, mb: 1 }}>
              {children}
            </Box>
          ),
          ol: ({ children }) => (
            <Box component="ol" sx={{ pl: 2, mb: 1 }}>
              {children}
            </Box>
          ),
          li: ({ children }) => (
            <Typography variant="body2" component="li" sx={{ mb: 0.5, lineHeight: 1.6, color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          // 強調のカスタマイズ
          strong: ({ children }) => (
            <Typography component="span" sx={{ fontWeight: 700, color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          em: ({ children }) => (
            <Typography component="span" sx={{ fontStyle: 'italic', color: '#2c3e50' }}>
              {children}
            </Typography>
          ),
          // リンクのカスタマイズ
          a: ({ href, children }) => (
            <Typography
              component="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: '#667eea',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              {children}
            </Typography>
          ),
          // 引用のカスタマイズ
          blockquote: ({ children }) => (
            <Box
              component="div"
              sx={{
                p: 2,
                my: 1,
                borderLeft: '4px solid #667eea',
                background: '#f8f9fa',
                borderRadius: '4px'
              }}
            >
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#6c757d' }}>
                {children}
              </Typography>
            </Box>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </Box>
  )
}

export default MarkdownRenderer
