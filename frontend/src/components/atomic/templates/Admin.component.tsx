import { useSettings } from '../../../hooks/settings.hook.js';
import { EditableFahrzeugeTable } from '../organisms/table/EditableFahrzeugeTable.component.js';
import { Input } from 'formik-antd';
import * as Yup from 'yup';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormSection } from '../organisms/form/FormSection.component.js';
import { FormContentBox } from '../organisms/form/FormContentBox.component.js';
import { OptaInput } from '../molecules/OptaInput.component.js';
import { SettingsDto } from '@ember-rescue/shared/client/index.js';

const ApiCredentialsSchema = Yup.object().shape({
  mapboxApi: Yup.string()
    .optional()
    .matches(/^pk\.ey/, 'Mapbox API Key muss mit "pk.ey" beginnen.'),
});

export function AdminTemplate() {
  const { settings, save } = useSettings();

  if (!settings.isFetchedAfterMount || !settings.data) return null;

  return (
    <div className="space-y-4 p-6">
      <FormLayout<SettingsDto>
        type="sectioned"
        formik={{
          validationSchema: ApiCredentialsSchema,
          onSubmit: (data) => save.mutate(data),
          initialValues: { mapboxApi: settings.data.data.mapboxApi ?? '' },
        }}
        buttons={{
          submit: {
            type: 'primary',
            children: 'Speichern',
            loading: save.isPending,
          },
          reset: {
            type: 'default',
            children: 'Formular zurücksetzen',
          },
        }}
      >
        <FormSection className="w-full" heading="API Keys" subHeading="API Keys für externe Services. Verwendung möglich für jede Nutzer:in der Anwendung.">
          <FormContentBox>
            <InputWrapper label="Mapbox Public API Key" name={'mapboxApi'}>
              <Input.Password variant="filled" name="mapboxApi" />
            </InputWrapper>
          </FormContentBox>
        </FormSection>
      </FormLayout>

      <div className="rounded-xl bg-amber-100 p-4">
        <h2>Input Test</h2>
        <OptaInput
          onBlur={(opta) => {
            console.log(`onBlur: neue Opta: ${JSON.stringify(opta)}`);
          }}
          onChange={(opta) => {
            console.log(`onChange: neue Opta: ${JSON.stringify(opta)}`);
          }}
        />
      </div>

      <EditableFahrzeugeTable />
    </div>
  );
}
