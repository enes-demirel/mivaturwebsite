import type { CustomTourRequestInput } from "@/lib/validation/custom-tour-request";

export async function submitCustomTourRequestStub(request: CustomTourRequestInput) {
  void request;
  return { success: false as const, message: "Özel tur talep sistemi sonraki aşamada aktif edilecek." };
}
