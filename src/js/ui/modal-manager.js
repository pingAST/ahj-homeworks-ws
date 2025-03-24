export class ModalManager {
  constructor(selectors) {
    this.modal = document.getElementById(selectors.modal);
    this.confirmButton = document.getElementById(selectors.confirmButton);
    this.cancelButton = document.getElementById(selectors.cancelButton);
  }

  show() {
    this.modal.style.display = "flex";
  }

  hide() {
    this.modal.style.display = "none";
  }

  onConfirm(callback) {
    this.confirmButton.addEventListener("click", callback);
  }

  onCancel(callback) {
    this.cancelButton.addEventListener("click", callback);
  }
}
