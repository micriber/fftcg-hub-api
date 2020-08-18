import Joi from "joi";

const string = Joi.string().alphanum();

export default Joi.object().keys({
    token: string.min(3).max(30).required(),
    service: string.min(3).max(30).required(),
});
