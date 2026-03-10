import { IndexType, Permission, Role } from "node-appwrite";

import { database } from "./config";
import { answerCollection, db } from "../name";
import { waitForAttributeAvailable } from "./schema.utils";

export default async function createAnswerCollection() {
    await database.createCollection(
        db,
        answerCollection,
        "Answers",
        [
            Permission.create(Role.any()),
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    );
    console.log("Answer collection created successfully");

    await Promise.all([
        database.createStringAttribute(db, answerCollection, "content", 65535, true),
        database.createStringAttribute(db, answerCollection, "authorId", 255, true),
        database.createStringAttribute(db, answerCollection, "questionId", 255, true),
        database.createIntegerAttribute(db, answerCollection, "votes", false, 0, undefined, 0, false),
        database.createDatetimeAttribute(db, answerCollection, "acceptedAt", false, undefined, false),
    ]);
    console.log("Answer attributes created successfully");

    await Promise.all([
        waitForAttributeAvailable(db, answerCollection, "questionId"),
        waitForAttributeAvailable(db, answerCollection, "authorId"),
    ]);

    await Promise.all([
        database.createIndex(db, answerCollection, "questionId_index", IndexType.Key, ["questionId"]),
        database.createIndex(db, answerCollection, "authorId_index", IndexType.Key, ["authorId"]),
    ]);
    console.log("Answer indexes created successfully");
}
