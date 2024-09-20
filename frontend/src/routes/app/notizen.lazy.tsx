import { createLazyFileRoute } from '@tanstack/react-router';
import { NotizenTemplate } from '../../components/atomic/templates/Notizen.component.js';

export const Route = createLazyFileRoute('/app/notizen')({
  component: Notizen,
});

function Notizen() {
  return <NotizenTemplate />;
}
