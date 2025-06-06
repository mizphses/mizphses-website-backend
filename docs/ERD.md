# DB Schema
> Generated by [`prisma-markdown`](https://github.com/samchon/prisma-markdown)

- [default](#default)

## default
```mermaid
erDiagram
"User" {
  String id PK
  String email UK
  String password
  String name
  DateTime createdAt
  DateTime updatedAt
}
"RefreshToken" {
  String id PK
  String token UK
  String userId FK
  DateTime expiresAt
  DateTime createdAt
  DateTime updatedAt
}
"ApiKeys" {
  String id PK
  String name
  String key UK
  DateTime createdAt
  DateTime updatedAt
}
"Article" {
  String id PK
  String title
  String content
  String description "nullable"
  String ogpImage "nullable"
  Boolean published
  DateTime createdAt
  DateTime updatedAt
}
"Tag" {
  String id PK
  String name UK
  String slug UK
  String description "nullable"
  DateTime createdAt
  DateTime updatedAt
}
"_ApiKeysToArticle" {
  String A FK
  String B FK
}
"_ArticleToTag" {
  String A FK
  String B FK
}
"RefreshToken" }o--|| "User" : user
"_ApiKeysToArticle" }o--|| "ApiKeys" : ApiKeys
"_ApiKeysToArticle" }o--|| "Article" : Article
"_ArticleToTag" }o--|| "Article" : Article
"_ArticleToTag" }o--|| "Tag" : Tag
```

### `User`

**Properties**
  - `id`: 
  - `email`: 
  - `password`: 
  - `name`: 
  - `createdAt`: 
  - `updatedAt`: 

### `RefreshToken`

**Properties**
  - `id`: 
  - `token`: 
  - `userId`: 
  - `expiresAt`: 
  - `createdAt`: 
  - `updatedAt`: 

### `ApiKeys`

**Properties**
  - `id`: 
  - `name`: 
  - `key`: 
  - `createdAt`: 
  - `updatedAt`: 

### `Article`

**Properties**
  - `id`: 
  - `title`: 
  - `content`: 
  - `description`: 
  - `ogpImage`: 
  - `published`: 
  - `createdAt`: 
  - `updatedAt`: 

### `Tag`

**Properties**
  - `id`: 
  - `name`: 
  - `slug`: 
  - `description`: 
  - `createdAt`: 
  - `updatedAt`: 

### `_ApiKeysToArticle`
Pair relationship table between [ApiKeys](#ApiKeys) and [Article](#Article)

**Properties**
  - `A`: 
  - `B`: 

### `_ArticleToTag`
Pair relationship table between [Article](#Article) and [Tag](#Tag)

**Properties**
  - `A`: 
  - `B`: 