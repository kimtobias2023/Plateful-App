import Session from "./../../models/mongoose/Session.mjs";

export async function validateSession(loginToken) {
  const session = await Session.findOne({
    loginToken,
    loginTokenExpires: { $gt: new Date() }, // Ensure token hasn't expired
  });

  if (!session) {
    throw new Error("Invalid or expired session.");
  }

  return session.userId; // Return the associated Sequelize userId
}

