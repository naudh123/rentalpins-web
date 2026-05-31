declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: { razorpay_payment_id?: string }) => void;
  modal?: { ondismiss?: () => void };
}

let scriptPromise: Promise<void> | null = null;

export function loadRazorpayScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.Razorpay) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });

  return scriptPromise;
}

export interface RazorpayCheckoutParams {
  key: string;
  orderId: string;
  totalAmount: number;
  currency: string;
  listingId: string;
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  onSuccess: (paymentId?: string) => void;
  onDismiss?: () => void;
}

export async function openRazorpayCheckout(
  params: RazorpayCheckoutParams
): Promise<void> {
  await loadRazorpayScript();
  if (!window.Razorpay) throw new Error("Razorpay unavailable");

  const rzp = new window.Razorpay({
    key: params.key,
    amount: Math.round(params.totalAmount * 100),
    currency: params.currency,
    name: "RentalPins",
    description: "Listing activation",
    order_id: params.orderId,
    prefill: {
      name: params.userName,
      email: params.userEmail,
      contact: params.userPhone?.replace(/\D/g, "").slice(-10),
    },
    notes: { listingId: params.listingId },
    theme: { color: "#c9a962" },
    handler: (response) => {
      params.onSuccess(response.razorpay_payment_id);
    },
    modal: { ondismiss: params.onDismiss },
  });

  rzp.open();
}
