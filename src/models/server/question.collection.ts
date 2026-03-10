import { IndexType, Permission, Role } from "node-appwrite";

import { database } from "./config";
import { db, questionCollection } from "../name";

export default async function createQuestionCollection() {
    await database.createCollection(
        db,
        questionCollection,
        "Questions", // <-- collection name (required)
        [
            Permission.create(Role.any()),
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    );
    console.log("Question collection created successfully");

    //creating attributes and indexes for question collection
    await Promise.all([
        database.createStringAttribute(db, questionCollection, "title", 100, true),
        database.createStringAttribute(db, questionCollection, "content", 65535, true),
        database.createStringAttribute(db, questionCollection, "authorId", 255, true),
        database.createIntegerAttribute(db, questionCollection, "tags", true, 50, undefined, undefined, true),
        database.createDatetimeAttribute(db, questionCollection, "attachmentId", true, undefined, true),

    ]);
    console.log("Attributes created successfully");

    //create indexes for question collection
    // await Promise.all([
    //     database.createIndex(db, questionCollection,
    //      "title",
    //      IndexType.Fulltext,
    //      ["text"]),
    //     database.createIndex(db, questionCollection,
    //      "content",
    //      IndexType.Fulltext,
    //         ["text"]),
    //     database.createIndex(db, questionCollection,
    //      "authorId",
    //      IndexType.Key,
    //      ["text"])

    // ]);
    // console.log("Indexes created successfully");
}
