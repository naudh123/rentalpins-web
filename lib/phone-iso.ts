/** Phone prefix → ISO (matches Android auth_provider.dart). */

const PHONE_TO_ISO: Record<string, string> = {
  "+91": "IN",
  "+1": "US",
  "+44": "GB",
  "+971": "AE",
  "+61": "AU",
  "+65": "SG",
  "+254": "KE",
  "+234": "NG",
};

export function resolveIsoFromPhone(phone: string): string {
  const sorted = Object.keys(PHONE_TO_ISO).sort((a, b) => b.length - a.length);
  for (const prefix of sorted) {
    if (phone.startsWith(prefix)) return PHONE_TO_ISO[prefix]!;
  }
  return "US";
}

export function currencyForIso(iso: string): string {
  const map: Record<string, string> = {
    IN: "INR",
    US: "USD",
    GB: "GBP",
    AE: "AED",
    AU: "AUD",
    SG: "SGD",
    KE: "KES",
    NG: "NGN",
  };
  return map[iso] || "USD";
}
