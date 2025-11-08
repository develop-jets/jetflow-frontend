"use client";

import { useEffect, useRef } from "react";
import { io } from "socket.io-client";


export default function TerminalClient() {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    const loadTerminal = async () => {
        if (initialized.current) return;
        initialized.current = true;

        const { Terminal } = await import("xterm");
        const { FitAddon } = await import("xterm-addon-fit");
        await import("xterm/css/xterm.css");

        const term = new Terminal({
        cursorBlink: true,
        fontSize: 14,
        theme: {
            background: "#000000",
            foreground: "#00FF00",
        },
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);

        if (terminalRef.current) {
        term.open(terminalRef.current);
        fitAddon.fit();
        // Add padding to terminal DOM
        const terminalElement = terminalRef.current.querySelector(".xterm-screen") as HTMLElement;
        if (terminalElement) {
          terminalElement.style.padding = "10px";
        }
        }

        const socket = io("http://localhost:8000", {
          transports: ["websocket"],
          query: { token: "jetflow_test_token", app_id: "demo_app" },
        });

        socket.on("connect", () => {
          term.writeln("✅ Connected to backend shell");
        });

        socket.on("output", (data) => {
          term.write(data);
        });

        term.onData((data) => {
          socket.emit("input", data);
        });

        term.writeln("Welcome to JetFlow Terminal 👋");
        term.writeln("Connected to JetFlow backend shell...");

        const handleResize = () => fitAddon.fit();
        window.addEventListener("resize", handleResize);

        return () => {
        window.removeEventListener("resize", handleResize);
        term.dispose();
        };
    };

    loadTerminal();
    }, []);

  return (
    <div className="w-full h-full rounded-lg border border-gray-300 shadow-md overflow-hidden" ref={terminalRef} />
  );
}