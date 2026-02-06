import * as signalR from "@microsoft/signalr";

export const createSignalRConnection = () => {
  return new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/chatHub", {
      withCredentials: true,
      transport: signalR.HttpTransportType.WebSockets, // 🔒 force WS
    })
    .withAutomaticReconnect([0, 2000, 5000, 10000])
    .build();
};
