const express = require("express");
const validators = require("../validators/product-validators");
const db = require("../database/productsDb");

const router = express.Router();

router.get("/", function (request, response) {
  db.getAllProducts(function (error, products) {
    if (error) {
      const model = {
        hasDatabaseError: true,
        products: [],
      };
      response.render("products.hbs", model);
    } else {
      const model = {
        hasDatabaseError: false,
        products,
      };
      response.render("products.hbs", model);
    }
  });
});

router.get("/create", function (request, response) {
  response.render("create-product.hbs");
});

router.post("/create", function (request, response) {
  const name = request.body.name;
  const description = request.body.description;
  const errors = validators.getValidationErrorsForProduct(name, description);

  if (!request.session.isLoggedIn) {
    errors.push("Not logged in.");
  }

  if (errors.length == 0) {
    db.createProduct(name, description, function (error, productId) {
      if (error) {
        errors.push("Internal server error.");
        const model = {
          errors,
          name,
          description,
        };
        response.render("create-product.hbs", model);
      } else {
        response.redirect("/products/" + productId);
      }
    });
  } else {
    const model = {
      errors,
      name,
      description,
    };
    response.render("create-product.hbs", model);
  }
});

// /3
router.get("/:id", function (request, response) {
  const id = request.params.id;
  db.getProductById(id, function (error, product) {
    if (error) {
      error.push("Internal server error");
      const model = {
        error,
        name,
        description,
      };
      response.render("/products/" + id, model);
    } else {
      const model = {
        product,
      };
      response.render("product.hbs", model);
    }
  });
});

router.get("/:id/update", function (request, response) {
  const id = request.params.id;
  db.getProductById(id, function (error, product) {
    if (error) {
      error.push("Internal server error");
      const model = {
        error,
        name,
        description,
      };
      response.render("/products/" + id, model);
    } else {
      const model = {
        product,
      };
      response.render("update-product.hbs", model);
    }
  });
});

router.post("/:id/update", function (request, response) {
  const id = request.params.id;
  const name = request.body.name;
  const description = request.body.description;
  const errors = validators.getValidationErrorsForProduct(name, description);

  if (!request.session.isLoggedIn) {
    errors.push("Not logged in.");
  }

  if (errors.length == 0) {
    db.updateProductById(id, name, description, function (error) {
      response.redirect("/products/" + id);
    });
  } else {
    const model = {
      errors,
      product: {
        id,
        name,
        description,
      },
    };
    response.render("update-product.hbs", model);
  }
});

router.get("/:id/delete", function (request, response) {
  const id = request.params.id;
  db.getProductById(id, function (error, product) {
    if (error) {
      error.push("Internal server error");
      const model = {
        error,
        name,
        description,
      };
      response.render("/products/" + id, model);
    } else {
      const model = {
        product,
      };
      response.render("delete-product.hbs", model);
    }
  });
});

router.post("/:id/delete", function (request, response) {
  const id = request.params.id;

  db.deleteProductById(id, function (error) {
    if (error) {
      error.push("Internal server error");
      const model = {
        error,
        name,
        description,
      };
      response.render("/products/" + id, model);
    } else {
      response.redirect("/products");
    }
  });
});

module.exports = router;
