# Welcome to Gross Music Archive

This is Megan Gross's NODE.js API for the back-end developer position.


### To Get Started:

    1. After downloading and unzipping the files, install dependencies

      ```bash
      $ npm install
      ```

    2. I used PostgreSQL to store data so you will want to set up your database

      ```bash
      $ createdb gross_music_archive
      ```
      Then create the tables:
      ```bash
      $ knex migrate:latest
      ```
      Then run the seed files:
      ```bash
      $ knex seed:run
      ```

    3. start the server

      ```bash
      $ npm start
      ```

    4. make requests! If you have HTTPie installed here is an example request through the command line:
      ```bash
      $ http localhost:3000/api/v1/artists/75
      ```
