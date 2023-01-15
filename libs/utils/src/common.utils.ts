export abstract class CommonUtils {
    static enumValueToArray(enumData) {
        return Object.values(enumData);
    }

    static responseApi(status, message, data) {
        const result = {};

        result['status'] = [200, 201].includes(status) ? 'ok' : 'error';
        result['message'] = message;
        result['data'] = data;

        return result;
    }

    static verifyValue(value) {
        return value ?? null;
    }

    static isArrayAndNotEmpty(values) {
        if (values && values.length) {
            return true;
        }

        return false;
    }

    static isUndefinedOrNan(value) {
        if (!value || isNaN(value)) {
            return true;
        }

        return false;
    }
}
