-- CreateTable
CREATE TABLE "newfile" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "newfile_pkey" PRIMARY KEY ("id")
);
