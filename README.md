# CMD Amsterdam curriculum

## Front-view
- [Front-end](http://socialscoutagency.com/)
- [Front-end (with slider)](http://socialscoutagency.com/slider)

## Back-end
- [Back-end](http://socialscoutagency.com/cms)

## What is this?
This is the curriculum website from Communication Multimedia Design reinvented. The old website, (cmd-amsterdam.nl/curriculum) is difficult to maintain. With this CMS the curriculum can be maintained easily, everywhere! There is an special url for exposing the curriculum website on the touch table. This website is touch table friendly!

This app is a NodeJS driven CMS where all interested users can see the whole curriculum for a study. In the back-end users can add new years, make custom labels, and make years that will automatically will be rendered to the front-view of the application.
All the inserted data will be converted to a fully responsive curriculum. The curriculum is designed for all devices. The font-view is touch friendly, fast, responsive and works on every device.

## Feature list
- [x] Fully configurable cms
- [x] Custom slideshow (comes back after x minutes)
- [x] Custom headers
- [x] Custom types
- [x] Custom backgrounds
- [x] Two different curriculum views
- [x] Filter in course interests
- [x] Flexible curriculum structure
- [x] Optional modals
- [x] Optional WYSIWYG content
- [x] Smart permission system
- [x] Dynamic menu’s
- [x] Email forget password
- [x] Critical CSS
- [x] Gzipped CSS
- [x] Optimized images
- [x] Zero issues W3C HTML validator

## Usabillity testing
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/test.jpg)
__Conclusions__
- Set the curriculum content to bottom of the page (slider view)
- Link not clickable (slider view)
- Inverse list control buttons

__Poster__
![Flow](https://raw.githubusercontent.com/royvanderzon/cmd-curriculum/master/images/poster.jpg)

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
- [x] dynamic labels
- [x] dynamic years
- [x] dynamic curriculum divided for each year
- [x] responsive
- [x] add featured images
- [x] user management
- [x] forget password
- [x] hashed passwords
#### Front-end
- [x] responsive
- [x] optimized for modern browsers
- [x] touch friendly
- [x] 100% works on touchtable

### Should haves
#### Back-end
- [x] autosave on changes
- [x] draggable curriculum elements
- [x] wysiwyg editor with images upload
- [x] slideshow
- [x] user permissions
- [x] custom profile management
- [x] disable/enable years
#### Front-end
- [x] 100% functionallity in every browser
- [x] slider whitch switch on after x time
- [x] fallbacks (no js)
- [x] build in documentation

### Could haves
#### Back-end
- [ ] api
- [x] (ctrl + z && cmd + z) step back
- [ ] auto image optimization
- [ ] spelling control
- [ ] duplicate curriculum elements
- [x] https live site
#### Front-end
- [ ] google analytics integration
- [x] QR code redirect helper
- [x] highlight labels

### Won't haves
- [ ] extra information pages
- [ ] contact forms
- [ ] game elements
- [ ] guest user management

## Known issues
- [ ] misplace html element when step back +4 times (only styling issue)

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
### User (frontend)
No data, sessions or cookies
### User (cms)
1. User register
   * Trough email
   * Trough signup from login page
2. User sets profile
3. User sets curriculum
### Admin (cms)
1. Admin invite
   * Create
   * Extend
   * Remove
2. Admin users
   * Create
   * Delete
   * Edit
   * Set permissions

### Process 
1. Setup Ubuntu 14 server with NODEJS
2. Setup MYSQL
3. Setup Ubuntu 14 server with NGINX
4. Create html and css
5. Create Database scheme
6. Create user management system
7. Create mail functions
8. Create curriculum edit page
9. Create curriculum front-end view

## Install
#### NODEJS
- clone repo `$ git clone THIS_REPO`
- cd to cloned repo `$ cd TO_CLONED_REPO`
- set envoirement variables `nano .env`
- run `$ npm install`
- run `$ nodemon app.js`
#### Setup PM2
*PM2 is the way to deploy this app to a online production server*