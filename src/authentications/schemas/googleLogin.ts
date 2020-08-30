import Joi from 'joi';

export default Joi.object().keys({
    idToken: Joi.string().min(1).required()
});
