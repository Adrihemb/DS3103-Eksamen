import { Router } from 'express';
import { someControllerMethod } from '../controllers';

const router = Router();

router.get('/some-endpoint', someControllerMethod);

export default router;