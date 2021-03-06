var db = require("../models");

var passport = require("passport");

module.exports = function(app) {
  app.get("/accounts/view", function(req, res) {
    console.log("%%%%%%%%% is logged in", req.isAuthenticated());

    if (req.isAuthenticated()) {
      db.Accounts.findOne({
        where: {
          uuid: req.session.passport.user
        }
      }).then(function(dbUser) {
        var user = {
          userInfo: dbUser.dataValues,
          id: req.session.passport.user,
          isloggedin: req.isAuthenticated()
        };
        res.render("index", user);
      });
    } else {
      var user = {
        id: null,
        isloggedin: req.isAuthenticated()
      };
      res.redirect("/");
    }
  });

  // logout
  app.put("/logout", function(req, res) {
    req.session.destroy(function() {
      req.logout();
      res.clearCookie("name");
      res.clearCookie("user_id");
      res.clearCookie("user_sid");
      res.redirect("/");
    });
    console.log("you've been logged out");
  });

  // process the signup form ==============================================
  //=======================================================================

  app.post("/signup", function(req, res, next) {
    passport.authenticate("local-signup", function(err, user, info) {
      if (err) {
        console.log("passport err", err);
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (!user) {
        console.log("user error", user);
        return res.send({ success: false, message: "authentication failed" });
      }

      req.login(user, function(err) {
        if (err) {
          console.log("err", err);
          return next(err);
        }

        console.log("redirecting....");

        res.cookie("name", user.name);
        res.cookie("user_id", user.uuid);
        return res.redirect("/viewuser");
      });
    })(req, res, next);
  });

  app.post("/login", function(req, res, next) {
    passport.authenticate("local-login", function(err, user) {
      if (err) {
        console.log("passport err", err);
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status

      if (!user) {
        console.log("no user");
        return res.send({ success: false, message: "authentication failed" });
      }

      req.login(user, function(err) {
        if (err) {
          console.log("err", err);
          return next(err);
        }
        console.log("redirecting....");

        res.cookie("name", user.name);
        res.cookie("user_id", user.uuid);
        return res.redirect("/viewuser");
      });
    })(req, res, next);
  });
};
