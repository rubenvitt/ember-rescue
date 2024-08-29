import { Settings, useSettings } from '../../../hooks/settings.hook.js';
import { EditableEinheitenTable } from '../organisms/table/EditableEinheitenTable.component.js';
import { Input } from 'formik-antd';
import * as Yup from 'yup';
import { FormLayout } from '../organisms/form/FormLayout.comonent.js';
import { InputWrapper } from '../atoms/InputWrapper.component.js';
import { FormSection } from '../organisms/form/FormSection.component.js';
import { FormContentBox } from '../organisms/form/FormContentBox.component.js';

const ApiCredentialsSchema = Yup.object().shape({
  mapboxApi: Yup.string().optional().matches(/^pk\.ey/, 'Mapbox API Key muss mit "pk.ey" beginnen.'),
});

export function AdminTemplate() {
  const { settings, save } = useSettings();

  if (!settings.isFetchedAfterMount || !settings.data) return null;

  return <div className="p-6 space-y-4">
    <FormLayout<Settings> type="sectioned" formik={{
      validationSchema: ApiCredentialsSchema,
      onSubmit: (data) => save.mutate(data),
      initialValues: { mapboxApi: settings.data.mapboxApi ?? '' },
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
      <FormSection className="w-full" heading="API Keys"
                   subHeading="API Keys für externe Services. Verwendung möglich für jede Nutzer:in der Anwendung.">
        <FormContentBox>
          <InputWrapper label="Mapbox Public API Key" name={'mapboxApi'}>
            <Input.Password variant="filled" name="mapboxApi" />
          </InputWrapper>
        </FormContentBox>
      </FormSection>
    </FormLayout>

    <EditableEinheitenTable />
  </div>;
}