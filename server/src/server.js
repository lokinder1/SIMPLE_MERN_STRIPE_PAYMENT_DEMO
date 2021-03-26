require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
var cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const stripe = require("stripe")(process.env.STRIPE_PAYMENT_SECRET_KEY);

app.post("/create-checkout-session", async (req, res) => {

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.body.product_name,
          },
          unit_amount: req.body.unit_amount,
        },
        quantity: req.body.quantity,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });

  res.json({ id: session.id });
});

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000`)
);
