import { Compression, Permission, Role } from "node-appwrite";

import { questionAttachmentBucket } from "../name";
import { storage } from "./config";

export default async function getOrCreateStorage() {
    try {
        await storage.getBucket(questionAttachmentBucket);
        console.log("Storage Connected");
    } catch (error) {
        try {
            await storage.createBucket(
                questionAttachmentBucket,
                questionAttachmentBucket,
                [
                    Permission.create(Role.users()),
                    Permission.read(Role.any()),
                    Permission.read(Role.users()),
                    Permission.update(Role.users()),
                    Permission.delete(Role.users()),
                ],
                true,
                true,
                10 * 1024 * 1024,
                ["jpg", "jpeg", "png", "webp", "gif", "pdf"],
                Compression.Gzip,
                true,
                true,
                true
            );
            console.log("Storage Created");
        } catch (createError) {
            console.log("Storage Error", createError);
            throw createError;
        }
    }
}
