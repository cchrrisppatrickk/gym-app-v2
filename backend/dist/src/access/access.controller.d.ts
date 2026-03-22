import { AccessService } from './access.service';
import { ValidateAccessDto } from './dto/validate-access.dto';
export declare class AccessController {
    private readonly accessService;
    constructor(accessService: AccessService);
    validate(validateAccessDto: ValidateAccessDto): Promise<{
        status: string;
        message: string;
        debt?: undefined;
        user?: undefined;
    } | {
        status: string;
        message: string;
        debt: number;
        user: string;
    } | {
        status: string;
        message: string;
        user: string;
        debt?: undefined;
    }>;
}
