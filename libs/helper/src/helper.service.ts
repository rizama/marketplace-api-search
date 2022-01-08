import { Injectable } from '@nestjs/common';
import { SearchResponseInterface } from 'src/jaknot/dto/search.dto';

@Injectable()
export class HelperService {
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
