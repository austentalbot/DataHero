<h4> Overview for Data Hero </h4>

<b>Hosted link:</b> http://dataherohw.azurewebsites.net/

<b>Github link: https://github.com/austentalbot/datahero

<b>Running:</b> You can interact with the app through the hosted link. You're welcome to also run it locally, but this will require the need to connect to the database and change some of the resource links to point to local directories. Let me know if you want to test it out locally as well, and I can make the adjustments so it will work for you.

<b>Overview:</b> I created a Node/Express app that consists of three pages--two for uploading and one for viewing data. The upload pages show loading animations while files are being loaded into the database. The data page shows a loading animation when data is being pulled from the database. The data page is an Angular app with a button for each user which, when clicked, populates a chart.js canvas with historical salary data in addition to displaying this data in a list below. Data is uploaded to a MySQL database each time a file is uploaded (i.e. the table is dropped, a new table is created, and all entries are inserted). As directed, not too much time was invested in styling the app, so please overlook the suboptimal design :)

<b>Features:</b> All major features are implemented in addition to the bonus feature of graphically displaying data. A caveat is that the loading animations do not display a loading percentage as the majority of the wait time involves loading the data into SQL versus simply uploading the file to the server.

<b>Limitations:</b> I am using a MySQL database which only allows up to four simultaneous connections, so please do not access the app from multiple computers simultaneously or otherwise overload the SQL access. Also, I've set up the app expecting an informed user who knows which files to upload for which page. While I handle for the user uploading no file, I do not handle for the user uploading the incorrect file as I wanted to allow flexibility in the event the salary or employee files were updated with additional information. Please be sure you upload the employee file and the salary file on their correct, respective pages.
