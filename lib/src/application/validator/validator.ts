import * as Joi from 'joi';

export const validator = Joi.object().keys({
  title: Joi.string()
    .trim()
    .required(),
  logo: Joi.string().trim(),
});
