import { test, expect } from "@playwright/test";

export class ArticlePage {
  constructor(page) {
    // техническое описание страницы
    this.page = page;

    // Для комментариев
    this.inputComment = page.locator(
      'textarea.form-control[placeholder="Write a comment..."]'
    );
    this.postCommentButton = page.locator(
      'button.btn.btn-sm.btn-primary:has-text("Post Comment")'
    );
    this.articleComment = page.locator("div.card-block p.card-text");
    this.commentAuthor = page.locator('a.comment-author[href*="profile"]');
    this.deleteArticleButton = page.locator(
      'button.btn.btn-sm:has(i.ion-trash-a):has-text("Delete Article")'
    );

    // Для редактора
    this.inputArticleTitle = page.locator(
      'input.form-control.form-control-lg[name="title"]'
    );
    this.inputAbout = page.locator('input.form-control[name="description"]');
    this.inputArticleText = page.locator('textarea.form-control[name="body"]');
    this.inputTags = page.locator('input.form-control[name="tags"]');
    this.publishArticleButton = page.locator(
      'button.btn.btn-lg.pull-xs-right.btn-primary:has-text("Publish Article")'
    );
    this.articleTitle = page.locator("h1");
    this.articleText = page.locator("div.col-md-12 p");
    this.tags = page.locator("ul.tag-list li.tag-default.tag-pill.tag-outline");
  }

  // Методы для взаимодействия со страницей комментариев
  // Бизнесовые действия со страницей комментариев
  async enterComment(commentText) {
    return test.step("Ввод комментария", async (step) => {
      await this.inputComment.fill(commentText);
    });
  }

  async postComment() {
    return test.step("Отправка комментария", async (step) => {
      await this.postCommentButton.click();
    });
  }

  async checkCommentDisplayed(commentText) {
    return test.step("Проверка отображения комментария", async (step) => {
      await expect(this.articleComment).toHaveText(commentText);
    });
  }

  async checkAuthorDisplayed(authorName) {
    return test.step("Проверка отображения автора комментария", async (step) => {
      // Берем второй элемент из списка (индекс 1)
      const secondAuthor = this.commentAuthor.nth(1);
      await expect(secondAuthor).toHaveText(authorName);
    });
  }

  // Метод для проверки конкретного тега
  tagByText(tagText) {
    return this.page.locator(
      `li.tag-default.tag-pill.tag-outline:has-text("${tagText}")`
    );
  }

  // Бизнесовые действия со страницей редактора
  async fillArticleTitle(title) {
    return test.step("Заполнение заголовка статьи", async (step) => {
      await this.inputArticleTitle.fill(title);
    });
  }

  async fillArticleAbout(about) {
    return test.step("Заполнение описания статьи", async (step) => {
      await this.inputAbout.fill(about);
    });
  }

  async fillArticleText(text) {
    return test.step("Заполнение текста статьи", async (step) => {
      await this.inputArticleText.fill(text);
    });
  }

  async fillArticleTags(tags) {
    return test.step("Заполнение тегов статьи", async (step) => {
      await this.inputTags.fill(tags);
    });
  }

  async clickPublishArticleButton() {
    return test.step("Клик по кнопке публикации статьи", async (step) => {
      await this.publishArticleButton.click();
    });
  }

  async handleDeleteConfirmationDialog() {
    return test.step("Обработка диалогового окна подтверждения удаления", async (step) => {
      // Обрабатываем диалоговое окно подтверждения
      await this.page.on("dialog", async (dialog) => {
        if (
          dialog.type() === "confirm" &&
          dialog.message().includes("Want to delete the article?")
        ) {
          await dialog.accept();
        }
      });
    });
  }

  async deleteArticle() {
    return test.step("Удаление статьи", async (step) => {
      // выбираем первую кнопку
      await this.deleteArticleButton.nth(1).click();
    });
  }

  async waitForArticleToDisappear(articleTitle) {
    return test.step("Ожидание исчезновения статьи", async (step) => {
      // Используем expect с ожиданием, а не waitForTimeout
      const articleWithTitle = this.page.locator(
        `div.article-preview h1:has-text("${articleTitle}")`
      );
      await expect(articleWithTitle).toHaveCount(0);
    });
  }
}
