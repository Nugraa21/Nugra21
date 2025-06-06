```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /comments/{comment} {
      allow read: if true;
      allow write: if request.resource.data.name is string &&
                     request.resource.data.message is string &&
                     (request.resource.data.profileImage == null || request.resource.data.profileImage is string) &&
                     (request.resource.data.isPinned == null || request.resource.data.isPinned is bool) &&
                     request.resource.data.createdAt != null;
    }
    match /contacts/{contact} {
      allow read: if true;
      allow write: if request.resource.data.name is string &&
                     request.resource.data.email is string &&
                     request.resource.data.message is string &&
                     request.resource.data.createdAt != null;
    }
  }
}

service firebase.storage {
  match /b/{bucket}/o {
    match /profileImages/{imageId} {
      allow read: if true;
      allow write: if request.resource.size < 2 * 1024 * 1024 && // Maks 2MB
                     request.resource.contentType.matches('image/.*');
    }
  }
}
```
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /comments/{comment} {
      allow read, write: if true;
    }
    match /contacts/{contact} {
      allow read, write: if true;
    }
  }
}

```