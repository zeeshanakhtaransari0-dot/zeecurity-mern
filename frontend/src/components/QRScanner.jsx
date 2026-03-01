import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan }) {
  const scannerRef = useRef(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          onScan(decodedText);
          if (isRunningRef.current) {
            scanner.stop().then(() => {
              isRunningRef.current = false;
            });
          }
        }
      )
      .then(() => {
        isRunningRef.current = true;
      })
      .catch((err) => {
        console.log("Camera start error:", err);
      });

    return () => {
      if (scannerRef.current && isRunningRef.current) {
        scannerRef.current.stop().catch(() => {});
        isRunningRef.current = false;
      }
    };
  }, [onScan]);

  return <div id="reader" style={{ width: "100%" }} />;
}