import User from "../Models/userModel.js";
import { registerUser, loginUser } from "../controller/userController.js";

async function userRoutes(fastify, options) {
  fastify.post("/register", registerUser);
  fastify.post("/login", loginUser);
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
  const user = await User.findByPk(request.user.id);
     if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }
  reply.send({
    boxId: user.boxId,
    statut: user.statut
  });
});

}
export default userRoutes;