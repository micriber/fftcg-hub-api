import { OAuth2Client } from 'google-auth-library';
import {
    LoginTicket,
    TokenPayload,
} from 'google-auth-library/build/src/auth/loginticket';
import logger from '../../utils/logger';

/* istanbul ignore next */
export default class GoogleOAuth {
    public async verifyIdToken(
        idToken: string,
        callback: (
            error: Error | null,
            tokenPayload?: TokenPayload
        ) => Promise<void>
    ): Promise<void> {
        if (process.env.NODE_ENV === 'test') {
            if (idToken === 'badIdToken') {
                await callback(new Error());
                return;
            }

            await callback(null, {
                aud: '',
                exp: 0,
                iat: 0,
                iss: '',
                sub: '',
                email: `email${idToken}@gmail.com`,
                given_name: `firstName${idToken}`,
                family_name: `lastName${idToken}`,
                locale: 'fr',
            });
            return;
        }

        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        client
            .verifyIdToken({
                idToken: idToken,
                audience: process.env.GOOGLE_CLIENT_ID,
            })
            .then(async (loginTicket: LoginTicket) => {
                const loginPayload = loginTicket.getPayload() as TokenPayload;

                if (!loginPayload.email) {
                    logger.error(loginPayload);
                    throw new Error('Missing email in token');
                }
                if (!loginPayload.locale) {
                    logger.error(loginPayload);
                    throw new Error('Missing locale in token');
                }

                await callback(null, loginPayload);
            })
            .catch(async (error) => {
                if (error instanceof Error) {
                    logger.error(error.message);
                    await callback(error);
                }
            });
    }
}
