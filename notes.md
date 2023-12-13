these are my notes for my repository

## Git commands:
```
	git add .
	git commit -m "message"
	git push
	
	git status
	
	git pull
		andrewtingey
		*PAT*

	git clone https://github.com/webprogramming260/simon-html.git
```

## Deploy Files to Production Environment
  Use the `deployFiles.sh` script found in the [example code](https://github.com/webprogramming260/simon-html/blob/main/deployFiles.sh) to deploy Simon to your production environment. 
  The script does three things. Deletes any previous deployment for simon, copies up all of the files found in the project directory, and makes sure Caddy is hosting the files under the `simon` subdomain of your domain (e.g. simon.yourdomain.click).

  Make sure youre in the correct directory by running:
  ```
  cd Documents/2023\ Fall/CS\ 260/Code/CS260/
  ```

  ```sh
  ./deployFiles.sh -k <yourpemkey> -h <yourdomain> -s simon
  ```

  For example,

  ```sh
  ./deployFiles.sh -k /Users/andrewtingey/Documents/2023\ Fall/CS\ 260/Key/TingeyCS260.pem -h andrewt.click -s startup
  ```

  ⚠ Make sure you run `deployFiles.sh` from the console in your project directory.

Note:
First time running ./deployFiles.sh access was denied. To make file an executable run the following shell script:
```
chmod +x deployFiles.sh
```

Also, to reference terminal commands use the 'man' command to read the manual. For example:
```
man chmod
```

## Notes from CSS

- Flex is used to delimit the header, main, and footer elements. This makes them responsive to different screen sizes.
- The use of absolute positioning relative to the parent element for the game controls.
- The selection based on class attributes to style elements.
- The override of Bootstrap in order to keep the menu from changing the flex direction to column on small screens.
- The use of @media selectors to hide content when the screen is too small.

Link your CSS file to your HTML file like this: 
```
<link rel="stylesheet" href="main.css" />
```


## Notes from JavaScript

nothings here

## Midterm questions:

1. In the following code, what does the link element do?
2. In the following code,  what does a div tag do?
3. In the following code, what is the difference between the #title and .grid selector?
4. In the following code, what is the difference between padding and margin?
5. Given this HTML and this CSS how will the images be displayed using flex?
6. What does the following padding CSS do?
7. What does the following code using arrow syntax function declaration do?
8. What does the following code using map with an array output?
9. What does the following code output using getElementByID and addEventListener?
10. What does the following line of Javascript do using a # selector?
11. Which of the following are true? (mark all that are true about the DOM)
12. By default, the HTML span element has a default CSS display property value of: 
13. How would you use CSS to change all the div elements to have a background color of red?
14. How would you display an image with a hyperlink in HTML?
15. In the CSS box model, what is the ordering of the box layers starting at the inside and working out?
16. Given the following HTML, what CSS would you use to set the text "troubl" to green and leave the "double" text unaffected?
17. What will the following code output when executed using a for loop and console.log?
18. How would you use JavaScript to select an element with the id of “byu” and change the text color of that element to green?
19. What is the opening HTML tag for a paragraph, ordered list, unordered list, second level heading, first level heading, third level heading?
20. How do you declare the document type to be html?
21. What is valid javascript syntax for if, else, for, while, switch statements?
22. What is the correct syntax for creating a javascript object?
23. Is is possible to add new properties to javascript objects?
24. If you want to include JavaScript on an HTML page, which tag do you use?
```<script>```
25. Given the following HTML, what JavaScript could you use to set the text "animal" to "crow" and leave the "fish" text unaffected?
  - get a tag info in the dom and change it to something else
26. Which of the following correctly describes JSON?
27. What does the console command chmod, pwd, cd, ls, vim, nano, mkdir, mv, rm, man, ssh, ps, wget, sudo  do?
  `chmod` - modify 
  `pwd` - print working directory
  `cd` - change directory
  `ls` - list files in directory
28. Which of the following console command creates a remote shell session?
29. Which of the following is true when the -la parameter is specified for the ls console command?
  - list all
30. Which of the following is true for the domain name banana.fruit.bozo.click, which is the top level domain, which is a subdomain, which is a root domain?
  - root is bozo.click, others are subdomains
31. Is a web certificate is necessary to use HTTPS.
  - this is how to avoid man in the middle errors. encripts keys in certificate
32. Can a DNS A record can point to an IP address or another A record.
  - Route 53, what can you put into domain?
33. Port 443, 80, 22 is reserved for which protocol?
  - 80: HTTP
  - 443: HTTPS
  - 22: SSH
34. What will the following code using Promises output when executed?


# Final Exam Questions


1. What ports are used for HTTP, HTTPS, SSH?
2. What do HTTP status codes in the 300, 400, 500 range indicate?
3. What does the HTTP header content-type allows you to do?
4. What do the following attributes of a cookie do?
```
Domain
Path
SameSite
HTTPOnly
```
5. Assuming the following Express middleware, what would be the console.log output for an HTTP GET request with a URL path of /foo/bar?
6. Given the following Express service code: What does the following JavaScript fetch return?
    app.use() for example
    api.post() for example
7. Given the following MongoDB query
```
{ cost: { $gt: 10 }, name: /fran.*/}
```
select all of the matching documents.
    - costs > 10 and name starts with fran-
    - . means any character
    - * means any number of ^that character

8. How should you store user passwords in a database?
    - hash AND salted

9. Assuming the following Node.js service code is executing with websockets, what will be logged to the console of the web browser?
    - onConnect()
    - onDisconnect()
    - onMessage()

10. What is the WebSocket protocol used for?
    - client/server communication. 
    - either client/server can initiate the contact

11. What is JSX and how are the curly braces rendered?
    - JS and HTML smushed together
    - anything after the return is rendered to the screen


12. Assuming a HTML document with a 
<div id="root"></div>
element, what content will the following React component generate?
```
      function Welcome(props) {
        return <h1>Hello, {props.name}</h1>;
      }
      function App() {
        return (
          <div>
            <Welcome name="Sara" />
            <Welcome name="Cahal" />
            <Welcome name="Edite" />
          </div>
        );
      }
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(<App />);
```
    - Hello, Sara
    - Hello, Cahal
    - Hello, Edite

13. Assuming a HTML document with a 
<div id="root"></div>
element, what content will the following React component generate?
    function Numbers() { 
      const numbers = [1, 2, 3, 4, 5];
      const listItems = numbers.map((number) =>
        <li>{number}</li>
      );
      return(<ul>{listItems}</ul>)
    }
    const root = ReactDOM.createRoot(document.getElementById('root')); 
    root.render(<Numbers/>);
    - print in the order they are (not sorted) because of <ul>: 
    - 1
    - 2
    - 3
    - 4
    - 5

14. What does the following React component do?
```
function Example() {
  // Declare a new state variable, which we'll call "count"  
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```
    - increase count by one
    - You clicked 1 times

15. What are React Hooks used for?
    - modify the state of a component
    - life cycle events

16. What is the useEffect hook used for?
    - watches life cycle events and runs stuff based off of lifecycle event
    - update the page when things change

What does this code do?
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
What role does npm play in web development?
What does package.json do in a npm project?
What does the fetch function do?
What does node.js do?
What does Vite do?