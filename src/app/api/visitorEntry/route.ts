import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";

const prisma = new PrismaClient();

const RequestSchema = z.object({
  scannedData: z.string().min(1, "Scanned data is required"),
});

const QRDataSchema = z.object({
  visitorId: z.string().min(1, "Visitor ID is required"),
  name: z.string().optional(),
  purpose: z.string().optional(),
});

type QRData = z.infer<typeof QRDataSchema>;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (typeof body.scannedData !== "string") {
      return NextResponse.json(
        { error: "Invalid request format. Expected scannedData as a string." },
        { status: 400 }
      );
    }

    const validationResult = RequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid request data",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const parsedData = parseQRData(validationResult.data.scannedData);
    const qrDataResult = QRDataSchema.safeParse(parsedData);

    if (!qrDataResult.success) {
      return NextResponse.json(
        {
          error: "Invalid QR code format",
          details: qrDataResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const qrData = qrDataResult.data;

    let visitor;
    try {
      visitor = await prisma.visitorRegistration.findUnique({
        where: { id: qrData.visitorId },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Database error while finding visitor" },
        { status: 500 }
      );
    }

    if (!visitor) {
      return NextResponse.json(
        {
          error:
            "Visitor not found in the system. Please ensure the QR code is valid.",
        },
        { status: 404 }
      );
    }

    if (visitor.qrCodeExpiresAt && visitor.qrCodeExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "QR code has expired. Please generate a new one." },
        { status: 410 }
      );
    }

    let anyBlockedEntry;
    try {
      anyBlockedEntry = await prisma.visitorRegistration.findFirst({
        where: {
          id: qrData.visitorId,
          isBlocked: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Database error while checking blocked entries" },
        { status: 500 }
      );
    }

    if (anyBlockedEntry) {
      return NextResponse.json(
        {
          error: "Visitor has been blocked from entry",
          reason: anyBlockedEntry.blockedReason || "No reason provided",
          blockedEntryId: anyBlockedEntry.id,
        },
        { status: 403 }
      );
    }

    let existingActiveEntry;
    try {
      existingActiveEntry = await prisma.visitorEntry.findFirst({
        where: {
          visitorId: qrData.visitorId,
          entryStatus: "CHECKED_IN",
        },
      });
    } catch (error) {
      return NextResponse.json(
        { error: "Database error while checking active entries" },
        { status: 500 }
      );
    }

    if (existingActiveEntry) {
      try {
        const updatedEntry = await prisma.visitorEntry.update({
          where: { id: existingActiveEntry.id },
          data: {
            checkOutTime: new Date(),
            entryStatus: "CHECKED_OUT",
            updatedAt: new Date(),
          },
        });

        return NextResponse.json({
          message: "Visitor checked out successfully",
          entry: updatedEntry,
        });
      } catch (error) {
        return NextResponse.json(
          { error: "Database error while updating entry for checkout" },
          { status: 500 }
        );
      }
    } else {
      try {
        const newEntry = await prisma.visitorEntry.create({
          data: {
            visitorId: qrData.visitorId,
            entryStatus: "CHECKED_IN",
            isBlocked: false,
            ...(qrData.purpose ? { blockedReason: null } : {}),
            checkInTime: new Date(),
            checkOutTime: null,
            updatedAt: new Date(),
          },
          include: {
            visitor: {
              select: {
                name: true,
                email: true,
                phoneNumber: true,
                purposeOfVisit: true,
              },
            },
          },
        });

        return NextResponse.json({
          message: "Visitor checked in successfully",
          entry: newEntry,
        });
      } catch (error) {
        return NextResponse.json(
          { error: "Database error while creating new entry for check-in" },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process visitor entry" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Ensure Prisma client is disconnected
  }
}

function parseQRData(data: string): QRData {
  const result: QRData = { visitorId: "" };

  const idMatch = data.match(/VisitorID:([a-f0-9]+)/i);
  if (idMatch && idMatch[1]) {
    result.visitorId = idMatch[1];
  }

  const nameMatch = data.match(/Name:([^\s]+)/i);
  if (nameMatch && nameMatch[1]) {
    result.name = nameMatch[1];
  }

  const purposeMatch = data.match(/Purpose:([^\s]+)/i);
  if (purposeMatch && purposeMatch[1]) {
    result.purpose = purposeMatch[1];
  }

  return result;
}
