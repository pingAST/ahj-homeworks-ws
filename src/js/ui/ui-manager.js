import { MessageBuilder } from "../chat/message-builder";

export class UiManager {
  constructor(selectors) {
    this.elements = {
      chatArea: document.getElementById(selectors.chatArea),
      userList: document.getElementById(selectors.userList),
      messageInput: document.getElementById(selectors.messageInput),
      chatContainer: document.querySelector(selectors.chatContainer),
    };
  }

  updateUserList(users) {
    this.elements.userList.innerHTML = users
      .map((user) => `<li><span class="online-dot"></span>${user}</li>`)
      .join("");
  }

  appendMessage(nickname, text, isSelf, timestamp) {
    const html = MessageBuilder.createUserMessage(
      nickname,
      text,
      isSelf,
      timestamp,
    );
    this.elements.chatArea.insertAdjacentHTML("beforeend", html);
    this.scrollToBottom();
  }

  appendSystemMessage(text, eventType) {
    const message = MessageBuilder.createSystemMessage(text);
    this.elements.chatArea.appendChild(message);
    this.scrollToBottom();

    if (!["USER_JOINED", "USER_LEFT"].includes(eventType)) {
      this.autoRemoveMessage(message);
    }
  }

  scrollToBottom() {
    this.elements.chatArea.scrollTop = this.elements.chatArea.scrollHeight;
  }

  autoRemoveMessage(element) {
    setTimeout(() => {
      element.style.opacity = "0";
      setTimeout(() => element.remove(), 300);
    }, 5000);
  }

  setupInputResize() {
    this.elements.messageInput.addEventListener("input", function () {
      this.style.height = "auto";
      const maxHeight = window.innerWidth <= 768 ? 100 : 150;
      this.style.height = Math.min(this.scrollHeight, maxHeight) + "px";
    });
  }

  showChat() {
    this.elements.chatContainer.style.display = "flex";
  }
}
