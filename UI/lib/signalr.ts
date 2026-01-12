import * as signalR from "@microsoft/signalr";

export const createSignalRConnection = () => {
  const raw = localStorage.getItem("user");
  if (!raw) throw new Error("No user");

  const user = JSON.parse(raw);

  return new signalR.HubConnectionBuilder()
    .withUrl(
      "http://localhost:5000/chatHub",
      {
        accessTokenFactory: () => user.accessToken,
      }
    )
    .withAutomaticReconnect()
    .build();
};
