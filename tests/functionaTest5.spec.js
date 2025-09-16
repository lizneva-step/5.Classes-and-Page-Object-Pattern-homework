// Тест5
// 0. Зарегистрироваться
// 1. Нажать Новая заметка
// 3. Ввести имя, описание, текст, тег
// 4. Нажать публиковать
// 5. Создаем экземпляр ArticlePage
// 6. Нажать Delete Article
// 7. Подтвердить действие (нажать ок) с browser dialogs
// 8. Перейти в глобал фид clickGlobalFeedButton в main page
// 9. Проверить что заметка не отображается

import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import {
  MainPage,
  RegisterPage,
  EditorPage,
  ArticlePage,
} from "../src/pages/index";

const URL = "https://realworld.qa.guru/";

test.describe("Действия со статьёй", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
  });

  test.only("Пользователь может оставить комментарий под статьёй", async ({
    page,
  }) => {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const articleData = {
      title: faker.lorem.sentence(3),
      about: faker.lorem.sentence(5),
      body: faker.lorem.paragraphs(3),
      tags: faker.lorem.word(),
    };

    /// 0. Зарегистрироваться
    const mainPage = new MainPage(page);
    const registerPage = new RegisterPage(page);
    const editorPage = new EditorPage(page);
    await mainPage.gotoRegister();
    await registerPage.register(user);

    // 1. Нажать новая заметка
    await mainPage.clickNewArticleButton();

    // 2. Ввести имя, описание, текст, тег
    await editorPage.fillArticleTitle(articleData.title);
    await editorPage.fillArticleAbout(articleData.about);
    await editorPage.fillArticleText(articleData.body);
    await editorPage.fillArticleTags(articleData.tags);

    // 3. Нажать публиковать
    await editorPage.clickPublishArticleButton();

    // 4. Создаем экземпляр ArticlePage
    const articlePage = new ArticlePage(page);

    // 5. Нажать Delete Article
    await articlePage.deleteArticleButton.nth(1).click(); // выбираем первую кнопку

    // 6. Подтвердить действие (нажать ок) с browser dialogs
    await page.on("dialog", async (dialog) => {
      if (
        dialog.type() === "confirm" &&
        dialog.message().includes("Want to delete the article?")
      ) {
        await dialog.accept();
      }
    });

    // 7. Перейти на домашнюю страницу
    await mainPage.clickHomeButton();

    // 7. Перейти в глобал фид
    await mainPage.clickGlobalFeedButton();

    // 8. Проверить что заметка не отображается (по заголовку)
    // создает локатор, который ищет заголовки h1 внутри элементов
    // с классом div.article-preview, которые содержат текст из переменной articleData.title
    await page.waitForTimeout(3000);
    await page.reload();
    const articleWithTitle = page.locator(
      `div.article-preview h1:has-text("${articleData.title}")`
    );
    await expect(articleWithTitle).toHaveCount(0);
  });
});
