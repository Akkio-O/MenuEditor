# MenuEditor
## Branch development => one logic for menu
## Branch main => second logic for menu
## 1. Project setup
```
npm install
```

### 2. Create .env and set up base data
#### 2.1. Create a file.env in the folder with server.cjs
#### 2.2. Add database connection settings to .env
#### 2.3. Start vue serv
```
npm run start
```
### 3. Start server Nodejs
```
npm run server
```
#### 3.1. On the authorization page, register a new user
#### 3.2. Change user role to 'admin' using MySQL command line
```
UPDATE users SET role = 'admin' WHERE id = 1;
```
#### 3.3. Reload server.cjs to apply changes
#### 3.4. After changing the role, log in again to access the menu management interface.
### 4. Compiles and minifies for production
```
npm run build
```

### 5. Lints and fixes files
```
npm run lint
```

### Deployment
- GitHub Pages: The project is deployed at https://akkio-o.github.io/MenuEditor/. 
- Note that GitHub Pages uses /MenuEditor as the base path.
- Local Development: When running locally, the project is served from /.
### Menu Functionality
- The menu supports multiple levels: menu_items, submenu_items, and subsubmenu_items.
- The third level (subsubmenu_items) is nested under the second level (submenu_items), with appropriate associations between menu_items_id and child_id.
