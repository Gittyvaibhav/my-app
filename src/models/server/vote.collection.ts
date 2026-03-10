import { IndexType, Permission, Role } from "node-appwrite";

import { database } from "./config";
import { db, voteCollection } from "../name";
import { waitForAttributeAvailable } from "./schema.utils";

export default async function createVoteCollection() {
    await database.createCollection(
        db,
        voteCollection,
        "Votes",
        [
            Permission.create(Role.any()),
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    );
    console.log("Vote collection created successfully");

    await Promise.all([
        database.createStringAttribute(db, voteCollection, "userId", 255, true),
        database.createStringAttribute(db, voteCollection, "questionId", 255, false),
        database.createStringAttribute(db, voteCollection, "answerId", 255, false),
        database.createIntegerAttribute(db, voteCollection, "value", true, -1, 1, undefined, false),
    ]);
    console.log("Vote attributes created successfully");

    await Promise.all([
        waitForAttributeAvailable(db, voteCollection, "userId"),
        waitForAttributeAvailable(db, voteCollection, "questionId"),
        waitForAttributeAvailable(db, voteCollection, "answerId"),
    ]);

    await Promise.all([
        database.createIndex(db, voteCollection, "userId_index", IndexType.Key, ["userId"]),
        database.createIndex(db, voteCollection, "questionId_index", IndexType.Key, ["questionId"]),
        database.createIndex(db, voteCollection, "answerId_index", IndexType.Key, ["answerId"]),
    ]);
    console.log("Vote indexes created successfully");
}
