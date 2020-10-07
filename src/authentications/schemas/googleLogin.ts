import Joi from 'joi';

export type GoogleLoginBody = {
    idToken: string;
};

export default Joi.object().keys({
    idToken: Joi.string().min(1).required(),
});
