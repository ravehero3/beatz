import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import beatsRouter from "./beats";
import artistsRouter from "./artists";
import ordersRouter from "./orders";
import withdrawalsRouter from "./withdrawals";
import savedRouter from "./saved";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(beatsRouter);
router.use(artistsRouter);
router.use(ordersRouter);
router.use(withdrawalsRouter);
router.use(savedRouter);
router.use(dashboardRouter);

export default router;
