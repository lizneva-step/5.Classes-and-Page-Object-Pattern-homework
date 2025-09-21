import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { MainPage, RegisterPage, SettingsPage } from "../src/pages/index";
const URL = "https://realworld.qa.guru/";

test.describe("Обновление профиля", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test("Пользователь может обновить имя и почту в профиле", async ({
    page,
  }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    // 0. Зарегистрироваться
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    const settingsPage = new SettingsPage(page);

    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Нажать на профиль (имя пользователя),
    await mainPage.clickUserDropdown();

    // 2. Нажать на пункт Профиль в имени пользователя
    await mainPage.clickUserDropdownProfile();

    // 3. Нажать редактировать настройки профиля
    await settingsPage.clickEditProfileSettingsButton();

    // 4. Проверить заголовок
    await expect(settingsPage.settingsHeader).toBeVisible();

    // 5. Очистить имя
    await settingsPage.yourNameInput.clear();

    // 6. Ввести имя
    const newName = faker.person.fullName();
    await settingsPage.yourNameInput.fill(newName);

    // 7. Очистить почту
    await settingsPage.emailInput.clear();

    // 8. Ввести почту
    const newEmail = faker.internet.email();
    await settingsPage.emailInput.fill(newEmail);

    // 9. Нажать обновить настройки
    await settingsPage.updateSettingsButton.click();

    // 10. Проверить что апдейт сеттингс не отображается (страница обновилась без ошибок)
    await expect(settingsPage.updateSettingsButton).not.toBeVisible();

    // 11. Проверить что имя профиля новое (рядом с тогглом)
    await expect(mainPage.userDropdown).toHaveText(newName);

    // 12. Проверить что в инпуте предзаполнено новое имя
    await expect(settingsPage.yourNameInput).toHaveValue(newName);

    // 13. Проверить что в инпуте предзаполнена новая почта
    await expect(settingsPage.emailInput).toHaveValue(newEmail);
  });
});
