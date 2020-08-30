import Joi from 'joi';
import {version} from "../entities/userCard";

export default Joi.object().keys({
    quantity: Joi.number().min(0).required(),
    version: Joi.string().valid(version.CLASSIC,version.FOIL,version.FULL_ART)
});
