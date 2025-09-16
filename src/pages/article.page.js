import { test, expect } from "@playwright/test";
export class ArticlePage {
  constructor(page) {
    // техническое описание страницы
    this.page = page;

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
}
