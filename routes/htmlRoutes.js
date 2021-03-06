var db = require("../models");

module.exports = function(app) {
  // +-*/+-*/+-*/+-*/+-*/+-*/+-*/+-*/
  // GATE KEEPER
  // +-*/+-*/+-*/+-*/+-*/+-*/+-*/+-*/

  // the root will go to the table of contents...
  // if the user is already logged in
  // otherwise it goes to the login page
  // which has access to the signup page

  app.get("/", function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect("/viewuser");
    } else {
      res.render("login");
    }
  });

  app.get("/users", function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect("/viewuser");
    } else {
      res.render("login");
    }
  });

  // signup page
  app.get("/signup", function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect("/viewuser");
    } else {
      res.render("signup");
    }
  });

  app.get("/viewuser", function(req, res) {
    if (req.isAuthenticated()) {
      db.user.findAll().then(function(user) {
        res.render("users", { user: user });
      });
    } else {
      res.render("login");
    }
  });

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // SHOPPING LIST
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  app.put("/add-to-cart", function(req, res) {
    db.gift
      .update(
        {
          shopping: req.session.passport.user
        },
        {
          where: {
            id: req.body.id
          }
        }
      )
      .then(function(data) {
        console.log("data: ", data);
      });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });

  app.get("/cart", function(req, res) {
    console.log("\n\n\nyou've arrived at the cart\n\n\n");
    db.gift
      .findAll({
        where: {
          shopping: req.session.passport.user
        }
      })
      .then(function(data) {
        var giftArray = [];
        var giftObject = {
          giftArray: giftArray
        };
        for (i = 0; i < data.length; i++) {
          giftArray.push({
            item: data[0].dataValues.item,
            id: data[0].dataValues.id,
            price: data[0].dataValues.price,
            shopping: data[0].dataValues.shopping
          });
        }
        res.render("shoppingList", giftObject);
      });
  });

  app.put("/drop-from-cart", function(req, res) {
    db.gift
      .update(
        {
          shopping: ""
        },
        {
          where: {
            id: req.body.id
          }
        }
      )
      .then(function(data) {
        console.log("data: ", data);
      });
  });

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

  app.get("/gifts", function(req, res) {
    // Find one Gift with the id in req.params.id and return them to the user with res.json
    db.gift
      .findAll({
        where: {
          userUuid: req.session.passport.user
        },
        include: [db.user]
      })
      .then(function(data) {
        var giftObject = {
          gift: data
        };
        // res.json(dbgifts);
        res.render("viewUserGift", giftObject);
      });
  });

  app.get("/userwish", function(req, res) {
    db.user.findAll().then(function(user) {
      res.render("users", { user: user });
      console.log("this is the user", user);
    });
    res.render("userButton");
  });

  // ***********Grab list of users************

  app.get("/signup", function(req, res) {
    if (req.isAuthenticated()) {
      res.redirect("/users");
    } else {
      res.render("signup");
    }
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
};
