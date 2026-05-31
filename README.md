# TaskFlow Mobile

Expo React Native frontend for the TaskFlow project and task manager.

## Main Tech

- React Native with Expo
- Redux Toolkit and async thunks
- Axios API client
- React Navigation
- AsyncStorage for saved login session
- Light/dark mode through Redux

## Run

```bash
npm install
npx expo start --clear
```

Press `w` for browser preview, `a` for Android emulator, or scan the QR code using Expo Go.

## API URL

Update `src/api/client.js` based on where you run the app:

```js
const API_URL = 'http://10.0.2.2:5000/api';
```

Use `10.0.2.2` for Android emulator, `localhost` for browser, and your laptop IP address for a physical phone.

## Structure

- `src/api` Axios client
- `src/store` Redux Toolkit store and slices
- `src/screens` App screens
- `src/components` Reusable UI components
- `src/navigation` Navigation setup
- `src/constants` Theme colors
