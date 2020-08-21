import express from 'express';
import swaggerUi from 'swagger-ui-express'
import YAML from 'yamljs';
import userRouter from './user';
import loginRouter from './login';
import authCheck from "../middlewares/authCheck";

const router = express.Router();

router.use(authCheck);

const swaggerDocument = YAML.load(__dirname + '/../swagger.yaml');
router.use('/swagger', swaggerUi.serve);
router.get('/swagger', swaggerUi.setup(swaggerDocument));

router.use(userRouter);
router.use(loginRouter);

export default router;
