import axios from 'axios';
import { SearchResponseInterface } from 'src/jaknot/models/search.models';

export abstract class RequestUtils {
    private readonly USER_AGENT =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0';

    static responseApi(status, message, data) {
        const result: SearchResponseInterface = {};

        result.status = [200, 201].includes(status) ? 'ok' : 'error';
        result.message = message;
        result.data = data;

        return result;
    }

    static async getRequest(url: string, headers?: any, options?: any) {
        try {
            const { data } = await axios.get(url, {
                headers,
            });

            return data;
        } catch (error) {
            throw new Error(error);
        }
    }
}
