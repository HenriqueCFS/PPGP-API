import passport from "passport";
const requireAuth = passport.authenticate("jwt", {
  session: false,
});

export default requireAuth;
