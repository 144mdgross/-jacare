# Welcome to Gross Music Archive

When given a CSV of albums and artists, I built a RESTful API to serve as an archive.  

At this point, the project is only inteded to live locally. The set-up instructions refelct that. If you are going to clone it, skip to step 2. 


### To Get Started:

    1. After downloading and unzipping the files, install dependencies

      ```
      $ npm install
      ```

    2. I used PostgreSQL to store data so you will want to set up your database

      ```
      $ createdb gross_music_archive
      ```
      Then create the tables:
      ```
      $ knex migrate:latest
      ```
      Then run the seed files:
      ```
      $ knex seed:run
      ```

    3. start the server

      ```
      $ npm start
      ```

    4. make requests! alter data! You have all the power. If you have HTTPie installed here is an example request through the command line:
      ```
      $ http localhost:3000/api/v1/artists/75
        http localhost:3000/api/v1/albums/7
        http localhost:3000/api/v1/artists
        http localhost:3000/api/v1/albums
      ```
