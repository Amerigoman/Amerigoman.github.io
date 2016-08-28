Let me introduce  a web-application that integrates Google Maps along with Google news and MySQL database, which contain thousands of zip codes, GPS coordinates and much more.

Not only can you look for different places with a text field at the top, you can click the left and drag the map to a different location. At the same time, scattered across the map icons newspapers displays after clicking them.

In order to make the application work, first of all, create a database with the following code (mashup.sql), and then load the data US.txt into the database using a PHP script import.php.

Additional libraries:
- typeahead.js - https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md
- Underscore - http://underscorejs.org/#template
