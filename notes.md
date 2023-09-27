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
