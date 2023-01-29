import express from "express";
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from "cookie-parser";
import session from "express-session";
import { prisma } from "./utils/prisma";

import dotenv from "dotenv";

import passportJWT from "passport-jwt";
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
    name: "user",
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SESSION_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await prisma.user.findFirst({
          where: {
            id: jwtPayload.id,
          },
        });
        if (!user) {
          return done(null, false, { message: "Invalid token." });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

export default app;
