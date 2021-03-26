import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import React from "react";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(() => ({
  stripeComponent: {
    padding: " 50px !important",
    display: "flex",
  },
}));

const CheckoutForm = () => {
  const classes = useStyles();
  const [formState, setFormState] = React.useState({
    product_name: "Lokender-tShirt",
    quantity: 2,
    unit_amount: 2000,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Get Stripe.js instance
    const stripe = await stripePromise;

    // Call your backend to create the Checkout Session
    const response = await axios.post(
      "http://localhost:4000/create-checkout-session",
      formState
    );

    const session = await response.json();

    // When the customer clicks on the button, redirect them to Checkout.
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      // If `redirectToCheckout` fails due to a browser or network
      // error, display the localized error message to your customer
      // using `result.error.message`.
    }
  };

  const handleChange = (event) => {
    event.persist();
    setFormState((formState) => ({
      ...formState,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className={classes.stripeComponent}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Product Name"
            variant="outlined"
            s
            name="product_name"
            value={formState.product_name || ""}
            type="text"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Quantity"
            variant="outlined"
            name="quantity"
            value={formState.quantity || ""}
            type="text"
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Unit"
            variant="outlined"
            name="unit_amount"
            value={formState.unit_amount || ""}
            type="text"
            onChange={handleChange}
          />
        </Grid>
        {/* Product Name: {formState.product_name}
        Quantity: {formState.quantity}
        Unit: {formState.unit_amount} */}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Checkout
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PAYMENT_PUBLISHABLE_KEY
);

const Stripe = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Stripe;
