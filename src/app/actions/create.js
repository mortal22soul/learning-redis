"use server";

import { client } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createBook(formData) {
  const { title, rating, author, blurb } = Object.fromEntries(formData);

  // create a random id for the book
  const id = Math.floor(Math.random() * 100000);

  // add book to a sorted set
  const unique = await client.zAdd(
    "books",
    {
      value: title,
      score: id,
    },
    { NX: true }
  );

  if (!unique) {
    return {
      error: "Book already exists",
    };
  }

  // add book to a hash
  await client.hSet(`books:${id}`, {
    title,
    rating,
    author,
    blurb,
  });

  redirect("/");
}
