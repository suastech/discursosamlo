Deployed in: https://amlodice.vercel.app/

Created with: React, Prisma, PostgreSql, Chart JS, Puppeteer, Vercel Serverless Functions.

- This search engine  allows users to find strings within a database of more than 2400 official speeches of the Mexican presidency.
- It counts the number of repetitions for each year and shows the exact quote in which context it was said.
- Users can download the data of frequent searches in xml or csv, as well as a report with all the quotations of a given string.
- To download the transcripts I use Pupeteer and convert them into a Postgresql database.
- An extra feature I enjoyed developing is my own encryption system to generate unique passwords that validate the requests to the database and expire in about 10 seconds.

The project was created with Create React App.
To run the project, use: 'npm install' and 'npm start'
