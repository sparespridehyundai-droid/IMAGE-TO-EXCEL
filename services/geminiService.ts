
import { GoogleGenAI, Type } from "@google/genai";
import { RepairOrderData } from "../types";

const REPAIR_ORDER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    roNo: { type: Type.STRING },
    btNo: { type: Type.STRING },
    status: { type: Type.STRING },
    vin: { type: Type.STRING },
    regNo: { type: Type.STRING },
    brand: { type: Type.STRING },
    fuelType: { type: Type.STRING },
    model: { type: Type.STRING },
    vehicleType: { type: Type.STRING },
    lastMileage: { type: Type.STRING },
    saleDate: { type: Type.STRING },
    saleDealer: { type: Type.STRING },
    engineNo: { type: Type.STRING },
    variant: { type: Type.STRING },
    customerNo: { type: Type.STRING },
    mainMobile: { type: Type.STRING },
    altMobile: { type: Type.STRING },
    whatsappId: { type: Type.STRING },
    location: { type: Type.STRING },
    state: { type: Type.STRING },
    ownerName: { type: Type.STRING },
    customerType: { type: Type.STRING },
    email: { type: Type.STRING },
    address: { type: Type.STRING },
    pinCode: { type: Type.STRING },
    city: { type: Type.STRING },
    workType: { type: Type.STRING },
    incidentType: { type: Type.STRING },
    estimateNo: { type: Type.STRING },
    promisedTime: { type: Type.STRING },
    delayReason: { type: Type.STRING },
    roDate: { type: Type.STRING },
    visitType: { type: Type.STRING },
    svcAdv: { type: Type.STRING },
    estimateAmt: { type: Type.STRING },
    actualTime: { type: Type.STRING },
    escalationCount: { type: Type.STRING },
    mileage: { type: Type.STRING },
    insClaimTaken: { type: Type.STRING },
    courtesyCar: { type: Type.STRING },
    techName: { type: Type.STRING },
    campaign: { type: Type.STRING },
    newRoStatus: { type: Type.STRING },
    workInProgress: { type: Type.STRING },
    exitMileage: { type: Type.STRING },
    bookingNo: { type: Type.STRING },
    tagNo: { type: Type.STRING },
    ucCategory: { type: Type.STRING },
    partAmt: { type: Type.STRING },
    laborAmt: { type: Type.STRING },
    otherAmt: { type: Type.STRING },
    totalAmt: { type: Type.STRING },
  },
  required: ["roNo", "vin", "regNo", "ownerName"]
};

export async function extractRepairOrderData(base64Image: string): Promise<RepairOrderData> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `
    Analyze this GDMS Repair Order form image.
    Extract every single field visible in the form including Header data, Car Info, Owner Info, Work Details, and Totals.
    Format the output as a strict JSON object following the provided schema.
    Ensure all numerical values are extracted as strings to preserve formatting.
    If a field is empty, return an empty string.
  `;

  const imagePart = {
    inlineData: {
      mimeType: 'image/png',
      data: base64Image.split(',')[1] || base64Image,
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: "application/json",
        responseSchema: REPAIR_ORDER_SCHEMA,
      },
    });

    const data = JSON.parse(response.text || '{}');
    return data as RepairOrderData;
  } catch (error) {
    console.error("Error extracting data:", error);
    throw new Error("Failed to parse the form. Please ensure the image is clear and try again.");
  }
}
