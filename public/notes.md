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