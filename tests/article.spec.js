// Тест3 (Сделать PO  Эдитор)
// 0. Зарегистрироваться
// 1. Нажать Новая заметка
// 2. Ввести имя, описание, текст, тег
// 3. Нажать публиковать
// 4. Проверить  имя, текст, тег

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

  test("Пользователь может создать новую статью", async ({ page }) => {
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

    // 4. Проверить имя, описание, текст, тег
    await expect(editorPage.articleTitle).toBeVisible();
    await expect(editorPage.articleText).toBeVisible();
    await expect(editorPage.tags).toBeVisible();
  });
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

test("Пользователь может удалить статью", async ({ page }) => {
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
