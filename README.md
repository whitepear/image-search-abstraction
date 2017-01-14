Project is live at: https://img-abstract.herokuapp.com/

An Express API that allows users to receive JSON data from Google's Custom Search API. The data will contain image URLs, alt text and page URLs for a set of images related to the provided search string. Responses are paginated and can be navigated by attaching a query string parameter to the request URL. The 25 most recent searches and their associated search-times are available for access.

The application consists of multiple GET routes, one of which requests JSON data from the Google Custom Search API. API data is processed before being displayed to the user. As part of this processing, the application implements an idiomatic test for nested property chains that may or may not stop at certain points. The application interfaces with a single MongoDB collection in order to store the most recent search terms and their associated timestamps.

Note: The live application (linked above) is hosted on Heroku. Please allow a few seconds for the hosting server to wake up when attempting to view it.
