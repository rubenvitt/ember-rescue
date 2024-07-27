import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/docs/')({
  component: () => <div>Hello /docs/!</div>
})