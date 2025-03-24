import { WSClient } from "./ws/ws-client";
import { AuthManager } from "./auth/auth-manager";
import { UiManager } from "./ui/ui-manager";
import { ModalManager } from "./ui/modal-manager";
import { ChatManager } from "./chat/chat-manager";

document.addEventListener("DOMContentLoaded", () => {

  const authManager = new AuthManager({
    overlay: document.getElementById("authOverlay"),
    input: document.getElementById("nicknameInput"),
    error: document.getElementById("authError"),
  });

  const uiManager = new UiManager({
    chatArea: "chatArea",
    userList: "userList",
    messageInput: "messageInput",
    chatContainer: ".chat-container",
  });

  const modalManager = new ModalManager({
    modal: "confirmModal",
    confirmButton: "confirmLeave",
    cancelButton: "confirmCancel",
  });

  const wsClient = new WSClient(process.env.WS_URL);
  const chatManager = new ChatManager(wsClient, uiManager, authManager);

  document.getElementById("authButton").addEventListener("click", async () => {
    const nickname = authManager.input.value.trim();
    if (!authManager.validate(nickname)) return;

    try {
      await wsClient.connect();
      // Добавьте таймаут для проверки соединения
      setTimeout(() => {
        if (wsClient.ws.readyState !== WebSocket.OPEN) {
          throw new Error("Connection timeout");
        }
        wsClient.send({ type: "register", nickname });
      }, 1000);
    } catch (error) {
      authManager.showError("Ошибка подключения к серверу");
      console.error("Connection error:", error);
    }
  })

  document
    .getElementById("logoutButton")
    .addEventListener("click", () => modalManager.show());

  modalManager.onConfirm(() => {
    wsClient.close();
    uiManager.elements.chatContainer.style.display = "none";
    authManager.overlay.style.display = "flex";
    modalManager.hide();
  });

  modalManager.onCancel(() => modalManager.hide());

  uiManager.setupInputResize();
  chatManager.initializeChatControls();
});
