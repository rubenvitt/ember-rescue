import { VehicleOnMissionDto } from "@bluelight-hub/shared/client/index.ts";
import { DefaultOptionType } from "antd/lib/select/index.js";

export function convertToItems(fahrzeuge?: VehicleOnMissionDto[]) {
    if (!fahrzeuge) {
        return [];
    } else {
        return fahrzeuge.map((item) => {
            return {
                label: <VehicleSelectItem item={item} />,
                value: item.fullOpta,
                title: item.optaFunktion,
                item,
            } satisfies DefaultOptionType;
        });
    }
}

function VehicleSelectItem({ item }: { item: VehicleOnMissionDto }) {
    return <span>{item.fullOpta} <span className="text-gray-500 dark:text-gray-300">({item.optaFunktion})</span></span>;
}
