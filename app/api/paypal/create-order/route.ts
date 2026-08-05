import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

// Setup PayPal environment
const environment = new paypal.core.SandboxEnvironment(
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
console.log('PayPal Environment Configured:', {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  clientSecret: process.env.PAYPAL_CLIENT_SECRET,
});

const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid donation amount' },
        { status: 400 }
      );
    }

    console.log('Creating PayPal order for amount:', amount);

    const paypalRequest = new paypal.orders.OrdersCreateRequest();
    paypalRequest.prefer('return=representation');
    paypalRequest.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: amount.toFixed(2),
          },
        },
      ],
    });

    const order = await client.execute(paypalRequest);

    console.log('Order created successfully:', order.result.id);

    return NextResponse.json({ id: order.result.id });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Error creating PayPal order:', errorMessage);
    return NextResponse.json(
      { error: 'Failed to create PayPal order', details: errorMessage },
      { status: 500 }
    );
  }
}