import { createLazyFileRoute } from '@tanstack/react-router';
import ReactMarkdown from 'react-markdown';
import Docs from '../docs/index.md';

export const Route = createLazyFileRoute('/docs')({
  component: DocsComponent,
});

function DocsComponent() {
  return <ReactMarkdown
    className="dark:text-white"
    components={{
      div: (content) => <div {...content} className="text-red-500" />,
      h1: (props) => <h2 {...props} className="text-yellow-300" />,
    }}
    children={Docs}
  />;
}