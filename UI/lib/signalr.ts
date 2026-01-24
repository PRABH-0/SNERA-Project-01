import * as signalR from "@microsoft/signalr";

export const createSignalRConnection = () => {
  const raw = localStorage.getItem("user");
  if (!raw) throw new Error("No user");

  const user = JSON.parse(raw);

  return new signalR.HubConnectionBuilder()
    .withUrl(
      "https://localhost:44300/chatHub",
      {
        accessTokenFactory: () => user.accessToken,
      }
    )
    .withAutomaticReconnect()
    .build();
};
