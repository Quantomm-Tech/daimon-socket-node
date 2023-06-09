
import { Router, Request, Response } from 'express';
import { authMiddleware } from './authMiddleware';

const router = Router();

router.get('/mensajes', ( req: Request, res: Response  ) => {

    res.json({
        ok: true,
        mensaje: 'Todo esta bien!!'
    });

});

router.post('/mensajes', authMiddleware, ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    // Enviar mensaje al cliente
    const io = req.app.get('io')

    if (io) {
        console.log('Se va emitir ...')
        io.emit('message', req.body)
    }
        

    res.json({
        ok: true,
        cuerpo,
        de
    });

});


router.post('/mensajes/:id', ( req: Request, res: Response  ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});



export default router;


