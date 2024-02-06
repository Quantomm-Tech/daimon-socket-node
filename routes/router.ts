import { Router, Request, Response } from "express";
import { authMiddleware } from "./authMiddleware";

const router = Router();

router.get("/mensajes", (req: Request, res: Response) => {
  res.json({
    ok: true,
    mensaje: "Todo esta bien el servicio funciona!!",
  });
});

// router.post("/mensajes", authMiddleware, (req: Request, res: Response) => {
router.post("/mensajes", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;

  // Enviar mensaje al cliente
  const io = req.app.get("io");

  if (io) {
    console.log("Se va emitir ...");
    io.emit("message", req.body);
  }

  res.json({
    ok: true,
    cuerpo,
    de,
  });
});

router.post("/mensajes/:id", (req: Request, res: Response) => {
  const cuerpo = req.body.cuerpo;
  const de = req.body.de;
  const id = req.params.id;

  res.json({
    ok: true,
    cuerpo,
    de,
    id,
  });
});

router.post("/notification/:companyId", (req: Request, res: Response) => {
  const companyId = req.params.companyId;

  const notificationType = req.body.notificationType;

  if (notificationType && companyId) {
    const io = req.app.get("io");
    if (io) {
      console.log(`Se va emitir a: notification-${companyId}`);
      io.emit(`notification-${companyId}`, req.body);
    }

    res.json({
      isSuccess: true,
      data: req.body,
    });
  } else {
    res.json({
      isSuccess: false,
      error: "Bad request",
    });
  }
});

router.post("/paystate/:beneficiaryId", (req: Request, res: Response) => {
  const beneficiaryId = req.params.beneficiaryId;

  if (beneficiaryId) {
    const io = req.app.get("io");
    if (io) {
      console.log(`Se va emitir a: paystate-${beneficiaryId}`);
      io.emit(`paystate-${beneficiaryId}`, req.body);
    }

    res.json({
      isSuccess: true,
      data: req.body,
    });
  } else {
    res.json({
      isSuccess: false,
      error: "Bad request",
    });
  }
});

export default router;
