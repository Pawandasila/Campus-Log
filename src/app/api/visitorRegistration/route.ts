import { v2 as cloudinary } from "cloudinary";
import QRCode from "qrcode";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {

    const formData = await req.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phoneNumber = formData.get('phoneNumber') as string;
    const aadhaarNumber = formData.get('aadhaarNumber') as string;
    const purposeOfVisit = formData.get('purposeOfVisit') as string;
    const hasVehicle = formData.get('hasVehicle') === 'true';
    const vehicleNumber = hasVehicle ? (formData.get('vehicleNumber') as string) : null;
    
    const photo = formData.get('Photo') as File | null;
    
    let photoUrl = null;
    if (photo) {
      const bytes = await photo.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Create a base64 string
      const base64Image = `data:${photo.type};base64,${buffer.toString('base64')}`;
      
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(base64Image, {
        folder: "visitor_photos",
      });
      
      photoUrl = uploadResponse.secure_url;
    }

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24);
    
    const newVisitor = await prisma.visitorRegistration.create({
      data: {
        name,
        email,
        phoneNumber,
        aadhaarNumber,
        purposeOfVisit,
        visitDate: new Date(),
        hasVehicle,
        vehicleNumber,
        userImage: photoUrl,
        qrCodeExpiresAt : expirationDate
      },
    });
    
    const qrData = `VisitorID:${newVisitor.id} Name:${name} Purpose:${purposeOfVisit}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "L",
    });
    
    // Upload QR Code to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(qrCodeDataUrl, {
      folder: "visitor_qr_codes",
      public_id: `visitor_${newVisitor.id}`,
      overwrite: true,
    });
    
    // Update visitor with QR Code URL
    await prisma.visitorRegistration.update({
      where: { id: newVisitor.id },
      data: { qrCodeUrl: cloudinaryResponse.secure_url },
    });
    
    return NextResponse.json({
      success: true,
      message: "Visitor registered successfully",
      visitor: newVisitor,
      qrCodeUrl: cloudinaryResponse.secure_url,
    });
  } catch (error) {
    console.error("Error registering visitor:", error);
    return NextResponse.json(
      { success: false, message: "Error registering visitor" },
      { status: 500 }
    );
  }
}