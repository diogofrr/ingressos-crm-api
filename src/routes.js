import { Router } from "express";
import userController from "./app/Controller/userController.js";
import userRequest from "./app/Request/userRequest.js";
import ticketController from "./app/Controller/ticketController.js";
import ticketRequest from "./app/Request/ticketRequest.js";
import jwtUtils from "./app/Utils/jwtUtils.js";

const router  = Router();

//GET
router.get('/tickets', jwtUtils.checkToken, ticketController.getAllTickets);
router.get('/ticket', jwtUtils.checkToken, ticketRequest.getTicket, ticketController.getTicket);
router.get('/search', jwtUtils.checkToken, ticketController.getSearch);

//POST
router.post('/user', userRequest.postUser,userController.postUser);
router.post('/login', userRequest.postLogin,userController.postLogin);
router.post('/ticket', jwtUtils.checkToken, ticketRequest.postTicket, ticketController.postTicket);
router.post('/validate', jwtUtils.checkToken, ticketRequest.validate, ticketController.validate);

//PUT
router.put('/del-ticket', jwtUtils.checkToken, ticketRequest.delTicket, ticketController.delTicket);
router.put('/ticket', jwtUtils.checkToken, ticketRequest.putTicket, ticketController.putTicket);



//DELETE



router.use((req, res) => {res.status(404).json({error: true,msgUser: "Rota não encontrada.",msgOriginal: "Rota não encontrada." })});

export default router 