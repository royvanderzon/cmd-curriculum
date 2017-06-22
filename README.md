# CMD Amsterdam curriculum

## Front-view
- [Front-end](http://socialscoutagency.com/)
- [Front-end (with slider)](http://socialscoutagency.com/slider)
- [Back-end](http://socialscoutagency.com/cms)

## Back-end

## What is this?
This app is a NodeJS driven CMS where all intrested users can see the whole curriculum for a study. In the back-end users can add new years, make custom labels, and make years that will automatically will be rendered to the front-view of the appliation.
All the inserted data will be converted to a fully responsive curriculum. The curriculum is designed for all devices. The font-view is touch friendly, fast, responsive and works on every device.

__Data modal__
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/data.png)
__DB scheme__
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/db.png)
_The category and post table will not be used in V1_
__Front-end design__
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/ontwerp-v2.png)
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/ontwerp-v2-2.png)
__Back-end design__
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/Back-end.png)

## MoSCoW
### Must haves
#### Back-end
- dynamic labels
- dynamic years
- dynamic curriculum divided for each year
- responsive
- add featured images
- user management
- forget password
- hashed passwords
#### Front-end
- responsive
- optimezed for modern browsers
- touch friendly
- 100% works on touchtable

### Should haves
#### Back-end
- autosave on changes
- draggable curriculum elements
- wysiwyg editor with images upload
- slideshow
- user permissions
- custom profile management
- disable/enable years
#### Front-end
- 100% functionallity in every browser
- slider whitch switch on after x time
- fallbacks (no js)
- build in documentation

### Could haves
#### Back-end
- api
- (ctrl + z && cmd + z) step back
- auto image optimization
- spelling control
- duplicate curriculum elements
#### Front-end
- google analytics integration
- QR code redirect helper
- highlight labels

### Won't haves
- extra information pages
- contact forms
- game elements
- guest user management

## Known issues
- misplace html element when step back +4 times (only styling issue)

## .env file
```
PORT=port
MYSQL_HOST=localhost
MYSQL_USER=username
MYSQL_PASSWORD=password
MYSQL_DATABASE=databasename
MYSQL_PORT=port
MAIL_HOST=mail.com
MAIL_PORT=port
MAIL_SSL=Boolean
MAIL_USER=username@email.com
MAIL_PASSWORD=passpord
SESSION_SECRET=supersecret
SESSION_KEY=supersecret
SESSION_SAVEUNINITIALIZED=Boolean
SESSION_RESAVE=Boolean
```



## Data life cycle
### Login
- User register
	- Mail
- Form