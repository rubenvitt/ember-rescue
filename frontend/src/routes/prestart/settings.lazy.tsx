import { createLazyFileRoute } from '@tanstack/react-router';
import { SettingsTemplate } from '../../components/atomic/templates/Settings.component.js';

export const Route = createLazyFileRoute('/prestart/settings')({
  component: () => <Settings />,
});

export function Settings() {
  return <SettingsTemplate />;
}
