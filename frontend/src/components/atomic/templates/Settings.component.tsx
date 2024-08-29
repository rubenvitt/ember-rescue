import { useNavigate } from '@tanstack/react-router';
import { ArrowLeftIcon } from '@heroicons/react/16/solid/index.js';
import { PrestartSettings } from '../organisms/PrestartSettings.component.js';

export function SettingsTemplate() {
  const navigate = useNavigate({ from: '/prestart/settings' });
  return <div>
    <div className="absolute top-4 left-4">
      <button
        onClick={() => {
          navigate({
            to: '/signin',
          });
        }}
        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        aria-label="Zurück"
      >
        <ArrowLeftIcon className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
    <div className="mt-12 px-6">
      <PrestartSettings />
    </div>
  </div>;

}