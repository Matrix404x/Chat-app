# Firestore Security Rules Setup

The app is failing because Firestore security rules are blocking writes to the `users` and `messages` collections.

## Fix: Update your Firestore Rules

Go to Firebase Console → Your Project → Firestore Database → Rules

Replace the rules with:

```firestore
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read all users
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }

    // Allow authenticated users to read and write messages
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## What these rules do:

- **users**: Anyone authenticated can read. Users can only write to their own profile.
- **messages**: Anyone authenticated can read and write messages.

## How to apply:

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `real-time-chat-8782d`
3. Go to **Firestore Database**
4. Click **Rules** tab
5. Delete the existing rules and paste the above rules
6. Click **Publish**

After publishing, the errors should disappear and the app will work!
