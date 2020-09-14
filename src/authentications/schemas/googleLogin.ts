import Joi from 'joi';

export type googleLoginBody = {
    idToken: string;
};

export default Joi.object().keys({
    idToken: Joi.string().min(1).required(),
});
