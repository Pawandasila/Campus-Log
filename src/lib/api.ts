import axios from "axios";

// Account related axios calls
export const registerAccount = async (data: any) => {
  try {
    const response = await axios.post("/api/register", data);
    return response.data;
  } catch (error) {
    console.error("Error registering account: ", error);
    throw new Error("Failed to register account.");
  }
};

export const loginAccount = async (data: any) => {
  try {
    const response = await axios.post("/api/login", data);
    return response.data;
  } catch (error: any) {
    console.error("Login axios erro:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  }
};

// Visitor related axios calls
export const registerVisitor = async (data: FormData) => {
  try {
    const response = await axios.post("/api/visitorRegistration", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error registering visitor: ", error);
    throw new Error("Failed to register visitor.");
  }
};

export const checkInVisitor = async (visitorId: string) => {
  try {
    const response = await axios.put(`/visitor/check-in/${visitorId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking in visitor: ", error);
    throw new Error("Failed to check-in visitor.");
  }
};

export const checkOutVisitor = async (visitorId: string) => {
  try {
    const response = await axios.put(`/visitor/check-out/${visitorId}`);
    return response.data;
  } catch (error) {
    console.error("Error checking out visitor: ", error);
    throw new Error("Failed to check-out visitor.");
  }
};

export const scanQrAndUpdateStatus = async (qrData: any) => {
  try {
    if (!qrData.visitorId) {
      throw new Error("Invalid QR code: Missing visitor ID");
    }

    const scannedData = [
        `VisitorID:${qrData.visitorId}`,
        qrData.name ? `Name:${qrData.name}` : "",
        qrData.purpose ? `Purpose:${qrData.purpose}` : ""
      ]
        .filter(Boolean)
        .join(" ");

    const response = await axios.post("/api/visitorEntry", {scannedData});
    return response.data;
  } catch (error) {
    console.error("Error scanning QR code: ", error);
    throw new Error("Failed to scan QR code.");
  }
};