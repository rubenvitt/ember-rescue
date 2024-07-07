import { createFileRoute } from '@tanstack/react-router';
import { GenericForm } from '../../components/atomic/organisms/GenericForm.component.js';
import { Settings, useSettings } from '../../hooks/settings.hook.js';

export const Route = createFileRoute('/admin/')({
  component: AdminPage,
});

function AdminPage() {
  const { settings, save } = useSettings();

  if (!settings.isFetchedAfterMount || !settings.data) return null;

  return <GenericForm<Settings>
    defaultValues={{ ...settings.data }}
    onSubmit={(data) => {
      save.mutate(data);
    }}
    sections={[
      {
        fields: [
          {
            name: 'mapboxApi',
            type: 'text',
            label: 'Mapbox API Key',
          },
        ],
      },
    ]} />;
}