-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Автор',
    "bio" TEXT NOT NULL DEFAULT '',
    "avatar" TEXT NOT NULL DEFAULT '/img/codexai-logo.png',
    "social" JSONB NOT NULL DEFAULT '{}',
    "expertise" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL DEFAULT '',
    "blocks" JSONB NOT NULL DEFAULT '[]',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "canonicalUrl" TEXT,
    "tldr" TEXT NOT NULL DEFAULT '',
    "keyTakeaways" JSONB NOT NULL DEFAULT '[]',
    "faqs" JSONB NOT NULL DEFAULT '[]',
    "stats" JSONB NOT NULL DEFAULT '[]',
    "category" TEXT NOT NULL DEFAULT 'web-development',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "featuredImage" TEXT NOT NULL DEFAULT '/img/codexai-logo.png',
    "featuredImageAlt" TEXT NOT NULL DEFAULT '',
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'draft',
    "readingTime" INTEGER NOT NULL DEFAULT 5,
    "views" INTEGER NOT NULL DEFAULT 0,
    "relatedArticles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relatedServices" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "autoSEO" BOOLEAN NOT NULL DEFAULT false,
    "autoGEO" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Author_name_idx" ON "Author"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_idx" ON "Article"("status");

-- CreateIndex
CREATE INDEX "Article_category_idx" ON "Article"("category");

-- CreateIndex
CREATE INDEX "Article_publishedAt_idx" ON "Article"("publishedAt");

-- CreateIndex
CREATE INDEX "Article_authorId_idx" ON "Article"("authorId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Insert default author
INSERT INTO "Author" ("id", "name", "role", "bio", "avatar", "social", "expertise", "createdAt", "updatedAt")
VALUES (
    'codexai-team',
    'CODEXAI Team',
    'Редакция',
    'Команда экспертов CODEXAI с опытом 7+ лет в веб-разработке, AI и digital-маркетинге.',
    '/img/codexai-logo.png',
    '{"telegram": "https://t.me/codexai_pro"}',
    ARRAY['Web Development', 'AI Integration', 'Telegram Bots', 'SEO'],
    NOW(),
    NOW()
);
