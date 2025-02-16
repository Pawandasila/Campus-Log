'use client';

import { useRef, useState, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import axios from "axios";
import {
  Camera,
  StopCircle,
  QrCode,
  AlertCircle,
  CheckCircle2,
  User,
  FileText,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { scanQrAndUpdateStatus } from "@/lib/api";

interface ParsedQRData {
  visitorId?: string;
  name?: string;
  purpose?: string;
  expires?: string;
  [key: string]: string | undefined;
}

const page = () => {
  const [message, setMessage] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [scannedData, setScannedData] = useState<string>("");
  const [parsedData, setParsedData] = useState<ParsedQRData | null>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);

  useEffect(() => {
    return () => stopScanning();
  }, []);

  const parseQRData = (data: string): ParsedQRData => {
    const result: ParsedQRData = {};
    
    const pairs = data.split(' ');
    pairs.forEach(pair => {
      const keyValue = pair.split(':');
      if (keyValue.length === 2) {
        const [key, value] = keyValue;
        
        const formattedKey = key.toLowerCase()
          .replace('visitorid', 'visitorId')
          .replace('purpose', 'purpose')
          .replace('name', 'name')
          .replace('expires', 'expires');
        
        result[formattedKey] = value;
      }
    });
    
    return result;
  };

  const startScanning = async (): Promise<void> => {
    setError("");
    setMessage("");
    setScannedData("");
    setParsedData(null);
    setApiResponse(null);
    setIsScanning(true);
    
    try {
      codeReaderRef.current = new BrowserQRCodeReader();
      
      const devices = await BrowserQRCodeReader.listVideoInputDevices();
      if (devices.length === 0) throw new Error("No camera found.");
      if (!videoRef.current) throw new Error("Video element not found");
  
      let backCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear")
      );
  
      if (!backCamera) backCamera = devices[devices.length - 1];
  
      await codeReaderRef.current.decodeFromVideoDevice(
        backCamera.deviceId,
        videoRef.current,
        async (result) => {
          if (result) {
            const qrData = result.getText();
            setScannedData(qrData);
            const parsed = parseQRData(qrData);
            setParsedData(parsed);
            

            try {
              setIsLoading(true);
              const apiResult = await scanQrAndUpdateStatus(parsed);
              setApiResponse(apiResult.error);
              setMessage("QR code verified successfully!");
            } catch (err) {
              setError("Failed to verify QR code with the server.");
            } finally {
              setIsLoading(false);
              stopScanning();
            }
          }
        }
      );
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
      setIsScanning(false);
    }
  };

  const stopScanning = (): void => {
    if (codeReaderRef.current) {
      codeReaderRef.current.decodeFromVideoDevice(
        undefined,
        undefined,
        () => {}
      );
    }

    const mediaStream = videoRef.current?.srcObject as MediaStream;
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
    }
    setIsScanning(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="max-w-lg w-full">
        <CardHeader className="bg-primary">
          <div className="flex items-center space-x-2">
            <QrCode className="w-8 h-8 text-primary-foreground" />
            <CardTitle className="text-2xl text-primary-foreground">QR Scanner</CardTitle>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <span className="sr-only">Loading...</span>
            </div>
          )}

          {parsedData && (
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-600 mb-3 text-lg">Visitor Information</h3>
              
              {parsedData.visitorId && (
                <div className="flex items-start mb-2">
                  <Hash className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Visitor ID</p>
                    <p className="text-gray-600">{parsedData.visitorId}</p>
                  </div>
                </div>
              )}
              
              {parsedData.name && (
                <div className="flex items-start mb-2">
                  <User className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Name</p>
                    <p className="text-gray-600">{parsedData.name}</p>
                  </div>
                </div>
              )}
              
              {parsedData.purpose && (
                <div className="flex items-start mb-2">
                  <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Purpose</p>
                    <p className="text-gray-600">{parsedData.purpose}</p>
                  </div>
                </div>
              )}
              
              {parsedData.expires && (
                <div className="flex items-start mb-2">
                  <QrCode className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-700">Expires</p>
                    <p className="text-gray-600">{new Date(parsedData.expires).toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {/* Display any other key-value pairs that weren't specifically handled */}
              {Object.entries(parsedData)
                .filter(([key]) => !['visitorId', 'name', 'purpose', 'expires'].includes(key))
                .map(([key, value]) => (
                  <div key={key} className="flex items-start mb-2">
                    <QrCode className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-700">{key.charAt(0).toUpperCase() + key.slice(1)}</p>
                      <p className="text-gray-600">{value}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}

          {apiResponse && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              <AlertDescription>
                {apiResponse.message || "Verification successful"}
              </AlertDescription>
            </Alert>
          )}

          {message && !apiResponse && (
            <Alert className={isLoading ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-green-50 text-green-700 border-green-200"}>
              {isLoading ? (
                <div className="animate-pulse mr-2">⏳</div>
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <video
            ref={videoRef}
            className={`w-full rounded-lg ${isScanning ? "block" : "hidden"}`}
          />

          <div className="mt-4 flex justify-center">
            {!isScanning ? (
              <Button onClick={startScanning} className="px-6 py-3 bg-primary text-primary-foreground" disabled={isLoading}>
                <Camera className="w-6 h-6 mr-2" />
                Start Scanning
              </Button>
            ) : (
              <Button onClick={stopScanning} variant="destructive" className="px-6 py-3">
                <StopCircle className="w-6 h-6 mr-2" />
                Stop Scanning
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;