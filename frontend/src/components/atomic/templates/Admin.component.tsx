import { useSettings } from '../../../hooks/settings.hook.js';
import { EditableFahrzeugeTable } from '../organisms/table/EditableFahrzeugeTable.component.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { FormSection } from '../organisms/form/FormSection.component.js';
import { FormContentBox } from '../organisms/form/FormContentBox.component.js';
import { OptaInput } from '../molecules/OptaInput.component.js';
import { SettingsDto } from '@bluelight-hub/shared/client/index.js';
import { ButtonProps, Form, Input } from 'antd';

export function AdminTemplate() {
  const { settings, save } = useSettings();

  const buttons: { submit: ButtonProps; reset: ButtonProps } = {
    submit: {
      type: 'primary',
      children: 'Speichern',
      loading: save.isPending,
    },
    reset: {
      type: 'default',
      children: 'Formular zurücksetzen',
    },
  };

  if (!settings.isFetchedAfterMount || !settings.data) return null;

  return (
    <div className="space-y-4 p-6">
      <FormLayout<SettingsDto>
        type="sectioned"
        form={{
          layout: 'vertical',
          async onFinish(data) {
            await save.mutateAsync(data);
          },
          initialValues: settings.data.data,
        }}
        buttons={buttons}
      >
        <FormSection className="w-full" heading="API Keys" subHeading="API Keys für externe Services. Verwendung möglich für jede Nutzer:in der Anwendung.">
          <FormContentBox>
            <Form.Item name="mapboxApi" label="Mapbox Public API Key" className="w-full" rules={[{ pattern: /^pk\.ey/, message: 'Mapbox API Key muss mit "pk.ey" beginnen.' }]}>
              <Input.Password rootClassName="dark:bg-gray-600/50" variant="filled" />
            </Form.Item>
          </FormContentBox>
        </FormSection>
      </FormLayout>

      <div className="rounded-xl bg-amber-100 p-4 dark:bg-amber-900">
        <h2>Input Test</h2>
        <OptaInput
          value={{
            id: 'test',
            fullOpta: 'Banana-Wagen',
            ort: 'Test',
            district: 'Test',
            functionCode: 'Test',
            supplement: 'Test',
            bosCode: 'Test',
            orderNumber: 'Test',
            localCode: 'Test',
          }}
          onChange={(opta) => {
            // FIXME[ember-rescue-68](rubeen, 19.12.24): being called to often
            console.log(`onChange: neue Opta: ${JSON.stringify(opta)}`);
          }}
        />

        <OptaInput
          value={{
            id: 'test',
            fullOpta: 'NI DRK Uelzen 40-12-1',
            ort: '',
            district: '',
            functionCode: '',
            supplement: '',
            bosCode: '',
            orderNumber: '',
            localCode: '',
          }}
          onChange={() => {}}
        />
      </div>

      <EditableFahrzeugeTable />
    </div>
  );
}
