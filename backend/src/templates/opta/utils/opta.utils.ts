export interface OptaData {
    district?: string;
    bosCode?: string;
    ort?: string;
    localCode?: string;
    functionCode?: string;
    orderNumber?: string | number;
    fullOpta?: string;
}

/**
 * Generates a full OPTA string from the given OPTA data components
 * Format: [DISTRICT] [BOS] [ORT] [LOCAL_CODE]-[FUNCTION_CODE]-[ORDER_NUMBER]
 */
export function generateFullOpta(data: OptaData): string {
    const parts = [
        data.district ? `${data.district}` : '',
        data.bosCode ? `${data.bosCode}` : '',
        data.ort ? `${data.ort}` : '',
        data.localCode ? `${data.localCode}` : '',
        data.functionCode ? `${data.functionCode}` : '',
        data.orderNumber ? `${data.orderNumber}` : '',
    ];

    if (parts.every((part) => part === '')) {
        return data.fullOpta ?? '';
    }

    const [
        districtPart,
        bosCodePart,
        ortPart,
        localCodePart,
        functionCodePart,
        orderNumberPart,
    ] = parts.filter((part) => part !== '');

    let fullOpta = [districtPart, bosCodePart, ortPart]
        .filter((part) => part)
        .join(' ');

    const codesPart = [localCodePart, functionCodePart]
        .filter((part) => part)
        .join('-');

    if (codesPart) {
        fullOpta += ` ${codesPart}`;
    }

    if (orderNumberPart) {
        fullOpta += `-${orderNumberPart}`;
    }

    return fullOpta;
} 