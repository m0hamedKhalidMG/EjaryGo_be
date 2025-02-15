const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const jwt = require("jsonwebtoken");

// Replace with actual DB calls
const { getUserByEmail, createUser } = require("../models/userModel");

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        let user = await getUserByEmail(profile.emails[0].value);
        if (!user) {
          // Create a new user if not found
          user = {
            name: profile.displayName,
            email: profile.email,
            img: profile.picture,
            authMethod: "google",
            balance: 0,
          };
          user = await createUser(user);
        }
        // Generate JWT Token for API authentication
        const token = jwt.sign({email: user.email }, process.env.JWT_SECRET, { expiresIn: "30d" });

        return done(null, { user, token });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => done(null, user));

// Deserialize user from session
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
