import { Router } from "express";
import ticketController from "./app/Controller/ticketController.js";
import userController from "./app/Controller/userController.js";
import ticketRequest from "./app/Request/ticketRequest.js";
import userRequest from "./app/Request/userRequest.js";
import jwtUtils from "./app/Utils/jwtUtils.js";

const router = Router();

// Users
router.post("/users", userRequest.postUser, userController.postUser);
router.post("/login", userRequest.postLogin, userController.postLogin);

// Tickets (RESTful)
router.get("/tickets", jwtUtils.checkToken, ticketController.getAllTickets);
router.get(
  "/tickets/:id",
  jwtUtils.checkToken,
  ticketRequest.getTicket,
  ticketController.getTicket
);
router.post(
  "/tickets",
  jwtUtils.checkToken,
  ticketRequest.postTicket,
  ticketController.postTicket
);

router.post(
  "/tickets/validate",
  jwtUtils.checkToken,
  ticketRequest.validate,
  ticketController.validate
);
router.put(
  "/tickets/:id",
  jwtUtils.checkToken,
  ticketRequest.putTicket,
  ticketController.putTicket
);
router.delete(
  "/tickets/:id",
  jwtUtils.checkToken,
  ticketRequest.delTicket,
  ticketController.delTicket
);
router.put(
  "/tickets/:id/activate",
  jwtUtils.checkToken,
  ticketRequest.activateTicket,
  ticketController.activateTicket
);

router.use((req, res) => {
  res.status(404).json({
    error: true,
    msgUser: "Rota não encontrada.",
    msgOriginal: "Rota não encontrada.",
  });
});

export default router;
