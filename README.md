# College-Application

### Install requirements.txt

```
pip install -r requirements.txt
```

## How to run the Local Web App

### Add your MongoDB URI to backend/config.env

### Create two Terminal Windows.

### First Terminal Window: Start Up the Node.js server

```
cd backend
```

```
node server.js
```

### Second Terminal Window: Run the App

```
cd college-app
```

```
npm run dev
```

### Generating secret

Run the following command and store the generated hex code as the secret

```
node
require('crypto').randomBytes(64).toString('hex')
```

### offline files for setup

Create/update backend/.env
Create/update backend/data/collegedata-merged.json
