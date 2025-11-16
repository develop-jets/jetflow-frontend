export function subscribeAppEvents(applicationId: string, onEvent: (data: any) => void) {
  const ws = new WebSocket("ws://backend.developjets.in/ws/app-events/");

  ws.onopen = () => {
    console.log("Connected to WebSocket");
    ws.send(JSON.stringify({ type: "subscribe", app_id: applicationId }));
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.app_id === applicationId) onEvent(data);
    console.log("Received data:", data);
  };

  ws.onclose = () => console.log("WebSocket closed");
  ws.onerror = (err) => console.error("WebSocket error:", err);

  return () => ws.close();
}