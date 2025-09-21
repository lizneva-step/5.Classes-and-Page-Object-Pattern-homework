// Тест4
// 0. Зарегистрироваться
// 1. Нажать Новая заметка
// 2. Ввести имя, описание, текст, тег
// 3. Нажать публиковать
// 4. Создаем экземпляр ArticlePage
// 5. Ввести коммент
// 6. Нажать post comment
// 7. Проверить что отображается коммент
// 8. Проверить что отображается пользователь которого зарегистрировали (в комменте)

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

  test("Пользователь может оставить комментарий под статьёй", async ({
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

    // 5. Ввести комментарий
    const commentText = faker.lorem.sentence(2);
    await articlePage.enterComment(commentText);

    // 6. Нажать post comment
    await articlePage.postCommentButton.click();

    // 7. Проверить что отображается комментарий
    await articlePage.checkCommentDisplayed(commentText);

    // 8. Проверить что отображается пользователь
    await articlePage.checkAuthorDisplayed(user.name);
  });
});
