import { test, expect } from "@playwright/test";
export class SettingsPage {
  constructor(page) {
    // техническое описание страницы
    this.page = page;

    // Статичные локаторы
    this.editProfileSettingsButton = page.getByRole("link", {
      name: "Edit Profile Settings",
    });

    this.updateSettingsButton = page.getByRole("button", {
      name: "Update Settings",
    });
    this.yourNameInput = page.locator('input[name="username"]');
    this.emailInput = page.locator('input[name="email"]');
    this.settingsHeader = page.locator(
      'h1.text-xs-center:has-text("Your Settings")'
    );
  }

  // бизнесовые действия со страницой
  async gotoRegister() {
    await this.signupLink.click();
  }

  async clickEditProfileSettingsButton() {
    return test.step("Клик по кнопке редактирования настроек профиля", async (step) => {
      await this.editProfileSettingsButton.click();
    });
  }
}
//todo обернуть методы для аллюр
