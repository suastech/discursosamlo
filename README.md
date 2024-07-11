Deployed in: https://amlodice.vercel.app/

Created with: React, Prisma, PostgreSql, Chart JS, Puppeteer, Vercel Serverless Functions.

- This site is a search engine that allows users to find text strings within a database of more than 2400 official speeches of the Mexican presidency.
- It counts the number of repetitions for each year and shows the exact quote in which it was said (it also redirects to the official source of the quote).
- Useres can download the data of frequent searches in xml or csv, as well as a report with all the quotations of a certain string.
- To download the transcripts I use Pupeteer and convert them into a Postgresql database.
- Highlights: an extra feature I enjoyed developing is my own encrypted system of passwords to validate the database requests and expire in about 10 seconds.

The project was created with Create React App. To run the project, use: 'npm start'.
