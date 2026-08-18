export type TourInstallment = {
  installmentNumber: number;
  dueDate: string;
};

export type TourInstallmentPlan = {
  enabled: boolean;
  count: number;
  installments: readonly TourInstallment[];
};

export type TourDayTransferMode = "plane" | "train" | "bus" | "ship";

export type TourDayTransfer = {
  fromDayNumber: number;
  toDayNumber: number;
  transportMode: TourDayTransferMode;
  distanceKm: number | null;
};
