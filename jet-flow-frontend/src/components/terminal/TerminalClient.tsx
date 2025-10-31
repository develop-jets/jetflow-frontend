"use client";

import { useEffect, useRef } from "react";

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
        }

        term.writeln("Welcome to JetFlow Terminal 👋");
        term.writeln("Local shell preview (no backend yet)");
        term.write("$ ");

        term.onData((data) => {
        if (data.charCodeAt(0) === 13) term.write("\r\n$ ");
        else term.write(data);
        });

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