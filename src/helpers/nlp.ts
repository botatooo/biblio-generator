/*
 * Copyright (c) 2023 Adnan-Aidan Taha
 */

import nlp from "compromise";


export const is_human_name = (name: string) => {
  const doc = nlp(name);
  const people = doc.people().json();
  return people.length > 0;
}