import {db} from "../name";
import createAnswerCollection from "./answer.collection";
import createCommentCollection from "./comment.collection";
import createQuestionCollection from "./question.collection";
import createVoteCollection from "./vote.collection";
import getOrCreateStorage from "./storage.collection";
import { database } from "./config";

export default async function getOrCreateDB() {
    try {
        await database.get(db);
        console.log("Database Connected");
    } catch (error) {
        try {
            await database.create(db, "Main Stackflow Database");
            console.log("Database Created");
            //create collections and storage in parallel
            await Promise.all([
                createQuestionCollection(),
                createAnswerCollection(),
                createCommentCollection(),
                createVoteCollection(),
                getOrCreateStorage()
            ]);
            console.log("Collections and Storage Created");
            console.log("Database setup completed successfully");
        } catch (createError) {
            console.log("Database Error", createError);
            throw createError;
        }
    }
    return database;
}