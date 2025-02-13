import { useSearchBoxCore } from '@mapbox/search-js-react';
import { AutoComplete, AutoCompleteProps } from 'antd';
import { useState } from 'react';
import { useSecret } from '../../../hooks/secrets.hook.js';

interface Props {
    defaultValue?: string;
    onChange?: (value: string) => void;
    label?: string;
    required?: boolean;
}

export function AddressAutocomplete({ defaultValue, onChange, label = 'Adresse', required = false }: Props) {
    const { secret } = useSecret({ secretKey: 'mapboxApi' });
    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

    const searchBox = useSearchBoxCore({
        accessToken: secret.data?.value ?? '',
        country: 'de',
        proximity: '10.55,52.96',
        language: 'de',
        // @ts-ignore api is newer
        types: new Set(['country', 'region', 'postcode', 'district', 'place', 'locality', 'neighborhood', 'street', 'address']),
    });

    const handleSearch = async (value: string) => {
        if (!value || !secret.data?.value) {
            setOptions([]);
            return;
        }

        try {
            const results = await searchBox.suggest(value, { sessionToken: 'test-asd' });
            const formattedOptions = results.suggestions.map(result => ({
                id: result.mapbox_id,
                value: result.name + ', ' + result.place_formatted,
                label: result.name + ", " + result.place_formatted,
            }));
            setOptions(formattedOptions);
        } catch (error) {
            console.error('Error fetching address suggestions:', error);
            setOptions([]);
        }
    };

    return (
        <AutoComplete
            defaultValue={defaultValue}
            options={options}
            onSearch={handleSearch}
            onChange={onChange}
            placeholder="Adresse eingeben..."
            allowClear
            // @ts-ignore
            spellCheck={false}
            style={{ width: '100%' }}
        />
    );
} 