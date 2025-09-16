import { test, expect } from "@playwright/test";
export class EditorPage {
  constructor(page) {
    // техническое описание страницы
    this.page = page;
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

  // Метод для проверки конкретного тега
  tagByText(tagText) {
    return this.page.locator(
      `li.tag-default.tag-pill.tag-outline:has-text("${tagText}")`
    );
  }

  // бизнесовые действия со страницой
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
}
