import { SearchResponseInterface } from "src/jaknot/models/search.models";

export abstract class CommonUtils {
    static enumValueToArray(enumData) {
        return Object.values(enumData);
    }

    static responseApi(status, message, data) {
        const result: SearchResponseInterface = {};

        result.status = [200, 201].includes(status) ? 'ok' : 'error';
        result.message = message;
        result.data = data;

        return result;
    }
}
