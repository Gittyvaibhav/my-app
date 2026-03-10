import { IndexType, Permission, Role } from "node-appwrite";

import { database } from "./config";
import { commentCollection, db } from "../name";
import { waitForAttributeAvailable } from "./schema.utils";

export default async function createCommentCollection() {
    await database.createCollection(
        db,
        commentCollection,
        "Comments",
        [
            Permission.create(Role.any()),
            Permission.read(Role.any()),
            Permission.read(Role.users()),
            Permission.create(Role.users()),
            Permission.update(Role.users()),
            Permission.delete(Role.users())
        ]
    );
    console.log("Comment collection created successfully");

    await Promise.all([
        database.createStringAttribute(db, commentCollection, "content", 10000, true),
        database.createEnumAttribute(db, commentCollection, "type", ["answer", "question"], true),
        database.createStringAttribute(db, commentCollection, "typeId", 50, true),
        database.createStringAttribute(db, commentCollection, "authorId", 50, true),
    ]);
    console.log("Comment attributes created successfully");

    await Promise.all([
        waitForAttributeAvailable(db, commentCollection, "authorId"),
        waitForAttributeAvailable(db, commentCollection, "type"),
        waitForAttributeAvailable(db, commentCollection, "typeId"),
    ]);

    await Promise.all([
        database.createIndex(db, commentCollection, "authorId_index", IndexType.Key, ["authorId"]),
        database.createIndex(db, commentCollection, "type_index", IndexType.Key, ["type"]),
        database.createIndex(db, commentCollection, "typeId_index", IndexType.Key, ["typeId"]),
    ]);
    console.log("Comment indexes created successfully");
}
