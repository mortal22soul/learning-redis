import { client } from "@/lib/db";
import Link from "next/link";

// getBooks function to get all books from Redis
// pipeline to get all books from the sorted set where we pipe the zRangeWithScores command to get the books and their scores

const getBooks = async () => {
  const result = await client.zRangeWithScores("books", 0, -1);

  const books = await Promise.all(
    result.map((b) => {
      return client.hGetAll(`books:${b.score}`);
    })
  );

  return books;
};

export default async function Home() {
  const books = await getBooks();

  return (
    <main>
      <nav className="flex justify-between">
        <h1 className="font-bold">Books on Redis!</h1>
        <Link href="/create" className="btn">
          Add a new book
        </Link>
      </nav>

      {books.length
        ? books.map((book) => (
            <article key={book.id} className="card">
              <h2>{book.title}</h2>
              <p>Author: {book.author}</p>
              <p>Rating: {book.rating}</p>
              <p>{book.blurb}</p>
            </article>
          ))
        : "No books found"}
    </main>
  );
}
