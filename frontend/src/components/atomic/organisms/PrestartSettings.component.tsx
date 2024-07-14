import { GenericForm } from './GenericForm.component.js';
import storage from '../../../lib/storage.js';

export type LocalSettings = {
  baseUrl: string,
  baseUrlHistory: string[]
}

export function PrestartSettings() {
  const localSettings = storage().readLocalStorage<LocalSettings>('localSettings');

  return <>
    <GenericForm<LocalSettings>
      defaultValues={localSettings ?? {
        baseUrl: 'http://localhost:3000',
        baseUrlHistory: [],
      }}
      onSubmit={(data) => {
        const currentSettings = localSettings ?? { baseUrlHistory: [] };
        const updatedSettings = {
          ...data,
          baseUrlHistory: [data.baseUrl, ...(currentSettings.baseUrlHistory ?? []).filter(url => url !== data.baseUrl)],
        };
        console.log('saving items', updatedSettings);
        storage().writeLocalStorage('localSettings', updatedSettings);
      }}
      sections={[{
        title: 'Backend API',
        fields: [{
          name: 'baseUrl',
          type: 'text',
          label: 'URL zur Backend API',
          width: 'full',
        }],
      }]} />
  </>;
}