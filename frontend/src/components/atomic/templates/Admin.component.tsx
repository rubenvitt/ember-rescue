import { SettingsDto } from '@bluelight-hub/shared/client/index.js';
import { ButtonProps, Form, Input, Typography } from 'antd';
import { useSettings } from '../../../hooks/settings.hook.js';
import { FormContentBox } from '../organisms/form/FormContentBox.component.js';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { FormSection } from '../organisms/form/FormSection.component.js';
import { EditableFahrzeugeTable } from '../organisms/table/EditableFahrzeugeTable.component.js';
import { EditableUAVTable } from '../organisms/table/EditableUAVTable.component.js';

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
      <div className="mx-4 my-12 flex flex-col gap-4">
        <Typography.Title level={3}>Templates</Typography.Title>
        <FormSection className="w-full" heading="Fahrzeug-Templates" subHeading="Verwalten Sie hier die verfügbaren Fahrzeug-Templates.">
          <FormContentBox>
            <EditableFahrzeugeTable />
          </FormContentBox>
        </FormSection>
        <FormSection className="w-full" heading="UAV-Templates" subHeading="Verwalten Sie hier die verfügbaren UAV-Templates.">
          <FormContentBox>
            <EditableUAVTable />
          </FormContentBox>
        </FormSection>
      </div>
    </div>
  );
}
