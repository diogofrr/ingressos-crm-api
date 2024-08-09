import { Router } from "express";
import userController from "./app/Controller/userController.js";
import userRequest from "./app/Request/userRequest.js";
import ticketController from "./app/Controller/ticketController.js";
import ticketRequest from "./app/Request/ticketRequest.js";
import jwtUtils from "./app/Utils/jwtUtils.js";

const router  = Router();

//GET
router.get('/tickets', jwtUtils.checkToken, ticketController.getAllTickets);

//POST
router.post('/user', userRequest.postUser,userController.postUser);
router.post('/login', userRequest.postLogin,userController.postLogin);
router.post('/ticket', jwtUtils.checkToken, ticketRequest.postTicket, ticketController.postTicket);
router.post('/teste', ticketController.teste);

//PUT



//DELETE



router.use((req, res) => {res.status(404).json({error: true,msgUser: "Rota não encontrada.",msgOriginal: "Rota não encontrada." })});

export default router 