# MenuEditor

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

### 4. Compiles and minifies for production
```
npm run build
```

### 5. Lints and fixes files
```
npm run lint
```

### Preview project: https://akkio-o.github.io/MenuEditor/
### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
