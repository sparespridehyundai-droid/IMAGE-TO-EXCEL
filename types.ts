
export interface RepairOrderData {
  // Header / Top Section
  roNo: string;
  btNo: string;
  status: string;
  
  // Car Info
  vin: string;
  regNo: string;
  brand: string;
  fuelType: string;
  model: string;
  vehicleType: string;
  lastMileage: string;
  saleDate: string;
  saleDealer: string;
  engineNo: string;
  variant: string;

  // Owner Info
  customerNo: string;
  mainMobile: string;
  altMobile: string;
  whatsappId: string;
  location: string;
  state: string;
  ownerName: string;
  customerType: string;
  email: string;
  address: string;
  pinCode: string;
  city: string;

  // Work Details
  workType: string;
  incidentType: string;
  estimateNo: string;
  promisedTime: string;
  delayReason: string;
  roDate: string;
  visitType: string;
  svcAdv: string;
  estimateAmt: string;
  actualTime: string;
  
  // Status & Progress
  escalationCount: string;
  mileage: string;
  insClaimTaken: string;
  courtesyCar: string;
  techName: string;
  campaign: string;
  newRoStatus: string;
  workInProgress: string;
  exitMileage: string;
  bookingNo: string;
  tagNo: string;
  ucCategory: string;

  // Totals
  partAmt: string;
  laborAmt: string;
  otherAmt: string;
  totalAmt: string;
}

export interface CellMapping {
  key: keyof RepairOrderData;
  label: string;
  cell: string;
}
