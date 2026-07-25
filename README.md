# Madik Studio

Статический сайт-портфолио дизайнера интерьеров и экстерьеров.

## Стек

- Astro 7
- GitHub Pages
- Pages CMS
- Без серверной части, базы данных и видеохостинга

## Локальный запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Управление контентом

1. Открыть `app.pagescms.org`.
2. Войти через GitHub-аккаунт `MadikStudio`.
3. Подключить репозиторий `MadikStudio/MadikStudio`.
4. Открыть раздел «Проекты».
5. Создать проект, заполнить поля и загрузить фотографии.

Pages CMS сохраняет изменения в GitHub. Workflow `.github/workflows/deploy.yml` автоматически пересобирает и публикует сайт.

## Публикация

После переноса репозитория на аккаунт `MadikStudio` открыть в GitHub `Settings → Pages` и выбрать источником `GitHub Actions`.

Адрес сайта:

`https://madikstudio.github.io/MadikStudio/`

## Контент

- Проекты: `src/content/projects/*.md`
- Заголовки, описание студии и контакты: `src/data/site.json`
- Фотографии: `public/images/projects/`
- Конфигурация редактора: `.pages.yml`
