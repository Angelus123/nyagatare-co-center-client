import { NextResponse } from 'next/server';
import paypal from '@paypal/checkout-server-sdk';

const environment = new paypal.core.SandboxEnvironment(
  process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
console.log('PayPal Environment:', environment);

const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  try {
    const { orderID } = await req.json();
    if (!orderID) {
      return NextResponse.json({ error: 'Missing orderID' }, { status: 400 });
    }

    console.log('Capturing order ID:', orderID);

    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    const response = await client.execute(request);

    console.log('Capture response:', response.result);

    return NextResponse.json(response.result);
  } catch (err) {
    console.error('Error capturing order:', err);
    return NextResponse.json({ error: 'Failed to capture order', details: err || err }, { status: 500 });
  }
}
