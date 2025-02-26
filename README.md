# Digital Control Room - JavaScript Test

## RT
Tech task specifications: [Original README](docs/TECH_TASK_SPECS_README.md) .


## Tech stack
- Using pure Javascript on the browser
  - Getting support from [youmightnotneedjquery.com](https://youmightnotneedjquery.com/).
- We are using the [Bootstrap](https://getbootstrap.com/) library to make our page prettier.
- Serving the HTML file:
  - We need the html file to ber served via a web server to avoid the access to the local data file being blocked by the browser CORS policy.   
  - For simplicity, we choose the lightweight `Python3` `http.server` server, launched via the [simple_server.sh](simple_server.sh) minimal shell script.  
  - It only requires any Python3 version available on the system.
  - After launching this script with the shel command  `sh ./simple_server.sh` in the project's root directory, the project's web page will be available at [http://localhost:8000](http://localhost:8000).
    - If you want it to be available on another port, please edit `simple_server.sh` and change the port value.
 
### Exercise 1 - Form and chart
- Added the form for selection
- Added the D3 buble chart drawing, based on user input on selection options.
  - TO-DO: 
    - Add a zoom option
    - Add a color picker to allow to change the bubbles colors.
 
### Exercise 2 - Display as a table
- Added the display of the same data selected to the chart on table format.
- TO-DO:
  - Implement sorting by headers
  - Implement search

### Exercise 3 - Extended information
TBD

-----
