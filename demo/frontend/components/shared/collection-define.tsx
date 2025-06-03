const CollectionDefine = () => {
  return (
    <div>
      <h2 className='text-lg font-semibold'>Available Data Models:</h2>
      <ul className='list-disc pl-5'>
        <li>
          <strong className='font-medium'>User:</strong> Represents a user in the system.
          <ul className='mt-1 list-disc pl-5'>
            <li>
              <strong className='font-medium'>id:</strong> Unique ID for each user (Int, @id,
              @default(autoincrement())).
            </li>
            <li>
              <strong className='font-medium'>email:</strong> User's email address (String,
              @unique).
            </li>
            <li>
              <strong className='font-medium'>name:</strong> User's name (String).
            </li>
            <li>
              <strong className='font-medium'>profile:</strong> User's profile (Profile?,
              @relation("UserProfile")).
            </li>
            <li>
              <strong className='font-medium'>posts:</strong> List of user's posts (Post[],
              @relation("UserPosts")).
            </li>
            <li>
              <strong className='font-medium'>comments:</strong> List of user's comments (Comment[],
              @relation("UserComments")).
            </li>
            <li>
              <strong className='font-medium'>createdAt:</strong> User creation timestamp (DateTime,
              @default(now())).
            </li>
          </ul>
        </li>
        <li>
          <strong className='font-medium'>Profile:</strong> User's profile, containing biographical
          information.
          <ul className='mt-1 list-disc pl-5'>
            <li>
              <strong className='font-medium'>id:</strong> Unique ID for each profile (Int, @id,
              @default(autoincrement())).
            </li>
            <li>
              <strong className='font-medium'>bio:</strong> User's biographical information
              (String?).
            </li>
            <li>
              <strong className='font-medium'>user:</strong> User associated with this profile
              (User, @relation("UserProfile", fields: [userId], references: [id])).
            </li>
            <li>
              <strong className='font-medium'>userId:</strong> ID of the user (Int, @unique).
            </li>
          </ul>
        </li>
        <li>
          <strong className='font-medium'>Post:</strong> A post created by a user.
          <ul className='mt-1 list-disc pl-5'>
            <li>
              <strong className='font-medium'>id:</strong> Unique ID for each post (Int, @id,
              @default(autoincrement())).
            </li>
            <li>
              <strong className='font-medium'>title:</strong> Title of the post (String).
            </li>
            <li>
              <strong className='font-medium'>content:</strong> Content of the post (String?).
            </li>
            <li>
              <strong className='font-medium'>author:</strong> User who created the post (User,
              @relation("UserPosts", fields: [authorId], references: [id])).
            </li>
            <li>
              <strong className='font-medium'>authorId:</strong> ID of the author (Int).
            </li>
            <li>
              <strong className='font-medium'>comments:</strong> List of comments on the post
              (Comment[]).
            </li>
            <li>
              <strong className='font-medium'>categories:</strong> List of categories associated
              with the post (PostCategory[]).
            </li>
            <li>
              <strong className='font-medium'>createdAt:</strong> Post creation timestamp (DateTime,
              @default(now())).
            </li>
          </ul>
        </li>
        <li>
          <strong className='font-medium'>Comment:</strong> A user's comment on a post.
          <ul className='mt-1 list-disc pl-5'>
            <li>
              <strong className='font-medium'>id:</strong> Unique ID for each comment (Int, @id,
              @default(autoincrement())).
            </li>
            <li>
              <strong className='font-medium'>content:</strong> Content of the comment (String).
            </li>
            <li>
              <strong className='font-medium'>post:</strong> Post to which the comment belongs
              (Post, @relation(fields: [postId], references: [id])).
            </li>
            <li>
              <strong className='font-medium'>postId:</strong> ID of the post (Int).
            </li>
            <li>
              <strong className='font-medium'>author:</strong> User who wrote the comment (User,
              @relation("UserComments", fields: [authorId], references: [id])).
            </li>
            <li>
              <strong className='font-medium'>authorId:</strong> ID of the author (Int).
            </li>
            <li>
              <strong className='font-medium'>createdAt:</strong> Comment creation timestamp
              (DateTime, @default(now())).
            </li>
          </ul>
        </li>
        <li>
          <strong className='font-medium'>Category:</strong> Category for posts.
          <ul className='mt-1 list-disc pl-5'>
            <li>
              <strong className='font-medium'>id:</strong> Unique ID for each category (Int, @id,
              @default(autoincrement())).
            </li>
            <li>
              <strong className='font-medium'>name:</strong> Name of the category (String, @unique).
            </li>
            <li>
              <strong className='font-medium'>description:</strong> Description of the category
              (String?).
            </li>
            <li>
              <strong className='font-medium'>posts:</strong> List of posts in this category
              (PostCategory[]).
            </li>
          </ul>
        </li>
        <li>
          <strong className='font-medium'>PostCategory:</strong> Association between a post and a
          category.
          <ul className='mt-1 list-disc pl-5'>
            <li>
              <strong className='font-medium'>post:</strong> Associated post (Post,
              @relation(fields: [postId], references: [id])).
            </li>
            <li>
              <strong className='font-medium'>postId:</strong> ID of the post (Int).
            </li>
            <li>
              <strong className='font-medium'>category:</strong> Associated category (Category,
              @relation(fields: [categoryId], references: [id])).
            </li>
            <li>
              <strong className='font-medium'>categoryId:</strong> ID of the category (Int).
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default CollectionDefine;