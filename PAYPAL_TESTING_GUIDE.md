# PayPal Testing Guide

This guide explains how to test PayPal donations without using real money.

## Setting Up PayPal Sandbox

1. **Create a PayPal Developer Account**:
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
   - Sign up or log in with your PayPal account

2. **Create Sandbox Accounts**:
   - In the Developer Dashboard, go to "Sandbox" > "Accounts"
   - Create two accounts:
     - A Business account (to receive payments)
     - A Personal account (to make test payments)

3. **Get Your Sandbox Client ID**:
   - Go to "Apps & Credentials"
   - Create a new app (select Sandbox for environment)
   - Copy the Client ID

4. **Update Your Environment Variables**:
   - Open `.env.development` file
   - Replace the placeholder Client ID with your Sandbox Client ID:
     ```
     NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_SANDBOX_CLIENT_ID
     ```

## Making Test Payments

1. **Run the Application in Development Mode**:
   ```
   npm run dev
   ```

2. **Test Donation Flow**:
   - Navigate to the donation section
   - You'll see a "Test Mode Active" banner
   - Enter a donation amount
   - Click the PayPal button

3. **Login with Sandbox Account**:
   - Use the credentials of your Personal sandbox account
   - Email: (the email you created in the sandbox)
   - Password: (the password you set for the sandbox account)

4. **Complete the Payment**:
   - Follow the PayPal checkout flow
   - No real money will be charged

5. **Verify the Transaction**:
   - Check the PayPal Developer Dashboard
   - Go to "Sandbox" > "Transactions"
   - You should see your test donation

## Testing Card Payments

The application now supports direct credit/debit card payments through PayPal. Here's how to test them:

1. **Access the Donation Form**:
   - Navigate to the donation section
   - Enter a donation amount
   - Click the PayPal button

2. **Select "Debit or Credit Card"**:
   - In the PayPal popup, look for the "Debit or Credit Card" option
   - Click on it to proceed with a card payment instead of PayPal

3. **Use Test Card Information**:
   - Use one of the test cards listed below
   - For the billing address, you can use any valid address format
   - For expiration date, use any future date
   - For CVV, use any 3 digits (4 for Amex)

4. **Complete the Payment**:
   - Follow the prompts to complete the payment
   - The system will process the test card without charging real money

5. **View Payment Details**:
   - After successful payment, the success message will show which payment method was used
   - You'll see "Card (last 4 digits)" in the payment method field

## Sandbox Test Credit Cards

You can use these test credit cards in the PayPal sandbox:

| Card Type | Number | Expiry | CVV |
|-----------|--------|--------|-----|
| Visa | 4111111111111111 | Any future date | Any 3 digits |
| Mastercard | 5555555555554444 | Any future date | Any 3 digits |
| Amex | 378282246310005 | Any future date | Any 4 digits |
| Discover | 6011111111111117 | Any future date | Any 3 digits |

For testing different scenarios, you can use these special card numbers:

| Card Number | Behavior |
|-------------|----------|
| 4000000000000010 | Insufficient funds |
| 4000000000000028 | Expired card |
| 4000000000000036 | Restricted card |

## Troubleshooting Card Payments

If you encounter issues with card payments:

1. **Card Not Appearing**: Make sure you're using the latest version of the code with the card payment option enabled
2. **Card Declined**: Try using a different test card number
3. **Form Validation Errors**: Make sure all fields are filled correctly
4. **Browser Issues**: Try using a different browser or clearing your cache

## Switching to Production

When you're ready to accept real payments:

1. Get a production Client ID from the PayPal Developer Dashboard
2. Update `.env.production` with your production Client ID
3. Build and deploy your application 